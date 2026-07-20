'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import './page.css';

export default function Home() {
  const { t, language } = useLanguage();

  const [resData, setResData] = useState({ name: '', phone: '', date: '', time: '', guests: '', hasShuttle: false });
  const [resStatus, setResStatus] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Masterpiece State: Culinary Journey Timeline
  const [activeTimelineYear, setActiveTimelineYear] = useState(2018);

  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = reviewsRef.current;
    if (!container) return;

    let isPaused = false;
    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };
    const handleTouchStart = () => { isPaused = true; };
    const handleTouchEnd = () => {
      setTimeout(() => { isPaused = false; }, 2000);
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    const intervalId = setInterval(() => {
      if (isPaused) return;
      const firstCard = container.querySelector('.ta-card');
      if (!firstCard) return;

      const cardWidth = firstCard.clientWidth;
      const gap = 32; // Gap size match (2rem on desktop, 1.2rem on mobile)
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - 15) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
      }
    }, 3500);

    return () => {
      clearInterval(intervalId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);





  // Simulation of predefined/reserved seats (L for Left block, R for Right block)
  const reservedSeats = new Set<string>([]);



  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for scroll animation triggers
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .fade-up');
    revealElements.forEach(el => observer.observe(el));

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // Scroll Progress Listener for Masterpiece Scrollbar
  useEffect(() => {
    const handleScrollProgress = () => {
      const bar = document.getElementById('scrollProgress');
      if (bar) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        bar.style.width = `${progress}%`;
      }
    };
    window.addEventListener('scroll', handleScrollProgress);
    return () => window.removeEventListener('scroll', handleScrollProgress);
  }, []);



  const toggleSeat = (seatId: string) => {
    if (reservedSeats.has(seatId)) return;

    setSelectedSeats(prev => {
      let updated;
      if (prev.includes(seatId)) {
        updated = prev.filter(s => s !== seatId);
      } else {
        updated = [...prev, seatId];
      }
      
      // Auto-update guests field and sync with cost estimator
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
      alert(language === 'tr' ? "Lütfen rezervasyon için salon planından en az bir koltuk seçiniz." : "Please select at least one seat from the floor plan to reserve.");
      return;
    }
    setResStatus('loading');

    // Build highly detailed experience layout report to store in Database
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
        setResData({ name: '', phone: '', date: '', time: '', guests: '', hasShuttle: false });
        setSelectedSeats([]);
      } else {
        setResStatus('error');
      }
    } catch {
      setResStatus('error');
    }
  };

  const renderFloorPlan = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    return (
      <div className="new-floor-layout">
        
        {/* Top Area: BAR (left) and STAGE (center/right facing corridor) */}
        <div className="floor-top-row">
          <div className="bar-area font-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor', marginRight: '8px' }}>
              <path d="M7.5 2h9L12 11.5 7.5 2zM11 13v6H8v2h8v-2h-3v-6h-2z" />
            </svg>
            BAR
          </div>
          <div className="stage-area font-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor', marginRight: '8px' }}>
              <path d="M12 2c-4.96 0-9 4.04-9 9 0 3.86 2.44 7.15 5.86 8.39l.14.05c.62.22 1.3.36 2 .36s1.38-.14 2-.36l.14-.05C18.56 18.15 21 14.86 21 11c0-4.96-4.04-9-9-9zm-3 8c-.83 0-1.5-.67-1.5-1.5S8.17 7 9 7s1.5.67 1.5 1.5S9.83 10 9 10zm6 0c-.83 0-1.5-.67-1.5-1.5S14.17 7 15 7s1.5.67 1.5 1.5S15.83 10 15 10zm-3 6c-1.66 0-3-1.34-3-3h6c0 1.66-1.34 3-3 3z" />
            </svg>
            {language === 'tr' ? 'SAHNE' : language === 'ru' ? 'СЦЕНА' : language === 'no' ? 'SCENE' : 'STAGE'}
          </div>
        </div>

        <div className="floor-seating-container">
          {/* Left Block: 6 Rows, 5 Columns */}
          <div className="seating-block left-block">
            {rows.map(row => (
              <div key={`left-row-${row}`} className="seating-row">
                <span className="row-label font-heading">{row}</span>
                <div className="seats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                  {[1, 2, 3, 4, 5].map(col => {
                    const seatId = `L-${row}-${col}`;
                    const isReserved = reservedSeats.has(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    
                    let seatClass = 'seat-item available';
                    if (isReserved) seatClass = 'seat-item reserved';
                    else if (isSelected) seatClass = 'seat-item selected';

                    return (
                      <button
                        key={seatId}
                        type="button"
                        className={seatClass}
                        disabled={isReserved}
                        onClick={() => toggleSeat(seatId)}
                        title={`${row}-${col}`}
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Middle Corridor */}
          <div className="floor-middle-corridor">
            <div className="corridor-line"></div>
            <span className="corridor-label font-heading">
              {language === 'tr' ? 'KORİDOR' : language === 'ru' ? 'КОРИДОР' : language === 'no' ? 'KORRIDOR' : 'CORRIDOR'}
            </span>
            <div className="corridor-line"></div>
          </div>

          {/* Right Block: 6 Rows, 6 Columns */}
          <div className="seating-block right-block">
            {rows.map(row => (
              <div key={`right-row-${row}`} className="seating-row">
                <div className="seats-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                  {[1, 2, 3, 4, 5, 6].map(col => {
                    const seatId = `R-${row}-${col}`;
                    const isReserved = reservedSeats.has(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    
                    let seatClass = 'seat-item available';
                    if (isReserved) seatClass = 'seat-item reserved';
                    else if (isSelected) seatClass = 'seat-item selected';

                    return (
                      <button
                        key={seatId}
                        type="button"
                        className={seatClass}
                        disabled={isReserved}
                        onClick={() => toggleSeat(seatId)}
                        title={`${row}-${col}`}
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>
                <span className="row-label font-heading" style={{ marginLeft: '10px' }}>{row}</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    );
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" id="scrollProgress"></div>

      {/* Luxury Background Mesh & Light Cones */}
      <div className="luxury-mesh"></div>
      <div className="ambient-halo halo-gold" style={{ top: '15vh', left: '5%' }}></div>
      <div className="ambient-halo halo-gold" style={{ top: '45vh', right: '5%' }}></div>
      <div className="ambient-halo halo-gold" style={{ bottom: '20vh', left: '10%' }}></div>

      {/* Animated Preloader */}
      <div className={`preloader ${!loading ? 'fade-out' : ''}`}>
        <div className="preloader-content">
          <div className="preloader-logo-container">
            <div className="preloader-logo-ring"></div>
            <div className="preloader-logo-ring-outer"></div>
            <div className="preloader-logo-image">
              <Image src="/assets/logo.jpg" alt="EV Logo" width={110} height={110} priority />
            </div>
          </div>
          <div className="preloader-brand font-heading">E V</div>
          <div className="preloader-tagline font-body">
            {language === 'tr' ? 'KUSURSUZ LEZZET DENEYİMİ' : 
             language === 'ru' ? 'ИДЕАЛЬНЫЙ ВКУС' : 
             language === 'no' ? 'PERFEKT OPPLEVELSE' : 
             'PERFECT CUISINE EXPERIENCE'}
          </div>
          <div className="preloader-bar"></div>
        </div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-bg">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            poster="/assets/hero_bg.png"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src="/assets/evresvideo.mp4" type="video/mp4" />
            <Image src="/assets/hero_bg.png" alt="Ev Restaurant" fill priority />
          </video>
        </div>
        {/* Floating Ambient Particles */}
        <div className="gold-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        <div className="hero-content">
          <div className="hero-content-inner">
            <div className="hero-logo-wrapper">
              <div className="hero-logo-ring-sub"></div>
              <Image src="/assets/logo.jpg" alt="EV Bar & Kitchen Logo" width={80} height={80} style={{objectFit: 'contain', borderRadius: '50%', border: '1.5px solid var(--color-gold)'}} />
            </div>

            <h2 className="font-serif hero-title">
              {language === 'tr' ? (
                <>Lezzetin <span className="text-gold italic">Zarafetle</span> Buluştuğu Yer</>
              ) : language === 'ru' ? (
                <>Где вкус встречается с <span className="text-gold italic">элегантностью</span></>
              ) : language === 'no' ? (
                <>Der smak møter <span className="text-gold italic">eleganse</span></>
              ) : (
                <>Where Taste Meets <span className="text-gold italic">Elegance</span></>
              )}
            </h2>
            <p className="font-body hero-description">{t('heroDesc')}</p>
            
            <div className="hero-actions">
              <Link href="#reservation" className="btn btn-solid btn-luxury-glow">{t('heroBookBtn')}</Link>
              <Link href="/menu" className="btn btn-outline-gold">{t('heroMenuBtn')}</Link>
            </div>
          </div>
          
          {/* Scroll Down Indicator */}
          <div className="hero-scroll-indicator">
            <span className="scroll-text font-body">SCROLL DOWN</span>
            <div className="scroll-line">
              <div className="scroll-dot"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="section-padding bg-alt" style={{ overflow: 'hidden', position: 'relative' }}>
        <div className="bg-watermark">CREATION</div>
        <div className="container about-grid">
          <div className="reveal-left">
            <p className="section-subtitle">{t('aboutSubtitle')}</p>
            <h2 className="section-title font-heading">{t('aboutTitle')}</h2>
            <p className="text-muted font-body section-desc-paragraph about-desc-1">
              {t('aboutDesc1')}
            </p>
            <p className="text-muted font-body section-desc-paragraph about-desc-2">
              {t('aboutDesc2')}
            </p>

          </div>
          <div className="about-image-wrapper reveal-right delay-200">
            <div className="about-image">
              <Image src="/assets/philosophy_dish.jpg" alt="Culinary Art" fill />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive History Timeline Section */}
      <section className="section-padding bg-main" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="bg-watermark">JOURNEY</div>
        <div className="container">
          <div className="text-center reveal" style={{marginBottom: '4rem'}}>
            <p className="section-subtitle">{t('timeSubtitle')}</p>
            <h2 className="section-title font-heading">{t('timeTitle')}</h2>
          </div>

          <div className="timeline-container reveal-scale">
            {/* Timeline Slider Buttons */}
            <div className="timeline-slider">
              {[2018, 2020, 2023, 2026].map(year => (
                <button
                  key={year}
                  onClick={() => setActiveTimelineYear(year)}
                  className={`timeline-year-btn font-heading ${activeTimelineYear === year ? 'active' : ''}`}
                >
                  {year}
                </button>
              ))}
              <div className="timeline-progress-line">
                <div 
                  className="timeline-progress-fill" 
                  style={{
                    width: activeTimelineYear === 2018 ? '0%' : 
                           activeTimelineYear === 2020 ? '33.3%' : 
                           activeTimelineYear === 2023 ? '66.6%' : '100%'
                  }}
                ></div>
              </div>
            </div>

            {/* Timeline Display Card */}
            <div className="timeline-content-card">
              {activeTimelineYear === 2018 && (
                <div className="timeline-slide">
                  <h3 className="font-heading text-gold">{t('time2018Title')}</h3>
                  <p className="font-body text-muted">{t('time2018Desc')}</p>
                </div>
              )}
              {activeTimelineYear === 2020 && (
                <div className="timeline-slide">
                  <h3 className="font-heading text-gold">{t('time2020Title')}</h3>
                  <p className="font-body text-muted">{t('time2020Desc')}</p>
                </div>
              )}
              {activeTimelineYear === 2023 && (
                <div className="timeline-slide">
                  <h3 className="font-heading text-gold">{t('time2023Title')}</h3>
                  <p className="font-body text-muted">{t('time2023Desc')}</p>
                </div>
              )}
              {activeTimelineYear === 2026 && (
                <div className="timeline-slide">
                  <h3 className="font-heading text-gold">{t('time2026Title')}</h3>
                  <p className="font-body text-muted">{t('time2026Desc')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>



      {/* Atmosphere Section */}
      <section className="section-padding bg-main" style={{ overflow: 'hidden' }}>
        <div className="container atmosphere-grid">
          <div className="atmosphere-images reveal-left">
            <div className="img-box">
              <Image src="/assets/atmosphere_1.jpg" alt="Atmosphere 1" fill />
            </div>
            <div className="img-box">
              <Image src="/assets/atmosphere_2.jpg" alt="Atmosphere 2" fill />
            </div>
            <div className="img-box">
              <Image src="/assets/atmosphere_3.jpg" alt="Atmosphere 3" fill />
            </div>
          </div>
          <div className="reveal-right delay-200">
            <p className="section-subtitle">{t('atmSubtitle')}</p>
            <h2 className="section-title font-heading">{t('atmTitle')}</h2>
            <p className="text-muted font-body section-desc-paragraph atm-desc-1">
              {t('atmDesc1')}
            </p>
            <p className="text-muted font-body section-desc-paragraph atm-desc-2">
              {t('atmDesc2')}
            </p>
          </div>
        </div>
      </section>

      {/* Highlights (Chef's Recommendations) - Simplified to a direct CTA banner */}
      <section className="section-padding bg-alt" style={{ overflow: 'hidden', position: 'relative', padding: '4.5rem 2rem' }}>
        <div className="bg-watermark">MENU</div>
        <div className="container">
          <div className="text-center reveal">
            <p className="section-subtitle">{t('sigSubtitle')}</p>
            <h2 className="section-title font-heading" style={{marginBottom: '1.5rem'}}>{t('sigTitle')}</h2>
            <p className="font-body text-muted" style={{maxWidth: '650px', margin: '0 auto 2.5rem', fontSize: '1.1rem', lineHeight: '1.6'}}>
              {language === 'tr' ? 'Eşsiz lezzetlerimiz, modern sunumlarımız ve taze malzemelerimizle hazırlanan menümüzü keşfedin.' : 
               language === 'ru' ? 'Откройте для себя наше меню, приготовленное из свежих ингредиентов и изысканных вкусов.' : 
               language === 'no' ? 'Oppdag menyen vår, tilberedt med ferske ingredienser og utsøkte smaker.' : 
               'Discover our menu, prepared with fresh ingredients and exquisite flavors.'}
            </p>
            <Link href="/menu" className="btn btn-solid" style={{fontSize: '1rem', padding: '1rem 2.5rem'}}>{t('sigAllMenuBtn')}</Link>
          </div>
        </div>
      </section>

      {/* TripAdvisor Reviews */}
      <section className="section-padding tripadvisor-section" style={{ overflow: 'hidden', position: 'relative' }}>
        <div className="bg-watermark">FEEDBACK</div>
        <div className="container">
          <div className="ta-header reveal">
            <div className="ta-logo-circle">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14c-2.48 0-4.5-2.02-4.5-4.5S14.02 7 16.5 7 21 9.02 21 11.5 18.98 16 16.5 16zm-9 0C5.02 16 3 13.98 3 11.5S5.02 7 7.5 7 12 9.02 12 11.5 9.98 16 7.5 16zM12 14c-1.38 0-2.5-1.12-2.5-2.5S10.62 9 12 9s2.5 1.12 2.5 2.5S13.38 14 12 14z"/></svg>
            </div>
            <h2 className="section-title font-heading text-center" style={{marginBottom: 0}}>{t('revTitle')}</h2>
            <p className="font-body text-gold" style={{marginTop: '0.5rem', letterSpacing: '1px'}}>{t('revSubtitle')}</p>
          </div>
          
          <div className="ta-grid" ref={reviewsRef}>
            <div className="ta-card reveal delay-100">
              <div className="ta-stars">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <h3 className="ta-title font-heading">"Absolutely Phenomenal"</h3>
              <p className="ta-text font-body">From the moment we walked in, the service was impeccable. The prime tenderloin melts in your mouth, and the wine pairing was perfection.</p>
              <span className="ta-author">- Sarah J.</span>
            </div>
            
            <div className="ta-card reveal delay-200">
              <div className="ta-stars">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <h3 className="ta-title font-heading">"A Hidden Gem in Alanya"</h3>
              <p className="ta-text font-body">We visited Ev Restaurant based on recommendations, and it exceeded all expectations. The golden sphere dessert is a must-try!</p>
              <span className="ta-author">- Michael T.</span>
            </div>
            
            <div className="ta-card reveal delay-300">
              <div className="ta-stars">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <h3 className="ta-title font-heading">"Best Cocktails & Food"</h3>
              <p className="ta-text font-body">The ambiance is just stunning. Dark, moody, and elegant. The bartender knows exactly what they are doing. 10/10 experience.</p>
              <span className="ta-author">- Elena R.</span>
            </div>
            
            <div className="ta-card reveal delay-100">
              <div className="ta-stars">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <h3 className="ta-title font-heading">"Unforgettable Anniversary"</h3>
              <p className="ta-text font-body">They made our anniversary so special. The staff went above and beyond, and the seafood platter was the freshest I've had in years.</p>
              <span className="ta-author">- David & Emma</span>
            </div>
            
            <div className="ta-card reveal delay-200">
              <div className="ta-stars">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <h3 className="ta-title font-heading">"Pure Luxury"</h3>
              <p className="ta-text font-body">If you want a fine dining experience that rivals Michelin star restaurants in Europe, you have to visit EV. Incredible attention to detail.</p>
              <span className="ta-author">- Ahmed K.</span>
            </div>
            
            <div className="ta-card reveal delay-300">
              <div className="ta-stars">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <h3 className="ta-title font-heading">"Will definitely return"</h3>
              <p className="ta-text font-body">We had dinner here twice during our stay. The quality is consistently high, and the atmosphere makes you want to stay all night.</p>
              <span className="ta-author">- Sophie L.</span>
            </div>
          </div>
          
          {/* TripAdvisor Review Call to Action */}
          <div className="text-center reveal delay-200" style={{marginTop: '4rem'}}>
            <a 
              href="https://www.tripadvisor.com/UserReviewEdit-g297961-d2675774-Ev_Restaurant-Alanya_Turkish_Mediterranean_Coast.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-solid"
            >
              💬 {t('reviewUsOnTA')}
            </a>
          </div>
        </div>
      </section>

      {/* Reservation & Seating Map */}
      <section id="reservation" className="section-padding" style={{ overflow: 'hidden', position: 'relative' }}>
        <div className="bg-watermark">BOOKINGS</div>
        <div className="container">
          <div className="text-center reveal" style={{marginBottom: '3rem'}}>
            <p className="section-subtitle font-heading">{t('seatSubtitle')}</p>
            <h2 className="section-title font-heading">{t('seatTitle')}</h2>
            <p className="font-body text-muted" style={{maxWidth: '600px', margin: '0 auto'}}>
              {t('seatDesc')}
            </p>
          </div>

          {/* Interactive Seating Floor Plan */}
          <div className="floor-plan-section reveal-scale" style={{marginBottom: '4rem'}}>
            {selectedSeats.length > 0 && (
              <div className="selected-info-bar">
                <h5 className="font-heading">{t('seatSelectedBar')}: {selectedSeats.join(', ')}</h5>
                <span className="font-body text-gold" style={{fontWeight: 600}}>{selectedSeats.length} {t('seatCountLabel')}</span>
              </div>
            )}
            
            <div className="floor-plan-scroll">
              <div className="floor-plan-layout">
                <div className="salon-container">
                  {renderFloorPlan()}
                </div>
              </div>
            </div>

            <div className="floor-plan-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{backgroundColor: 'rgba(198, 155, 82, 0.1)', border: '1px solid rgba(198, 155, 82, 0.45)'}}></span>
                <span className="font-body">{t('legendAvailable')}</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)'}}></span>
                <span className="font-body">{t('legendReserved')}</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{backgroundColor: 'var(--color-gold)', border: '1px solid #fff'}}></span>
                <span className="font-body">{t('legendSelected')}</span>
              </div>
            </div>
          </div>

          <div className="res-contact-grid reveal-scale">
            <div className="res-form-area">
              <p className="section-subtitle">{t('formSubtitle')}</p>
              <h2 className="font-heading" style={{fontSize: '2.5rem', marginBottom: '2rem'}}>{t('formTitle')}</h2>
              
              <form onSubmit={handleReservationSubmit}>
                <div className="form-grid">
                  <input type="text" className="modern-input" placeholder={t('formNamePlh')} required value={resData.name} onChange={e => setResData({...resData, name: e.target.value})} />
                  <input type="tel" className="modern-input" placeholder={t('formPhonePlh')} required value={resData.phone} onChange={e => setResData({...resData, phone: e.target.value})} />
                  
                  <input type="date" className="modern-input" required value={resData.date} onChange={e => setResData({...resData, date: e.target.value})} />
                  <input type="time" className="modern-input" required value={resData.time} onChange={e => setResData({...resData, time: e.target.value})} />
                  
                  <input 
                    type="text" 
                    className="modern-input form-full" 
                    placeholder={t('formSeatsPlh')} 
                    required 
                    readOnly 
                    value={resData.guests ? `${resData.guests} ${t('seatCountLabel')} ${language === 'tr' ? 'Seçildi' : 'Selected'}` : ''} 
                  />

                  <label htmlFor="shuttle-service" className="form-full shuttle-toggle-container">
                    <input 
                      type="checkbox" 
                      id="shuttle-service" 
                      className="shuttle-checkbox"
                      checked={resData.hasShuttle} 
                      onChange={e => setResData({...resData, hasShuttle: e.target.checked})}
                    />
                    <div className="switch-track">
                      <div className="switch-knob"></div>
                    </div>
                    <span className="font-body label-text" style={{ color: '#fff', fontSize: '0.95rem', userSelect: 'none' }}>
                      🚗 {t('shuttleServiceLabel')}
                    </span>
                  </label>
                </div>
                
                <button type="submit" className="btn btn-solid form-full" style={{width: '100%', marginTop: '1.2rem'}} disabled={resStatus === 'loading'}>
                  {resStatus === 'loading' ? t('formProcessing') : t('formConfirmBtn')}
                </button>
                {resStatus === 'success' && <p style={{color: '#4CAF50', marginTop: '1rem', textAlign: 'center'}}>{t('formSuccess')}</p>}
                {resStatus === 'error' && <p style={{color: '#f44336', marginTop: '1rem', textAlign: 'center'}}>{t('formError')}</p>}
              </form>
              
              <div className="contact-info">
                <h4 className="font-heading text-gold">{t('contactLocation')}</h4>
                <p className="text-muted font-body" style={{marginBottom: '1.5rem', lineHeight: 1.8}}>
                  {t('addressText')}
                </p>
                
                <h4 className="font-heading text-gold">{t('contactPhone')}</h4>
                <p className="text-muted font-body" style={{fontSize: '1.2rem'}}>0545 511 10 51</p>
                <p className="text-muted font-body">evrestaurantalanya@gmail.com</p>
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
      <Footer />
    </>
  );
}
