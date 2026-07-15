export function formatCurrency(value) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(value);
}

// Durum -> görsel/metin eşlemesi. Tek yerden yönetilir ki tüm
// bileşenlerde (kart, filtre, rozet) tutarlı görünsün.
export const STATUS_CONFIG = {
  planned: {
    label: "Alınacak",
    badgeClass: "bg-cream-300 text-clay-600",
    dotClass: "bg-clay-400",
  },
  priority: {
    label: "Öncelikli",
    badgeClass: "bg-dusty-100 text-dusty-600",
    dotClass: "bg-dusty-400",
  },
  optional: {
    label: "İsteğe Bağlı",
    badgeClass: "bg-sage-100 text-sage-700",
    dotClass: "bg-sage-400",
  },
  purchased: {
    label: "Alındı",
    badgeClass: "bg-sage-500 text-white",
    dotClass: "bg-sage-600",
  },
};

export function getStatusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.planned;
}
