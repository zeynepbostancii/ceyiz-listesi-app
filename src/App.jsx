import { useEffect, useState, useCallback } from "react";
import Dashboard from "./components/Dashboard";
import CategoryNav from "./components/CategoryNav";
import ItemGrid from "./components/ItemGrid";
import AddItemPanel from "./components/AddItemPanel";
import {
  fetchCategories,
  fetchItems,
  fetchBudgetSummary,
  updateItem,
  deleteItem,
} from "./api/client";

export default function App() {
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const [loadingShell, setLoadingShell] = useState(true); // kategori + dashboard ilk yükleme
  const [loadingItems, setLoadingItems] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const loadShell = useCallback(async () => {
    setLoadingShell(true);
    try {
      const [cats, sum] = await Promise.all([fetchCategories(), fetchBudgetSummary()]);
      setCategories(cats);
      setSummary(sum);
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(
        "Liste yüklenirken bir sorun oluştu. Sayfayı yenilemeyi dene."
      );
    } finally {
      setLoadingShell(false);
    }
  }, []);

  const loadItems = useCallback(async (categoryId) => {
    setLoadingItems(true);
    try {
      const data = await fetchItems(categoryId ? { categoryId } : {});
      setItems(data);
    } catch (err) {
      setErrorMessage("Ürünler yüklenemedi. Sayfayı yenilemeyi dene.");
    } finally {
      setLoadingItems(false);
    }
  }, []);

  useEffect(() => {
    loadShell();
  }, [loadShell]);

  useEffect(() => {
    loadItems(activeCategoryId);
  }, [activeCategoryId, loadItems]);

  async function refreshSummary() {
    try {
      const [sum, cats] = await Promise.all([fetchBudgetSummary(), fetchCategories()]);
      setSummary(sum);
      setCategories(cats);
    } catch {
      // Sessizce geç; bir sonraki manuel yenilemede düzelir
    }
  }

  function handleItemAdded(newItem) {
    if (!activeCategoryId || newItem.categoryId === activeCategoryId) {
      setItems((prev) => [newItem, ...prev]);
    }
    refreshSummary();
  }

  async function handleToggleStatus(item) {
    const nextStatus = item.status === "purchased" ? "planned" : "purchased";

    // İyimser güncelleme: arayüz önce güncellenir, backend arka planda senkronlanır
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, status: nextStatus } : it))
    );

    try {
      await updateItem(item.id, { status: nextStatus });
      refreshSummary();
    } catch (err) {
      // Başarısız olursa eski duruma geri al
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: item.status } : it))
      );
      setErrorMessage("Durum güncellenemedi, tekrar dene.");
    }
  }

  async function handleDeleteItem(itemId) {
    const prevItems = items;
    setItems((prev) => prev.filter((it) => it.id !== itemId));
    try {
      await deleteItem(itemId);
      refreshSummary();
    } catch (err) {
      setItems(prevItems);
      setErrorMessage("Ürün silinemedi, tekrar dene.");
    }
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="border-b border-cream-200 bg-cream-50/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2.5">
          <span className="text-2xl">🎀</span>
          <div>
            <h1 className="text-lg font-bold text-clay-600 leading-tight">
              Çeyiz Takip
            </h1>
            <p className="text-xs text-clay-400">Hazırlık listeni kolayca yönet</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {errorMessage && (
          <div className="mb-6 rounded-2xl bg-dusty-50 border border-dusty-100 text-dusty-600 text-sm px-4 py-3 flex items-center justify-between">
            <span>⚠️ {errorMessage}</span>
            <button
              onClick={loadShell}
              className="text-xs font-semibold underline underline-offset-2 hover:text-dusty-700"
            >
              Tekrar dene
            </button>
          </div>
        )}

        <Dashboard summary={summary} loading={loadingShell} />

        <AddItemPanel
          categories={categories}
          activeCategoryId={activeCategoryId}
          onItemAdded={handleItemAdded}
        />

        <CategoryNav
          categories={categories}
          activeId={activeCategoryId}
          onSelect={setActiveCategoryId}
          loading={loadingShell}
        />

        <ItemGrid
          items={items}
          loading={loadingItems}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteItem}
        />
      </main>
    </div>
  );
}
