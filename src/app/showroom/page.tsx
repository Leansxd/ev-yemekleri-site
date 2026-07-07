import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import './page.css';

export default async function ShowroomPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="showroom-page">
      <nav className="navbar scrolled">
        <div className="nav-container">
          <Link href="/" className="logo">
            <h1 className="cinzel"><span className="gold-text">EV</span> BAR & KITCHEN</h1>
          </Link>
          <ul className="nav-links">
            <li><Link href="/">Anasayfa</Link></li>
            <li><Link href="/menu">Menü</Link></li>
            <li><Link href="/showroom" className="gold-text">Showroom</Link></li>
          </ul>
        </div>
      </nav>

      <div className="showroom-header">
        <h2 className="cinzel">Showroom</h2>
        <p>Restoranımızın eşsiz atmosferi ve sunumları</p>
      </div>

      <div className="container showroom-content">
        {images.length === 0 ? (
          <p className="text-center" style={{marginTop: '2rem'}}>Henüz galeriye fotoğraf eklenmemiş.</p>
        ) : (
          <div className="gallery-grid">
            {images.map(image => (
              <div key={image.id} className="gallery-item">
                <Image src={image.url} alt={image.caption || 'Galeri Görseli'} width={600} height={400} style={{objectFit: 'cover', width: '100%', height: '100%'}} />
                {image.caption && (
                  <div className="gallery-caption">
                    <p>{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
