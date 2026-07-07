'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import './page.css';

export default function Home() {
  const [resData, setResData] = useState({ name: '', phone: '', date: '', time: '', guests: '' });
  const [resStatus, setResStatus] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Simulation of predefined/reserved seats (A-D rows, 1-14 tables, S1-S4 seats)
  const reservedSeats = new Set([
    'A-3-S2', 'A-8-S1', 'A-12-S3', 'B-5-S4', 'B-10-S2', 'B-10-S3',
    'C-2-S1', 'C-7-S4', 'C-11-S1', 'C-13-S2', 'D-4-S3', 'D-9-S1', 'D-14-S2'
  ]);

  // Intersection Observer for scroll animation triggers
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    revealElements.forEach(el => observer.observe(el));

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const toggleSeat = (tableId: string, seatIndex: number) => {
    const seatId = `${tableId}-S${seatIndex}`;
    if (reservedSeats.has(seatId)) return;

    setSelectedSeats(prev => {
      let updated;
      if (prev.includes(seatId)) {
        updated = prev.filter(s => s !== seatId);
      } else {
        updated = [...prev, seatId];
      }
      
      // Sync guest count with the select input value
      setResData(prevData => ({
        ...prevData,
        guests: updated.length > 0 ? String(updated.length) : ''
      }));
      
      return updated;
    });
  };

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert("Lütfen rezervasyon için salon planından en az bir koltuk seçiniz.");
      return;
    }
    setResStatus('loading');

    const formattedGuests = `${selectedSeats.length} Kişi (Masa/Koltuklar: ${selectedSeats.join(', ')})`;
    const payload = {
      ...resData,
      guests: formattedGuests
    };

    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setResStatus('success');
        setResData({ name: '', phone: '', date: '', time: '', guests: '' });
        setSelectedSeats([]);
      } else {
        setResStatus('error');
      }
    } catch {
      setResStatus('error');
    }
  };

  const renderTable = (tableId: string) => {
    return (
      <div key={tableId} className="table-wrapper">
        {[1, 2, 3, 4].map(seatNum => {
          const seatId = `${tableId}-S${seatNum}`;
          const isReserved = reservedSeats.has(seatId);
          const isSelected = selectedSeats.includes(seatId);

          let seatClass = 'seat available';
          if (isReserved) seatClass = 'seat reserved';
          else if (isSelected) seatClass = 'seat selected';

          let placementClass = '';
          if (seatNum === 1) placementClass = 'seat-top';
          else if (seatNum === 2) placementClass = 'seat-bottom';
          else if (seatNum === 3) placementClass = 'seat-left';
          else if (seatNum === 4) placementClass = 'seat-right';

          return (
            <div
              key={seatNum}
              className={`${seatClass} ${placementClass}`}
              onClick={() => toggleSeat(tableId, seatNum)}
              title={isReserved ? 'Dolu' : isSelected ? 'Seçiminiz' : 'Seçmek için tıklayın'}
            />
          );
        })}
        <div className="table-center">
          {tableId}
        </div>
      </div>
    );
  };

  const renderFloorPlan = () => {
    const elements = [];
    const rows = ['A', 'B', 'C', 'D'];

    for (let r = 0; r < 4; r++) {
      const rowLabel = rows[r];

      // Tables 1 to 10
      for (let c = 1; c <= 10; c++) {
        elements.push(renderTable(`${rowLabel}-${c}`));
      }

      // Corridor Spacer (rendered only in the first row, spans 4 rows via CSS grid)
      if (r === 0) {
        elements.push(
          <div key="corridor" className="corridor-spacer">
            <span className="corridor-text font-heading">KORİDOR</span>
          </div>
        );
      }

      // Tables 11 to 14
      for (let c = 11; c <= 14; c++) {
        elements.push(renderTable(`${rowLabel}-${c}`));
      }
    }
    return elements;
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-bg">
          <Image src="/assets/hero_bg.png" alt="EV Bar and Kitchen" fill priority />
        </div>
        <div className="hero-content">
          <p className="hero-subtitle reveal">A Taste of Perfection</p>
          <h2 className="font-heading reveal delay-100">Where Flavors Meet Elegance</h2>
          <p className="font-body reveal delay-200">
            Step into a world of culinary excellence. Our dishes are crafted with the finest ingredients to deliver an unforgettable dining experience.
          </p>
          <div className="hero-actions reveal delay-300">
            <Link href="#reservation" className="btn btn-solid">Book A Table</Link>
            <Link href="/menu" className="btn">View Menu</Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="section-padding bg-alt" style={{ overflow: 'hidden' }}>
        <div className="container about-grid">
          <div className="reveal-left">
            <p className="section-subtitle">Our Philosophy</p>
            <h2 className="section-title font-heading">The Art of Fine Dining</h2>
            <p className="text-muted font-body" style={{fontSize: '1.1rem', marginBottom: '1.5rem'}}>
              At EV Bar & Kitchen, we believe that dining is an art form. Every dish that leaves our kitchen is a masterpiece, carefully composed to delight your senses.
            </p>
            <p className="text-muted font-body" style={{fontSize: '1.1rem', marginBottom: '2.5rem'}}>
              Our executive chefs blend traditional techniques with modern innovation, ensuring that classic flavors are respected while presenting them in a contemporary light.
            </p>
            <Link href="/showroom" className="btn">View Gallery</Link>
          </div>
          <div className="about-image-wrapper reveal-right delay-200">
            <div className="about-image">
              <Image src="/assets/food_dish.png" alt="Culinary Art" fill />
            </div>
          </div>
        </div>
      </section>

      {/* Atmosphere Section */}
      <section className="section-padding bg-main" style={{ overflow: 'hidden' }}>
        <div className="container atmosphere-grid">
          <div className="atmosphere-images reveal-left">
            <div className="img-box">
              <Image src="/assets/hero_bg.png" alt="Atmosphere 1" fill />
            </div>
            <div className="img-box">
              <Image src="/assets/food_dish.png" alt="Atmosphere 2" fill />
            </div>
            <div className="img-box">
              <Image src="/assets/hero_bg.png" alt="Atmosphere 3" fill />
            </div>
          </div>
          <div className="reveal-right delay-200">
            <p className="section-subtitle">The Ambiance</p>
            <h2 className="section-title font-heading">A Place To Remember</h2>
            <p className="text-muted font-body" style={{fontSize: '1.1rem', marginBottom: '1.5rem'}}>
              Designed with sophistication in mind, our interior blends dark textures with warm golden accents to create an intimate, luxurious setting.
            </p>
            <p className="text-muted font-body" style={{fontSize: '1.1rem'}}>
              Whether you are here for a romantic dinner, a business lunch, or a celebration with friends, our atmosphere provides the perfect backdrop for unforgettable moments.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights (Chef's Recommendations) */}
      <section className="section-padding bg-alt">
        <div className="container">
          <div className="text-center reveal">
            <p className="section-subtitle">Chef's Selection</p>
            <h2 className="section-title font-heading">Signature Dishes</h2>
          </div>
          
          <div className="highlights-grid">
            <div className="highlight-card reveal delay-100">
              <div className="highlight-img">
                <Image src="/assets/food_dish.png" alt="Signature Beef" width={200} height={200} />
              </div>
              <h3 className="font-heading text-gold">Prime Tenderloin</h3>
              <p className="font-body">Aged perfectly and cooked to your exact preference, served with our signature truffle reduction.</p>
            </div>
            
            <div className="highlight-card reveal delay-200">
              <div className="highlight-img">
                <Image src="/assets/seafood_dish.png" alt="Seafood Plate" width={200} height={200} />
              </div>
              <h3 className="font-heading text-gold">Ocean's Harvest</h3>
              <p className="font-body">A delicate selection of the freshest seafood, featuring seared scallops and caviar.</p>
            </div>
            
            <div className="highlight-card reveal delay-300">
              <div className="highlight-img">
                <Image src="/assets/dessert_dish.png" alt="Artisan Dessert" width={200} height={200} />
              </div>
              <h3 className="font-heading text-gold">Golden Sphere</h3>
              <p className="font-body">Our iconic dessert made with rich dark chocolate, hazelnut praline, and edible gold leaf.</p>
            </div>
          </div>
          
          <div className="text-center reveal delay-200" style={{marginTop: '4rem'}}>
            <Link href="/menu" className="btn btn-solid">View Full Menu</Link>
          </div>
        </div>
      </section>

      {/* TripAdvisor Reviews */}
      <section className="section-padding tripadvisor-section">
        <div className="container">
          <div className="ta-header reveal">
            <div className="ta-logo-circle">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14c-2.48 0-4.5-2.02-4.5-4.5S14.02 7 16.5 7 21 9.02 21 11.5 18.98 16 16.5 16zm-9 0C5.02 16 3 13.98 3 11.5S5.02 7 7.5 7 12 9.02 12 11.5 9.98 16 7.5 16zM12 14c-1.38 0-2.5-1.12-2.5-2.5S10.62 9 12 9s2.5 1.12 2.5 2.5S13.38 14 12 14z"/></svg>
            </div>
            <h2 className="section-title font-heading text-center" style={{marginBottom: 0}}>Guest Reviews</h2>
            <p className="font-body text-gold" style={{marginTop: '0.5rem', letterSpacing: '1px'}}>TripAdvisor Travelers' Choice</p>
          </div>
          
          <div className="ta-grid">
            <div className="ta-card reveal delay-100">
              <div className="ta-stars">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <h3 className="ta-title font-heading">"Absolutely Phenomenal"</h3>
              <p className="ta-text font-body">From the moment we walked in, the service was impeccable. The prime tenderloin melts in your mouth, and the wine pairing was perfection.</p>
              <span className="ta-author">- Sarah J., London</span>
            </div>
            
            <div className="ta-card reveal delay-200">
              <div className="ta-stars">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <h3 className="ta-title font-heading">"A Hidden Gem in Alanya"</h3>
              <p className="ta-text font-body">We visited EV Bar & Kitchen based on recommendations, and it exceeded all expectations. The golden sphere dessert is a must-try!</p>
              <span className="ta-author">- Michael T., Berlin</span>
            </div>
            
            <div className="ta-card reveal delay-300">
              <div className="ta-stars">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <h3 className="ta-title font-heading">"Best Cocktails & Food"</h3>
              <p className="ta-text font-body">The ambiance is just stunning. Dark, moody, and elegant. The bartender knows exactly what they are doing. 10/10 experience.</p>
              <span className="ta-author">- Elena R., Moscow</span>
            </div>
            
            <div className="ta-card reveal delay-100">
              <div className="ta-stars">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <h3 className="ta-title font-heading">"Unforgettable Anniversary"</h3>
              <p className="ta-text font-body">They made our anniversary so special. The staff went above and beyond, and the seafood platter was the freshest I've had in years.</p>
              <span className="ta-author">- David & Emma, New York</span>
            </div>
            
            <div className="ta-card reveal delay-200">
              <div className="ta-stars">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <h3 className="ta-title font-heading">"Pure Luxury"</h3>
              <p className="ta-text font-body">If you want a fine dining experience that rivals Michelin star restaurants in Europe, you have to visit EV. Incredible attention to detail.</p>
              <span className="ta-author">- Ahmed K., Dubai</span>
            </div>
            
            <div className="ta-card reveal delay-300">
              <div className="ta-stars">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <h3 className="ta-title font-heading">"Will definitely return"</h3>
              <p className="ta-text font-body">We had dinner here twice during our stay. The quality is consistently high, and the atmosphere makes you want to stay all night.</p>
              <span className="ta-author">- Sophie L., Paris</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation & Seating Map */}
      <section id="reservation" className="section-padding">
        <div className="container">
          <div className="text-center reveal" style={{marginBottom: '3rem'}}>
            <p className="section-subtitle font-heading">Salon Planı</p>
            <h2 className="section-title font-heading">Masa ve Koltuk Seçimi</h2>
            <p className="font-body text-muted" style={{maxWidth: '600px', margin: '0 auto'}}>
              Rezervasyon yapmak istediğiniz koltukları doğrudan harita üzerinden tıklayarak seçebilirsiniz.
            </p>
          </div>

          {/* Interactive Seating Floor Plan */}
          <div className="floor-plan-section reveal-scale" style={{marginBottom: '4rem'}}>
            {selectedSeats.length > 0 && (
              <div className="selected-info-bar">
                <h5 className="font-heading">Seçilen Koltuklar: {selectedSeats.join(', ')}</h5>
                <span className="font-body text-gold" style={{fontWeight: 600}}>{selectedSeats.length} Koltuk</span>
              </div>
            )}
            
            <div className="floor-plan-scroll">
              <div className="floor-plan-layout">
                <div className="salon-container">
                  <div className="floor-plan-grid">
                    {renderFloorPlan()}
                  </div>
                </div>
              </div>
            </div>

            <div className="floor-plan-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{backgroundColor: '#1a331e', border: '1px solid #2e7d32'}}></span>
                <span className="font-body">Boş Koltuk</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{backgroundColor: '#b71c1c', border: '1px solid #d32f2f'}}></span>
                <span className="font-body">Dolu Koltuk</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{backgroundColor: 'var(--color-gold)', border: '1px solid #fff'}}></span>
                <span className="font-body">Seçtiğiniz</span>
              </div>
            </div>
          </div>

          <div className="res-contact-grid reveal-scale">
            <div className="res-form-area">
              <p className="section-subtitle">Reserve a Table</p>
              <h2 className="font-heading" style={{fontSize: '2.5rem', marginBottom: '2rem'}}>Join Us</h2>
              
              <form onSubmit={handleReservationSubmit}>
                <div className="form-grid">
                  <input type="text" className="modern-input" placeholder="Guest Name" required value={resData.name} onChange={e => setResData({...resData, name: e.target.value})} />
                  <input type="tel" className="modern-input" placeholder="Phone Number" required value={resData.phone} onChange={e => setResData({...resData, phone: e.target.value})} />
                  
                  <input type="date" className="modern-input" required value={resData.date} onChange={e => setResData({...resData, date: e.target.value})} />
                  <input type="time" className="modern-input" required value={resData.time} onChange={e => setResData({...resData, time: e.target.value})} />
                  
                  <input 
                    type="text" 
                    className="modern-input form-full" 
                    placeholder="Seçilen Koltuk Sayısı (Haritadan Seçiniz)" 
                    required 
                    readOnly 
                    value={resData.guests ? `${resData.guests} Koltuk Seçildi` : ''} 
                  />
                </div>
                
                <button type="submit" className="btn btn-solid form-full" style={{width: '100%', marginTop: '1rem'}} disabled={resStatus === 'loading'}>
                  {resStatus === 'loading' ? 'Processing...' : 'Confirm Reservation'}
                </button>
                {resStatus === 'success' && <p style={{color: '#4CAF50', marginTop: '1rem', textAlign: 'center'}}>Reservation confirmed!</p>}
                {resStatus === 'error' && <p style={{color: '#f44336', marginTop: '1rem', textAlign: 'center'}}>An error occurred. Please call us.</p>}
              </form>
              
              <div className="contact-info">
                <h4 className="font-heading text-gold">Location</h4>
                <p className="text-muted font-body" style={{marginBottom: '1.5rem', lineHeight: 1.8}}>
                  Şekerhane, Atatürk Blv. No:12<br/>07400 Alanya/Antalya, Türkiye
                </p>
                
                <h4 className="font-heading text-gold">Contact</h4>
                <p className="text-muted font-body" style={{fontSize: '1.2rem'}}>+90 555 123 4567</p>
                <p className="text-muted font-body">booking@evbarandkitchen.com</p>
              </div>
            </div>
            
            <div className="res-map-area">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3189.65824558231!2d32.0016149!3d36.5447936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14dc98762f2761ef%3A0xc66ef3c1bbddf482!2s%C5%9Eekerhane%2C%20Atat%C3%BCrk%20Blv.%20No%3A12%2C%2007400%20Alanya%2FAntalya!5e0!3m2!1str!2str!4v1714588505537!5m2!1str!2str" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand reveal-left">
              <div className="footer-logo-glow">
                <Image src="/assets/logo.jpg" alt="EV Bar & Kitchen Logo" width={120} height={120} style={{objectFit: 'contain'}} />
              </div>
              <p className="font-body">
                Premium ingredients, avant-garde techniques, and standard-setting hospitality in Alanya.
              </p>
            </div>
            
            <div className="footer-links-col reveal delay-100">
              <h4 className="footer-title">Navigation</h4>
              <div className="footer-links-list">
                <Link href="#home">Home</Link>
                <Link href="#about">About Us</Link>
                <Link href="/menu">Menus</Link>
                <Link href="/showroom">Showroom</Link>
              </div>
            </div>
            
            <div className="footer-contact-info reveal-right delay-200">
              <h4 className="footer-title">Address & Social</h4>
              <div className="footer-contact-item">
                <p className="font-body">
                  Şekerhane, Atatürk Blv. No:12,<br/>07400 Alanya/Antalya, Türkiye
                </p>
              </div>
              <div className="footer-socials">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-btn" title="Instagram">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-btn" title="Facebook">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a href="https://tripadvisor.com" target="_blank" rel="noreferrer" className="footer-social-btn" title="TripAdvisor">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 10c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm12 0c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm-6 2c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zm0-2c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2z"/></svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} EV Bar & Kitchen. All Rights Reserved.</p>
            <p>Designed with excellence.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
