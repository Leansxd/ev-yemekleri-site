const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.menuItem.deleteMany({});
  await prisma.menuItem.createMany({
    data: [
      // Başlangıçlar
      { name: 'Somon Gravlax', description: 'Dereotu ve narenciye marinasyonlu, avokado kreması, taze rezene ve frenk soğanı ile.', price: 480, category: 'Başlangıçlar', imageUrl: '/assets/food_dish.png' },
      { name: 'Burrata & İncir', description: 'Körpe roka yaprakları, balzamik havyarı, karamelize taze incir, ceviz ve fesleğen yağı ile.', price: 450, category: 'Başlangıçlar', imageUrl: '/assets/food_dish.png' },
      { name: 'Dana Carpaccio', description: 'İnce dilimlenmiş dana bonfile, trüflü mayonez, roka, parmesan dilimleri ve kapari ile.', price: 520, category: 'Başlangıçlar', imageUrl: '/assets/food_dish.png' },
      { name: 'Trüflü Yaban Mantarı Çorbası', description: 'Kremalı yaban mantarları miksi, siyah trüf yağı ve çıtır sourdough krutonları ile.', price: 280, category: 'Başlangıçlar', imageUrl: '/assets/food_dish.png' },

      // Ana Yemekler
      { name: 'Füme Antrikot', description: 'Köz patlıcan püresi, karamelize soğan, kuşkonmaz ve şefin özel antrikot sosu eşliğinde.', price: 780, category: 'Ana Yemekler', imageUrl: '/assets/food_dish.png' },
      { name: 'Truffle Risotto', description: 'Taze trüf mantarı, parmesan tekerinde demlenmiş arborio pirinci ve taze dağ kekikleri.', price: 620, category: 'Ana Yemekler', imageUrl: '/assets/food_dish.png' },
      { name: 'Kuzu İncik Konfi', description: 'Ağır ateşte pişmiş kuzu incik, taze patates püresi, kök sebzeler ve kendi sosu ile.', price: 740, category: 'Ana Yemekler', imageUrl: '/assets/food_dish.png' },
      { name: 'Izgara Levrek Flfileto', description: 'Körpe ıspanak sote, fırınlanmış bebek domatesler ve limonlu kapari sosu ile.', price: 680, category: 'Ana Yemekler', imageUrl: '/assets/food_dish.png' },
      { name: 'Dry Aged Ribeye Steak', description: '28 gün dinlendirilmiş antrikot, trüflü patates tava ve chimichurri sosu ile.', price: 920, category: 'Ana Yemekler', imageUrl: '/assets/food_dish.png' },

      // Tatlılar
      { name: 'Altın Küre (Golden Sphere)', description: 'Sıcak çikolata sosu döküldüğünde açılan antep fıstığı dolgulu çikolata küresi, altın tozu eşliğinde.', price: 350, category: 'Tatlılar', imageUrl: '/assets/food_dish.png' },
      { name: 'San Sebastian Cheesecake', description: 'İçi yumuşak akışkan, fırınlanmış yanık cheesecake, yanında taze çilek sosu ile.', price: 290, category: 'Tatlılar', imageUrl: '/assets/food_dish.png' },
      { name: 'Fıstıklı Sufle', description: 'Gerçek Antep fıstığı ezmesiyle hazırlanmış akışkan sufle, yanında vanilyalı dondurma ile.', price: 320, category: 'Tatlılar', imageUrl: '/assets/food_dish.png' },

      // Kokteyller & İçecekler
      { name: 'İmza Kokteyl "EV"', description: 'Özel demlenmiş cin, mürver çiçeği likörü, taze lime, salatalık özü ve altın tozu.', price: 380, category: 'Kokteyller & İçecekler', imageUrl: '/assets/hero_bg.png' },
      { name: 'Alanya Breeze', description: 'Lokal turunçgil esansları, taze nane, tekila ve ev yapımı zencefil şurubu ile egzotik esinti.', price: 350, category: 'Kokteyller & İçecekler', imageUrl: '/assets/hero_bg.png' },
      { name: 'Smoked Whiskey Sour', description: 'Meşe talaşı isiyle tütsülenmiş burbon viski, taze limon suyu ve şeker şurubu.', price: 390, category: 'Kokteyller & İçecekler', imageUrl: '/assets/hero_bg.png' },
      { name: 'Hibiscus Tonic (Alkolsüz)', description: 'Demlenmiş ebegümeci çayı, tonik, taze ahududu ve biberiye dalı eşliğinde ferahlatıcı.', price: 180, category: 'Kokteyller & İçecekler', imageUrl: '/assets/hero_bg.png' },
    ]
  });
  console.log("Seeding finished.");
}
main().catch(console.error).finally(() => prisma.$disconnect());
