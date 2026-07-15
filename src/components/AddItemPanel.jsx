import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseProductLink, createItem } from "../api/client";

const EMPTY_FORM = {
  name: "",
  brand: "",
  price: "",
  quantity: 1,
  photoUrl: "",
  sourceLink: "",
  status: "planned",
};

/**
 * Üstte link input'u; link çekme başarılı olursa altındaki form
 * otomatik doldurulur. Link olmadan da doğrudan "Manuel Ekle"ye
 * basıp formu elle doldurmak mümkündür.
 */
export default function AddItemPanel({ categories, activeCategoryId, onItemAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parseMessage, setParseMessage] = useState(null); // { type: 'warning'|'error', text }
  const [form, setForm] = useState(EMPTY_FORM);
  const [categoryId, setCategoryId] = useState(activeCategoryId || "");
  const [isSaving, setIsSaving] = useState(false);

  const effectiveCategoryId = categoryId || activeCategoryId || categories[0]?.id || "";

  async function handleParseLink() {
    if (!linkUrl.trim()) return;
    setIsParsing(true);
    setParseMessage(null);

    try {
      const data = await parseProductLink(linkUrl.trim());
      setForm((prev) => ({
        ...prev,
        name: data.name || prev.name,
        brand: data.brand || prev.brand,
        price: data.price ?? prev.price,
        photoUrl: data.photoUrl || prev.photoUrl,
        sourceLink: linkUrl.trim(),
      }));
      if (data.warning) {
        setParseMessage({ type: "warning", text: data.warning });
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        "Link işlenemedi. Lütfen bilgileri manuel olarak girin.";
      setParseMessage({ type: "error", text: message });
      setForm((prev) => ({ ...prev, sourceLink: linkUrl.trim() }));
    } finally {
      setIsParsing(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !effectiveCategoryId) return;

    setIsSaving(true);
    try {
      const created = await createItem({
        categoryId: effectiveCategoryId,
        name: form.name.trim(),
        brand: form.brand.trim() || null,
        price: form.price === "" ? null : parseFloat(form.price),
        quantity: Number(form.quantity) || 1,
        photoUrl: form.photoUrl || null,
        sourceLink: form.sourceLink || null,
        status: form.status,
      });
      onItemAdded(created);
      resetPanel();
    } catch (err) {
      setParseMessage({
        type: "error",
        text: err.response?.data?.error || "Ürün kaydedilemedi.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  function resetPanel() {
    setForm(EMPTY_FORM);
    setLinkUrl("");
    setParseMessage(null);
    setIsOpen(false);
  }

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-dusty-400 text-white text-sm font-semibold shadow-soft hover:bg-dusty-500 transition-colors duration-200"
        >
          <span className="text-lg leading-none">+</span> Yeni Ürün Ekle
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-soft-md p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-clay-600">Yeni Ürün Ekle</h2>
            <button
              onClick={resetPanel}
              className="text-clay-400 hover:text-clay-600 text-sm"
              aria-label="Kapat"
            >
              ✕
            </button>
          </div>

          {/* Linkten veri çek */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-clay-500 mb-1.5">
              Ürün linki (opsiyonel)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://www.ornek-magaza.com/urun/..."
                className="flex-1 rounded-xl border border-cream-300 bg-cream-50 px-3.5 py-2.5 text-sm text-clay-600 placeholder:text-clay-300 focus:border-sage-400 focus:ring-1 focus:ring-sage-400 outline-none"
              />
              <button
                onClick={handleParseLink}
                disabled={isParsing || !linkUrl.trim()}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-sage-500 text-white text-sm font-medium hover:bg-sage-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isParsing ? "Çekiliyor…" : "Linkten Çek"}
              </button>
            </div>

            <AnimatePresence>
              {parseMessage && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-2 text-xs ${
                    parseMessage.type === "error" ? "text-dusty-600" : "text-clay-500"
                  }`}
                >
                  {parseMessage.type === "error" ? "⚠️ " : "ℹ️ "}
                  {parseMessage.text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="h-px bg-cream-200 mb-5" />

          {/* Manuel / doldurulmuş form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Ürün Adı *" required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Örn. Çelik Tencere Seti"
                  className="input-field"
                />
              </Field>

              <Field label="Marka">
                <input
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="Örn. Karaca"
                  className="input-field"
                />
              </Field>

              <Field label="Fiyat (₺)">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  className="input-field"
                />
              </Field>

              <Field label="Adet">
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="input-field"
                />
              </Field>

              <Field label="Kategori *">
                <select
                  value={effectiveCategoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="input-field"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Durum">
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="input-field"
                >
                  <option value="planned">Alınacak</option>
                  <option value="priority">Öncelikli</option>
                  <option value="optional">İsteğe Bağlı</option>
                  <option value="purchased">Alındı</option>
                </select>
              </Field>
            </div>

            {form.photoUrl && (
              <div className="flex items-center gap-3 bg-cream-50 rounded-xl p-2.5">
                <img
                  src={form.photoUrl}
                  alt="Önizleme"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <span className="text-xs text-clay-400">Linkten çekilen görsel</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={resetPanel}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-clay-500 hover:bg-cream-100 transition-colors duration-200"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={isSaving || !form.name.trim()}
                className="px-5 py-2.5 rounded-xl bg-sage-500 text-white text-sm font-semibold hover:bg-sage-600 disabled:opacity-50 transition-colors duration-200"
              >
                {isSaving ? "Kaydediliyor…" : "Ürünü Kaydet"}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-clay-500 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
