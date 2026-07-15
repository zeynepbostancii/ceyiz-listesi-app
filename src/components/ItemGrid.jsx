import { AnimatePresence } from "framer-motion";
import ItemCard from "./ItemCard";

export default function ItemGrid({ items, loading, onToggleStatus, onDelete, onEdit }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 rounded-3xl bg-cream-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl shadow-soft">
        <p className="text-3xl mb-2">🎀</p>
        <p className="text-sm font-medium text-clay-500">
          Bu kategoride henüz ürün yok.
        </p>
        <p className="text-xs text-clay-400 mt-1">
          Yukarıdaki "Yeni Ürün Ekle" ile ilk ürünü ekleyebilirsin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
