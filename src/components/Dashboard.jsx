import { motion } from "framer-motion";
import { formatCurrency } from "../utils/format";

/**
 * En üstte yer alan özet panel: harcanan/kalan bütçe kartları ve
 * genel ilerleme çubuğu. `summary`, GET /api/budget/summary
 * cevabının aynısıdır.
 */
export default function Dashboard({ summary, loading }) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-28 rounded-3xl bg-cream-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const {
    purchasedCost,
    remainingEstimate,
    totalItems,
    purchasedItems,
    progressPercent,
  } = summary;

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <SummaryCard
          label="Harcanan Bütçe"
          value={formatCurrency(purchasedCost)}
          accent="sage"
          sub={`${purchasedItems} ürün alındı`}
        />
        <SummaryCard
          label="Tahmini Kalan"
          value={formatCurrency(remainingEstimate)}
          accent="dusty"
          sub={`${totalItems - purchasedItems} ürün bekliyor`}
        />
        <SummaryCard
          label="Genel İlerleme"
          value={`%${progressPercent}`}
          accent="clay"
          sub={`${totalItems} üründen ${purchasedItems} tanesi tamam`}
        />
      </div>

      {/* İlerleme çubuğu */}
      <div className="bg-white rounded-2xl shadow-soft p-5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-sm font-medium text-clay-500">
            Çeyiz Hazırlık İlerlemesi
          </span>
          <span className="text-sm font-semibold text-sage-600">
            %{progressPercent}
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-cream-200 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sage-300 to-sage-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

const ACCENT_STYLES = {
  sage: { bg: "bg-sage-50", text: "text-sage-700", ring: "ring-sage-100" },
  dusty: { bg: "bg-dusty-50", text: "text-dusty-600", ring: "ring-dusty-100" },
  clay: { bg: "bg-clay-50", text: "text-clay-600", ring: "ring-clay-100" },
};

function SummaryCard({ label, value, sub, accent }) {
  const style = ACCENT_STYLES[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-3xl p-5 shadow-soft ring-1 ${style.bg} ${style.ring}`}
    >
      <p className={`text-xs font-medium uppercase tracking-wide ${style.text} opacity-80 mb-2`}>
        {label}
      </p>
      <p className={`text-2xl font-bold ${style.text} mb-1`}>{value}</p>
      <p className="text-xs text-clay-400">{sub}</p>
    </motion.div>
  );
}
