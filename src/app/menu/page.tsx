import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import './page.css';

export default async function MenuPage() {
  const menuItems = await prisma.menuItem.findMany({
    where: { isAvailable: true }
  });

  // Group by category
  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  return (
    <div className="menu-page">
      <Navbar />

      <div className="menu-header">
        <div className="menu-header-content fade-up">
          <h2 className="font-heading">Menu</h2>
          <p className="font-body">Gourmet Selection</p>
        </div>
      </div>

      <div className="container menu-content">
        {categories.length === 0 ? (
          <p className="text-center font-body text-muted" style={{marginTop: '2rem'}}>
            Menü hazırlanıyor, lütfen daha sonra tekrar deneyiniz.
          </p>
        ) : (
          categories.map((category, idx) => (
            <div key={category} className={`menu-category fade-up delay-${Math.min(idx * 100, 300)}`}>
              <div className="category-header">
                <h3 className="font-heading category-title">{category}</h3>
              </div>
              <div className="menu-grid">
                {menuItems.filter(item => item.category === category).map(item => (
                  <div key={item.id} className="menu-card">
                    {item.imageUrl && (
                      <div className="menu-img">
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          width={200} 
                          height={200} 
                          style={{objectFit: 'cover', width: '100%', height: '100%'}} 
                        />
                      </div>
                    )}
                    <div className="menu-info">
                      <div className="menu-item-header">
                        <h4 className="font-heading menu-item-name">{item.name}</h4>
                        <span className="menu-item-price">{item.price} ₺</span>
                      </div>
                      <p className="desc font-body">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
