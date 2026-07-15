/**
 * Vercel Serverless Function: POST /api/parse-link
 * Body: { url: "https://..." }
 *
 * Ürün linkinden ad/foto/fiyat/marka çekip form alanlarını doldurmak
 * için ham veri döner. Veritabanına KAYIT YAPMAZ — sadece ön-doldurma
 * verisi sağlar; kullanıcı formu düzenleyip kaydeder (kayıt tarayıcıda,
 * localStorage'da tutulur).
 *
 * Bu dosya hiçbir kalıcı veri saklamaz, bu yüzden Vercel'in sunucusuz
 * (serverless) fonksiyon yapısıyla tam uyumludur.
 */
import ogs from "open-graph-scraper";
import axios from "axios";
import * as cheerio from "cheerio";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const PRICE_REGEX = /(?:₺|TL|TRY)\s?([\d.,]+)|([\d.,]+)\s?(?:₺|TL|TRY)/i;

function extractPriceFromText(text) {
  if (!text) return null;
  const match = text.match(PRICE_REGEX);
  if (!match) return null;
  const rawNumber = match[1] || match[2];
  if (!rawNumber) return null;
  const normalized = rawNumber.replace(/\./g, "").replace(",", ".");
  const value = parseFloat(normalized);
  return Number.isFinite(value) ? value : null;
}

async function tryOpenGraph(url) {
  const { result, error } = await ogs({
    url,
    fetchOptions: { headers: { "user-agent": USER_AGENT }, timeout: 8000 },
  });
  if (error || !result?.success) return null;

  const title = result.ogTitle || result.twitterTitle || null;
  const image = result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || null;

  let price = null;
  if (result.ogPriceAmount) {
    price = parseFloat(String(result.ogPriceAmount).replace(",", "."));
  } else if (result.ogProductPriceAmount) {
    price = parseFloat(String(result.ogProductPriceAmount).replace(",", "."));
  }

  return {
    name: title,
    photoUrl: image,
    price: Number.isFinite(price) ? price : null,
    brand: result.ogSiteName || null,
  };
}

async function tryHtmlFallback(url) {
  const { data: html } = await axios.get(url, {
    headers: { "user-agent": USER_AGENT },
    timeout: 8000,
  });
  const $ = cheerio.load(html);

  let jsonLdPrice = null;
  let jsonLdName = null;
  let jsonLdImage = null;
  let jsonLdBrand = null;

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).contents().text());
      const nodes = Array.isArray(parsed) ? parsed : [parsed];
      for (const node of nodes) {
        if (node["@type"] === "Product" || node?.["@type"]?.includes?.("Product")) {
          jsonLdName = jsonLdName || node.name;
          jsonLdImage = jsonLdImage || (Array.isArray(node.image) ? node.image[0] : node.image);
          jsonLdBrand = jsonLdBrand || node.brand?.name || node.brand;
          const offer = Array.isArray(node.offers) ? node.offers[0] : node.offers;
          if (offer?.price) jsonLdPrice = parseFloat(offer.price);
        }
      }
    } catch {
      // structured data değil, atla
    }
  });

  if (jsonLdName || jsonLdPrice) {
    return {
      name: jsonLdName || null,
      photoUrl: jsonLdImage || null,
      price: Number.isFinite(jsonLdPrice) ? jsonLdPrice : null,
      brand: jsonLdBrand || null,
    };
  }

  const bodyText = $("body").text();
  const price = extractPriceFromText(bodyText);
  const title = $("title").first().text().trim() || null;

  return {
    name: title,
    photoUrl: $('meta[property="og:image"]').attr("content") || null,
    price,
    brand: null,
  };
}

async function scrapeProductFromUrl(url) {
  new URL(url);

  let ogData = null;
  try {
    ogData = await tryOpenGraph(url);
  } catch {
    ogData = null;
  }

  const needsFallback = !ogData || !ogData.name || ogData.price === null;
  let fallbackData = null;
  if (needsFallback) {
    try {
      fallbackData = await tryHtmlFallback(url);
    } catch {
      fallbackData = null;
    }
  }

  const merged = {
    name: ogData?.name || fallbackData?.name || null,
    photoUrl: ogData?.photoUrl || fallbackData?.photoUrl || null,
    price: ogData?.price ?? fallbackData?.price ?? null,
    brand: ogData?.brand || fallbackData?.brand || null,
    sourceLink: url,
  };

  if (!merged.name && !merged.photoUrl && merged.price === null) {
    const err = new Error(
      "Bu siteden otomatik veri çekilemedi. Site JavaScript ile render ediliyor olabilir; lütfen bilgileri manuel girin."
    );
    err.code = "SCRAPE_FAILED";
    throw err;
  }

  if (merged.price === null) {
    merged.warning = "Fiyat otomatik tespit edilemedi, lütfen kontrol edip elle girin.";
  }

  return merged;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Sadece POST desteklenir." });
    return;
  }

  const { url } = req.body || {};
  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "Geçerli bir 'url' alanı gereklidir." });
    return;
  }

  try {
    new URL(url);
  } catch {
    res.status(400).json({ error: "URL formatı geçersiz." });
    return;
  }

  try {
    const data = await scrapeProductFromUrl(url);
    res.status(200).json(data);
  } catch (err) {
    if (err.code === "SCRAPE_FAILED") {
      res.status(422).json({ error: err.message, fallbackToManual: true });
      return;
    }
    console.error("Link parse hatası:", err.message);
    res.status(500).json({
      error: "Link işlenirken beklenmeyen bir hata oluştu. Lütfen manuel giriş yapın.",
      fallbackToManual: true,
    });
  }
};
