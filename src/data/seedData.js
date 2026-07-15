/**
 * Uygulamanın ilk açılışında (tarayıcıda hiç veri yokken) otomatik
 * eklenecek varsayılan kategori ve ürün listesi. "(xN)" adet bilgisini
 * quantity alanına, "(İsteğe Bağlı)" ifadesini status: 'optional'
 * olarak işler.
 */

function parseQuantity(raw) {
  const match = raw.match(/\(x(\d+)\)/i);
  return match ? parseInt(match[1], 10) : 1;
}

function parseOptional(raw) {
  return /İsteğe Bağlı/i.test(raw);
}

function cleanName(raw) {
  return raw
    .replace(/\(x\d+\)/i, "")
    .replace(/\(İsteğe Bağlı\)/i, "")
    .trim();
}

function buildItems(rawList) {
  return rawList.map((raw) => ({
    name: cleanName(raw),
    quantity: parseQuantity(raw),
    status: parseOptional(raw) ? "optional" : "planned",
  }));
}

export const CATEGORY_DEFS = [
  {
    name: "Mutfak & Sofra",
    icon: "🍽️",
    colorTag: "dusty-pink",
    items: buildItems([
      "Çelik tencere seti (x1)", "Granit tencere seti (x1)", "Düdüklü tencere",
      "Çaydanlık (büyük boy)", "Çaydanlık (küçük boy)", "Cezve seti", "Sahan seti",
      "Krep tavası", "Kızartma tenceresi", "Sos Tenceresi",
      "Günlük yemek takımı 6/12 kişilik (x1)", "Misafir yemek takımı 12 kişilik (x1)",
      "Kahvaltı takımı (x1)", "Pasta seti (İsteğe Bağlı)",
      "Günlük çatal kaşık bıçak takımı (x1)", "Misafirlik kaşık bıçak takımı (x1)",
      "Kepçe takımı", "Silikon pişirme seti", "Bıçak seti - soyacak", "Meyve bıçağı",
      "Sürahi", "Su seti", "Su bardağı (günlük)", "Çay takımı", "Kahve fincan takımı",
      "Çay fincanı", "Ekmek sepeti", "Servis seti", "Tuzluk - biberlik",
      "Kahve yanı bardağı", "Kupa", "Dondurma kasesi (x6)", "Tatlı kasesi (x12)",
      "Çerez seti", "Salata kasesi", "Sosluk", "Borcam seti", "Kapaklı kek fanusu",
      "Servis/sunum tabağı", "Erzak kavanozu (x12)", "Baharatlık (x10)",
      "Sunumluk bambu", "Şekerlik", "Kek kalıbı", "Güveç takımı",
      "Çay, kahve, tuz kavanozu",
    ]),
  },
  {
    name: "Mutfak Gereçleri",
    icon: "🥄",
    colorTag: "soft-beige",
    items: buildItems([
      "Rende", "Tepsi", "Süzgeç", "Oklava - Merdane", "Nihale", "Limon sıkacağı",
      "Saklama kabı", "Yağdanlık", "Çırpıcı", "Sebze kurutucu", "Kesme tahtası",
      "Un eleği",
    ]),
  },
  {
    name: "Ev Tekstili - Yatak Odası",
    icon: "🛏️",
    colorTag: "sage-green",
    items: buildItems([
      "Çift kişilik nevresim takımı (x5)", "Çift kişilik pike takımı (x2)",
      "Çift kişilik battaniye (x2)", "Çift kişilik yorgan (x2)",
      "Tek kişilik nevresim takımı (x2)", "Tek kişilik pike takımı (x1)",
      "Tek kişilik battaniye (x1)", "Tek kişilik yorgan (x1)", "Yatak örtüsü (x1)",
      "Tv battaniyesi (x1)", "Yastık (x8)", "Alez",
    ]),
  },
  {
    name: "Banyo",
    icon: "🛁",
    colorTag: "dusty-pink",
    items: buildItems([
      "El yüz havlusu (x10)", "Misafir havlusu (x5)", "Banyo havlusu (x2)",
      "Bornoz seti (x2)", "Ayak havlusu (x1)", "Paspas seti (x1)",
    ]),
  },
  {
    name: "Mutfak (Tekstil)",
    icon: "🧺",
    colorTag: "soft-beige",
    items: buildItems([
      "Masa örtüsü (x2)", "Runner (x1)", "Amerikan servisi (x6)",
      "Mutfak havlusu (x5)", "Mutfak bezi", "Peçetelik", "Fırın eldiveni",
      "Sofra bezi (x1)", "Önlük",
    ]),
  },
  {
    name: "Elektronik Ev Aletleri",
    icon: "🔌",
    colorTag: "sage-green",
    items: buildItems([
      "Kahve makinesi", "Blender seti", "Ütü", "Saç kurutma makinesi",
      "Tost makinesi", "Süpürge", "Airfryer (İsteğe Bağlı)",
      "Çaycı / kettle (İsteğe Bağlı)", "Robot süpürge (İsteğe Bağlı)",
      "Ekmek kızartma makinesi (İsteğe Bağlı)", "Filtre kahve makinesi (İsteğe Bağlı)",
      "Smoothie blender (İsteğe Bağlı)", "Hamur yoğurma makinesi (İsteğe Bağlı)",
    ]),
  },
  {
    name: "Ev Gereçleri",
    icon: "🧹",
    colorTag: "soft-beige",
    items: buildItems([
      "Ütü masası", "Çamaşır kurutma askısı", "Askı", "Kirli sepeti", "Banyo seti",
      "Çöp kovası", "Vileda", "Dikiş seti", "Çamaşır sepeti", "Temizlik kovası",
    ]),
  },
];
