/**
 * Bu dosya eskiden backend'e (Express + SQLite) istek atan axios
 * istemcisiydi. Artık backend yok — tüm veriler tarayıcının
 * localStorage'ında saklanıyor. Fonksiyon isimleri ve döndürdükleri
 * veri şekli AYNI bırakıldı ki App.jsx ve AddItemPanel.jsx hiç
 * değişmeden çalışabilsin.
 *
 * Not: localStorage cihaza/tarayıcıya özeldir. Siteyi kullanan her
 * kişi kendi listesini görür, kimsenin verisi kimseyle karışmaz.
 */
import { CATEGORY_DEFS } from "../data/seedData";

const CATEGORIES_KEY = "ceyiz_categories_v1";
const ITEMS_KEY = "ceyiz_items_v1";

const uuid = () =>
  crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

// --- Ham okuma/yazma yardımcıları ---
function readCategories() {
  const raw = localStorage.getItem(CATEGORIES_KEY);
  return raw ? JSON.parse(raw) : null;
}

function readItems() {
  const raw = localStorage.getItem(ITEMS_KEY);
  return raw ? JSON.parse(raw) : null;
}

function writeCategories(list) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(list));
}

function writeItems(list) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(list));
}

// İlk açılışta hiç veri yoksa varsayılan listeyi oluştur (idempotent)
function ensureSeeded() {
  const existingCategories = readCategories();
  if (existingCategories && existingCategories.length > 0) return;

  const categories = [];
  const items = [];

  CATEGORY_DEFS.forEach((cat, index) => {
    const categoryId = uuid();
    categories.push({
      id: categoryId,
      name: cat.name,
      icon: cat.icon,
      colorTag: cat.colorTag,
      sortOrder: index,
    });

    cat.items.forEach((item) => {
      const now = new Date().toISOString();
      items.push({
        id: uuid(),
        categoryId,
        name: item.name,
        brand: null,
        photoUrl: null,
        sourceLink: null,
        price: null,
        currency: "TRY",
        quantity: item.quantity,
        status: item.status,
        notes: null,
        createdAt: now,
        updatedAt: now,
        purchasedAt: null,
      });
    });
  });

  writeCategories(categories);
  writeItems(items);
}

ensureSeeded();

function categorySummary(categoryId, items) {
  const inCategory = items.filter((i) => i.categoryId === categoryId);
  const purchased = inCategory.filter((i) => i.status === "purchased");
  return {
    totalItems: inCategory.length,
    purchasedItems: purchased.length,
    purchasedCost: purchased.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0),
    remainingEstimate: inCategory
      .filter((i) => i.status !== "purchased")
      .reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0),
  };
}

// --- Kategoriler ---
export async function fetchCategories() {
  const categories = readCategories() || [];
  const items = readItems() || [];
  return categories
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((cat) => ({ ...cat, summary: categorySummary(cat.id, items) }));
}

export async function createCategory(payload) {
  const categories = readCategories() || [];
  const maxOrder = categories.reduce((m, c) => Math.max(m, c.sortOrder ?? -1), -1);
  const created = {
    id: uuid(),
    name: payload.name.trim(),
    icon: payload.icon || "📦",
    colorTag: payload.colorTag || "soft-beige",
    sortOrder: maxOrder + 1,
  };
  writeCategories([...categories, created]);
  return created;
}

export async function deleteCategory(id) {
  const categories = (readCategories() || []).filter((c) => c.id !== id);
  const items = (readItems() || []).filter((i) => i.categoryId !== id);
  writeCategories(categories);
  writeItems(items);
}

// --- Ürünler ---
export async function fetchItems(params = {}) {
  let items = readItems() || [];
  if (params.categoryId) items = items.filter((i) => i.categoryId === params.categoryId);
  if (params.status) items = items.filter((i) => i.status === params.status);
  if (params.search) {
    const q = params.search.toLowerCase();
    items = items.filter((i) => i.name.toLowerCase().includes(q));
  }
  return items.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createItem(payload) {
  const items = readItems() || [];
  const now = new Date().toISOString();
  const created = {
    id: uuid(),
    categoryId: payload.categoryId,
    name: payload.name.trim(),
    brand: payload.brand || null,
    photoUrl: payload.photoUrl || null,
    sourceLink: payload.sourceLink || null,
    price: payload.price ?? null,
    currency: payload.currency || "TRY",
    quantity: payload.quantity ?? 1,
    status: payload.status || "planned",
    notes: payload.notes || null,
    createdAt: now,
    updatedAt: now,
    purchasedAt: payload.status === "purchased" ? now : null,
  };
  writeItems([created, ...items]);
  return created;
}

export async function updateItem(id, payload) {
  const items = readItems() || [];
  const now = new Date().toISOString();
  let updated = null;
  const next = items.map((item) => {
    if (item.id !== id) return item;
    updated = {
      ...item,
      ...payload,
      updatedAt: now,
      purchasedAt:
        payload.status === "purchased"
          ? item.purchasedAt || now
          : payload.status
          ? null
          : item.purchasedAt,
    };
    return updated;
  });
  writeItems(next);
  return updated;
}

export async function deleteItem(id) {
  const items = (readItems() || []).filter((i) => i.id !== id);
  writeItems(items);
}

// --- Link'ten otomatik doldurma (Vercel serverless fonksiyonu) ---
export async function parseProductLink(url) {
  const res = await fetch("/api/parse-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || "Link işlenemedi.");
    err.response = { data };
    throw err;
  }
  return data;
}

// --- Bütçe ---
export async function fetchBudgetSummary() {
  const items = readItems() || [];
  const totalItems = items.length;
  const purchasedItems = items.filter((i) => i.status === "purchased").length;
  const priorityItems = items.filter((i) => i.status === "priority").length;
  const optionalItems = items.filter((i) => i.status === "optional").length;
  const purchasedCost = items
    .filter((i) => i.status === "purchased")
    .reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const remainingEstimate = items
    .filter((i) => i.status !== "purchased" && i.price != null)
    .reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const itemsMissingPrice = items.filter(
    (i) => i.price == null && i.status !== "purchased"
  ).length;
  const progressPercent = totalItems > 0 ? Math.round((purchasedItems / totalItems) * 100) : 0;

  return {
    totalItems,
    purchasedItems,
    priorityItems,
    optionalItems,
    purchasedCost,
    remainingEstimate,
    itemsMissingPrice,
    progressPercent,
  };
}
