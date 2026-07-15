import { motion } from "framer-motion";

/**
 * Yatay, kaydırılabilir kategori tab menüsü.
 * Aktif kategori sage yeşili ile vurgulanır, altında yumuşak bir
 * "layoutId" animasyonlu şerit kayar.
 */
export default function CategoryNav({ categories, activeId, onSelect, loading }) {
  if (loading) {
    return (
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-28 rounded-2xl bg-cream-200 animate-pulse shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
      <TabButton
        label="Tümü"
        icon="✨"
        isActive={activeId === null}
        onClick={() => onSelect(null)}
      />
      {categories.map((cat) => (
        <TabButton
          key={cat.id}
          label={cat.name}
          icon={cat.icon}
          isActive={activeId === cat.id}
          onClick={() => onSelect(cat.id)}
          count={cat.summary?.totalItems}
        />
      ))}
    </div>
  );
}

function TabButton({ label, icon, isActive, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors duration-200
        ${isActive ? "text-white" : "text-clay-500 bg-white hover:bg-cream-200"}
      `}
    >
      {isActive && (
        <motion.span
          layoutId="active-category-pill"
          className="absolute inset-0 rounded-2xl bg-sage-500 shadow-soft"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10">{label}</span>
      {count !== undefined && (
        <span
          className={`relative z-10 text-xs px-1.5 py-0.5 rounded-full ${
            isActive ? "bg-white/25" : "bg-cream-200 text-clay-400"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
