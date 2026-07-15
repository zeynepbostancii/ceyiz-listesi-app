# 🎀 Çeyiz Takip — Vercel'e Hazır Sürüm

Bu klasör, orijinal `backend + frontend` projesinin **tek parça, Vercel'e sıfır ayarla yüklenebilen** halidir.

## Neler değişti?

- **Backend (Express + SQLite) kaldırıldı.** Artık ayrı bir sunucu çalıştırmanıza gerek yok.
- **Veriler artık tarayıcıda saklanıyor** (`localStorage`). Siteyi kim kullanırsa kullansın, kendi listesini görür — kimsenin verisi kimseyle karışmaz.
- **"Linkten Çek" özelliği korundu** — artık `api/parse-link.js` adında küçük bir Vercel Serverless Function olarak çalışıyor. Veritabanı gerektirmediği için Vercel'de sorunsuz çalışır.
- Tasarım, kategoriler, bütçe özeti, ilerleme çubuğu — hepsi aynen duruyor.

## Vercel'e yükleme

1. Bu klasörü GitHub reponuza yükleyin (GitHub Desktop ile: **Add local repository** → **Publish repository**)
2. [vercel.com](https://vercel.com) → GitHub hesabınızla giriş yapın
3. **Add New Project** → reponuzu seçin
4. Vercel, Vite projesini otomatik tanır — hiçbir ayar değiştirmeden **Deploy** deyin
5. Birkaç dakika içinde `sizin-projeniz.vercel.app` adresiniz hazır olur

Kodda değişiklik yapıp tekrar GitHub'a **push/Commit + Push** yaptığınızda, site otomatik güncellenir.

## Önemli: Veriler hakkında

- Her ziyaretçi (siz dahil) **kendi tarayıcısında** kendi listesini oluşturur ve görür
- Liste, tarayıcı geçmişi/site verileri temizlenirse silinir
- Farklı cihaz/tarayıcıdan girildiğinde liste sıfırdan başlar (boş, varsayılan kategorilerle dolu gelir)
- Önemli bir listeyi kaybetmemek için düzenli olarak yedeklemenizi öneririz (ileride "Dışa Aktar" özelliği eklenebilir)

## Yerelde çalıştırma

```bash
npm install
npm run dev
```

`http://localhost:5173` adresini açın. "Linkten Çek" özelliği yerelde de çalışır (Vite, `/api` klasörünü otomatik olarak dev sunucusunda da çalıştırır).

## Yapı

```
├── api/
│   └── parse-link.js      ← Vercel Serverless Function (link'ten ürün bilgisi çeker)
├── public/                 ← statik dosyalar (favicon, ikonlar)
├── src/
│   ├── api/client.js       ← localStorage tabanlı veri katmanı
│   ├── data/seedData.js    ← ilk açılışta gelen varsayılan çeyiz listesi
│   ├── components/         ← arayüz bileşenleri (değişmedi)
│   └── App.jsx
├── index.html
├── package.json
└── vite.config.js
```
