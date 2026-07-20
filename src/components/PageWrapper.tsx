'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScrollProgress = () => {
      const bar = document.getElementById('scrollProgressSub');
      if (bar) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        bar.style.width = `${progress}%`;
      }
    };
    window.addEventListener('scroll', handleScrollProgress);
    return () => window.removeEventListener('scroll', handleScrollProgress);
  }, []);

  // Intersection Observer for scroll animation triggers on subpages
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.05 });

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .fade-up');
    revealElements.forEach(el => observer.observe(el));

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, [loading]);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" id="scrollProgressSub"></div>

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

      {children}
    </>
  );
}
