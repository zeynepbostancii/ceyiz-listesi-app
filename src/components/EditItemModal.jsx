import { useState } from "react";
import { motion } from "framer-motion";
import { updateItem } from "../api/client";

/**
 * Mevcut bir ürünü düzenlemek için modal form. AddItemPanel'deki
 * alanların aynısını kullanır (ad, marka, fiyat, adet, kategori,
 * durum, fotoğraf, link) ama bir ürünü YENİ eklemek yerine var olanı
 * günceller.
 */
export default function EditItemModal({ item, categories, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: item.name || "",
    brand: item.brand || "",
    price: item.price ?? "",
    quantity: item.quantity ?? 1,
    photoUrl: item.photoUrl || "",
    sourceLink: item.sourceLink || "",
    categoryId: item.categoryId,
    status: item.status,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    setIsSaving(true);
    try {
      const updated = await updateItem(item.id, {
        name: form.name.trim(),
        brand: form.brand.trim() || null,
        price: form.price === "" ? null : parseFloat(form.price),
        quantity: Number(form.quantity) || 1,
        photoUrl: form.photoUrl || null,
        sourceLink: form.sourceLink || null,
        categoryId: form.categoryId,
        status: form.status,
      });
      onSaved(updated);
    } catch (err) {
      setErrorMsg("Ürün güncellenemedi, tekrar dene.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-clay-600/30 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-soft-md p-5 sm:p-6 max-h-[88vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-clay-600">Ürünü Düzenle</h2>
          <button
            onClick={onClose}
            className="text-clay-400 hover:text-clay-600 text-sm"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Ürün Adı *">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
              />
            </Field>

            <Field label="Marka">
              <input
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
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

            <Field label="Kategori">
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
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

          <Field label="Fotoğraf bağlantısı (URL)">
            <input
              value={form.photoUrl}
              onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
              placeholder="https://…jpg"
              className="input-field"
            />
          </Field>

          {form.photoUrl && (
            <div className="flex items-center gap-3 bg-cream-50 rounded-xl p-2.5">
              <img
                src={form.photoUrl}
                alt="Önizleme"
                className="h-14 w-14 rounded-lg object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <span className="text-xs text-clay-400">Fotoğraf önizlemesi</span>
            </div>
          )}

          <Field label="Ürün linki">
            <input
              value={form.sourceLink}
              onChange={(e) => setForm({ ...form, sourceLink: e.target.value })}
              placeholder="https://…"
              className="input-field"
            />
          </Field>

          {errorMsg && <p className="text-xs text-dusty-600">⚠️ {errorMsg}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-clay-500 hover:bg-cream-100 transition-colors duration-200"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSaving || !form.name.trim()}
              className="px-5 py-2.5 rounded-xl bg-sage-500 text-white text-sm font-semibold hover:bg-sage-600 disabled:opacity-50 transition-colors duration-200"
            >
              {isSaving ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </motion.div>
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
