# EV Bar & Kitchen - Çoklu Dil, Rezervasyon ve Arayüz Yönetim Kılavuzu

Bu kılavuz, EV Bar & Kitchen projesinin tüm interaktif ve görsel özelliklerini, çoklu dil sisteminin yönetimini, yeni salon kroki düzenini ve yazılımsal altyapıyı detaylıca açıklar.

---

## 📖 BÖLÜM 1: Mimari ve Teknoloji Yığını

Proje, modern web standartlarında, yüksek performans ve lüks estetik odaklı geliştirilmiştir:
- **Framework:** Next.js (App Router, React Server & Client Components).
- **Veritabanı:** Prisma ORM ile SQLite (Yemekler, galeriler ve rezervasyon verileri burada tutulur).
- **Styling:** Premium Vanilla CSS. Glassmorphism, yumuşak geçişli mesh gölgeler ve SVG gürültü filtresi (texture) ile donatılmıştır.
- **İçerik İletimi:** Dinamik client-side veri yüklemeleri için Next.js API rotaları (`/api/menu`, `/api/gallery`, `/api/reservation`).

---

## 🎨 BÖLÜM 2: Gelişmiş Görsel Efektler ve Doku (Texture)

Sitedeki lüks gurme hissiyatını artırmak amacıyla göze hitap eden özel dokular eklenmiştir:
1. **SVG Grain (Noise) Filtresi:** `globals.css` içerisinde `body::after` öğesi aracılığıyla tüm siteye hafif pürüzlü, organik bir kağıt/kum dokusu (`opacity: 0.035`) giydirilmiştir.
2. **Mesh Gradients & Halolar:** Arka planda yavaşça yüzen altın ve zümrüt yeşili ışık küreleri (`.ambient-halo`) yerleştirilmiştir.
3. **Glassmorphism:** Tüm kartlar ve detay pencereleri `backdrop-filter: blur(12px)` ile tasarlanarak arka planı yumuşak bir biçimde eritir.

---

## 🌐 BÖLÜM 3: 4 Dilli Altyapı Yönetimi (i18n)

Sitede **Türkçe (TR)**, **İngilizce (EN)**, **Rusça (RU)** ve **Norveççe (NO)** dilleri tam desteklenmektedir. Dil geçişi sayfa yenilenmeden anında gerçekleşir.

### Çeviri Nasıl Eklenir veya Güncellenir?
Tüm çeviriler [translations.ts](file:///c:/Users/PC/Desktop/ev-yemekleri-site/src/lib/translations.ts) dosyası içinde saklanır. Yeni bir metin eklemek için:
1. `src/lib/translations.ts` dosyasını açın.
2. `tr`, `en`, `ru` ve `no` nesnelerinin içine ortak bir anahtar (Örn: `welcomeMessage`) ve karşılığı olan çeviriyi ekleyin.
3. Bileşenlerde kullanmak için `useLanguage()` kancasını çağırıp metni yerleştirin:
   ```tsx
   const { t } = useLanguage();
   return <h1>{t('welcomeMessage')}</h1>;
   ```

---

## 🪑 BÖLÜM 4: Sadeleştirilmiş Salon Krokisi & Koltuk Düzeni

Kroki sistemi, tiyatro/konser salonları gibi son derece sade ve doğrudan koltuk seçilebilen bir yapıyla güncellenmiştir.

### Kroki Yapısı:
- **Sol Taraf (L):** 6 satır (A, B, C, D, E, F) ve 5 sütun (1, 2, 3, 4, 5) olmak üzere 30 koltuk.
- **Sol Üst Bölge:** `🍸 BAR` alanı.
- **Orta Bölge:** Dümdüz geniş dikey bir koridor. Koridorun karşısında ise `🎭 SAHNE` bloğu bulunur.
- **Sağ Taraf (R):** 6 satır (A, B, C, D, E, F) ve 6 sütun (1, 2, 3, 4, 5, 6) olmak üzere 36 koltuk.

### Kod Üzerinde Koltuk Durumları Nasıl Değiştirilir?
- **Dolu/Rezerve Koltuklar:** [page.tsx](file:///c:/Users/PC/Desktop/ev-yemekleri-site/src/app/page.tsx) dosyasının en üstünde yer alan `reservedSeats` Set nesnesi içine koltuk kodları eklenerek manuel olarak rezerve edilebilir:
  ```typescript
  const reservedSeats = new Set([
    'L-A-3', // Sol blok, A satırı, 3. koltuk
    'R-B-6'  // Sağ blok, B satırı, 6. koltuk
  ]);
  ```

---

## 🍷 BÖLÜM 5: İnteraktif Deneyim Planlayıcısı

Müşteriler masa seçmeden önce akşam yemeği menülerini, şarap eşleşmelerini ve limo servisi gibi ekstraları seçebilirler.
- **Dinamik Fatura:** Seçilen koltuk adedi arttıkça menü ve içecek fiyatları kişi sayısıyla çarpılır, VIP loca ve limo ücreti gibi tek seferlik giderler eklenerek anlık fatura dökümü (`invoice-paper`) müşteriye gösterilir.
- **Veritabanı Entegrasyonu:** Müşteri rezervasyonu onayladığında, planlayıcıda yaptığı tüm özel seçimler tek bir rapor halinde `guests` sütununa yazılır ve SQLite veritabanına kaydedilir.

---

## 🛠️ BÖLÜM 6: Yönetici İçin Hızlı İşlemler

### 1. Yeni Yemek Ekleme
Prisma veritabanına yeni yemek eklemek için terminalden tohumlama (seed) dosyasını çalıştırabilir veya doğrudan veritabanına veri basabilirsiniz. Arama barı ve kategori sekmeleri yeni eklenen yemeği otomatik olarak listeler.

### 2. Rezervasyonları Görüntüleme
Rezervasyon verilerini incelemek için projenin SQLite veritabanı dosyasını (`prisma/dev.db`) görüntüleyebilir ya da Prisma Studio'yu ayağa kaldırabilirsiniz:
```bash
npx prisma studio
```
Bu komut tarayıcınızda `http://localhost:5555` portunda veritabanını görsel olarak inceleyebileceğiniz lüks bir arayüz açar.
