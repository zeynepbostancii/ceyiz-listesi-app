import { motion } from "framer-motion";
import { formatCurrency, getStatusConfig } from "../utils/format";

/**
 * Tek bir ürünü temsil eden kart. Durumu "Alındı" yapmak/geri almak
 * için sağ üstte şık bir toggle butonu bulunur.
 */
export default function ItemCard({ item, onToggleStatus, onDelete, onEdit }) {
  const status = getStatusConfig(item.status);
  const isPurchased = item.status === "purchased";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className={`group relative rounded-3xl bg-white shadow-soft hover:shadow-soft-md transition-shadow duration-200 overflow-hidden ${
        isPurchased ? "opacity-70" : ""
      }`}
    >
      {/* Görsel alanı */}
      <div className="relative h-36 bg-cream-200 flex items-center justify-center overflow-hidden">
        {item.photoUrl ? (
          <img
            src={item.photoUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span className="text-4xl opacity-40">🎁</span>
        )}

        {/* Durum rozeti */}
        <span
          className={`absolute top-2.5 left-2.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${status.badgeClass}`}
        >
          {status.label}
        </span>

        {/* Düzenle / silme butonları - hover'da belirir */}
        <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(item)}
            className="h-7 w-7 rounded-full bg-white/90 text-clay-400 flex items-center justify-center hover:text-sage-600"
            aria-label="Ürünü düzenle"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="h-7 w-7 rounded-full bg-white/90 text-clay-400 flex items-center justify-center hover:text-dusty-500"
            aria-label="Ürünü sil"
          >
            ✕
          </button>
        </div>
      </div>

      {/* İçerik */}
      <div className="p-4">
        {item.brand && (
          <p className="text-[11px] font-medium text-clay-400 uppercase tracking-wide mb-0.5">
            {item.brand}
          </p>
        )}
        <h3 className="text-sm font-semibold text-clay-600 leading-snug mb-1 line-clamp-2">
          {item.name}
        </h3>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-base font-bold text-sage-700">
            {formatCurrency(item.price)}
          </span>
          {item.quantity > 1 && (
            <span className="text-xs text-clay-400">× {item.quantity}</span>
          )}
        </div>

        <ToggleButton isPurchased={isPurchased} onClick={() => onToggleStatus(item)} />
      </div>
    </motion.div>
  );
}

function ToggleButton({ isPurchased, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200
        ${
          isPurchased
            ? "bg-sage-50 text-sage-600 hover:bg-sage-100"
            : "bg-sage-500 text-white hover:bg-sage-600"
        }
      `}
    >
      <motion.span
        key={isPurchased ? "check" : "plus"}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {isPurchased ? "✓" : "+"}
      </motion.span>
      {isPurchased ? "Alındı — Geri Al" : "Alındı Olarak İşaretle"}
    </button>
  );
}
