# 🎀 Çeyiz Takip Uygulaması

Çeyiz alışverişini daha düzenli ve kolay takip edebilmek için geliştirilmiş, modern ve kullanıcı dostu bir web uygulamasıdır.

Proje, gerçek bir günlük ihtiyaçtan yola çıkarak geliştirilmiştir. Çeyiz ürünlerini kategorilere ayırabilir, alınan ürünleri takip edebilir, bütçe ve harcama durumunu görüntüleyebilir ve ürün bağlantılarından bilgileri otomatik olarak çekebilirsiniz.

## ✨ Özellikler

* 🛍️ Çeyiz ürünlerini listeleme ve yönetme
* 📂 Kategorilere göre ürün organizasyonu
* ✅ Alınan ürünleri işaretleme ve ilerleme takibi
* 💰 Toplam bütçe ve harcama özeti
* 📊 Çeyiz hazırlık ilerleme durumu
* 🔗 Ürün bağlantısından bilgileri otomatik olarak çekme
* 💾 Verileri tarayıcıda saklama
* 📱 Responsive ve kullanıcı dostu arayüz
* ⚡ Hızlı ve kolay kullanım

## 🛠️ Kullanılan Teknolojiler

### Frontend

* **React**
* **Vite**
* **JavaScript**
* **HTML5 / CSS3**

### Veri Yönetimi

* **localStorage**

Uygulamada ayrı bir veritabanı kullanılmamaktadır. Kullanıcıya ait liste, tarayıcının `localStorage` alanında saklanır.

### API / Backend

* **Vercel Serverless Functions**
* `api/parse-link.js`

"Linkten Çek" özelliği için Vercel Serverless Function kullanılmaktadır. Böylece ayrı bir Express sunucusu çalıştırmaya gerek kalmadan ürün bağlantılarından veri alınabilmektedir.

### Deployment

* **Vercel**
* **GitHub**

## 🏗️ Proje Yapısı

```text
ceyiz-listesi-app/
│
├── api/
│   └── parse-link.js
│       └── Vercel Serverless Function
│
├── public/
│   └── Statik dosyalar, favicon ve ikonlar
│
├── src/
│   ├── api/
│   │   └── client.js
│   │       └── localStorage tabanlı veri işlemleri
│   │
│   ├── components/
│   │   └── Arayüz bileşenleri
│   │
│   ├── data/
│   │   └── seedData.js
│   │       └── Varsayılan çeyiz listesi
│   │
│   └── App.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Yerelde Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için öncelikle repository'yi klonlayın:

```bash
git clone https://github.com/zeynepbostancii/ceyiz-listesi-app.git
```

Proje klasörüne geçin:

```bash
cd ceyiz-listesi-app
```

Gerekli paketleri yükleyin:

```bash
npm install
```

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Ardından tarayıcıdan:

```text
http://localhost:5173
```

adresini açabilirsiniz.

> **Not:** "Linkten Çek" özelliği yerel geliştirme ortamında da çalışacak şekilde yapılandırılmıştır.

## ☁️ Vercel ile Deploy

Projeyi Vercel üzerinde yayınlamak için:

1. Repository'yi GitHub hesabınıza yükleyin.
2. [Vercel](https://vercel.com) hesabınıza GitHub ile giriş yapın.
3. **Add New Project** seçeneğine tıklayın.
4. GitHub repository'nizi seçin.
5. Vercel, Vite projesini otomatik olarak algılayacaktır.
6. **Deploy** butonuna tıklayın.

Deployment tamamlandıktan sonra uygulama size özel bir `.vercel.app` adresinde yayınlanır.

GitHub repository'sine yeni bir commit gönderildiğinde Vercel, projeyi otomatik olarak yeniden deploy eder.

## 💾 Veri Saklama

Uygulamada kullanıcı verileri bir sunucu veritabanında tutulmaz.

Her kullanıcı kendi tarayıcısında kendi çeyiz listesini oluşturur ve görür.

Bu yapı sayesinde:

* Kullanıcıların listeleri birbirine karışmaz.
* Ayrı bir veritabanı sunucusuna ihtiyaç duyulmaz.
* Uygulama daha basit bir mimariyle çalışır.
* Liste verilerine aynı tarayıcı üzerinden tekrar erişilebilir.

### ⚠️ Önemli

`localStorage` tarayıcıya bağlı bir veri saklama yöntemidir.

Bu nedenle:

* Tarayıcı verileri temizlenirse liste silinebilir.
* Farklı bir cihazdan giriş yapıldığında aynı liste görüntülenmez.
* Farklı bir tarayıcıda liste başlangıç durumunda açılır.

Önemli listelerin ayrıca yedeklenmesi önerilir.

## 🔄 Proje Mimarisi

Projenin ilk geliştirme aşamasında **Express + SQLite tabanlı bir backend** bulunuyordu.

Daha sonra uygulamanın daha kolay deploy edilebilmesi ve ayrı bir backend sunucusuna ihtiyaç duyulmaması amacıyla mimari sadeleştirildi.

Mevcut yapıda:

```text
React + Vite
      │
      ├── localStorage
      │      └── Kullanıcı listesi
      │
      └── Vercel Serverless Function
             └── Ürün bağlantısından veri çekme
```

Bu yapı sayesinde uygulama hem **yerel ortamda** hem de **Vercel üzerinde** çalıştırılabilir.

## 🎯 Geliştirme Sürecinde Öğrenilenler

Bu proje kapsamında aşağıdaki konularda pratik deneyim kazanılmıştır:

* React ile component tabanlı frontend geliştirme
* Vite ile proje yapılandırma
* JavaScript ile client-side uygulama geliştirme
* `localStorage` ile tarayıcı tabanlı veri yönetimi
* API ve serverless function kullanımı
* Harici bağlantılardan veri çekme
* Frontend ve API arasındaki iletişim
* Git ve GitHub kullanımı
* Vercel deployment ve otomatik deployment süreçleri
* Responsive kullanıcı arayüzü geliştirme

## 🌐 Proje

**GitHub:**
https://github.com/zeynepbostancii/ceyiz-listesi-app

## 👩🏻‍💻 Geliştirici

**Zeynep Bostancı**

Computer Engineering Student
Karabük University

---

⭐ Projeyi faydalı bulduysanız repository'ye yıldız bırakabilirsiniz!
