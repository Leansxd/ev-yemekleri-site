'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // i18n hooks
  const { language, setLanguage, t } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link href="/" className="logo">
          <Image src="/assets/logo.jpg" alt="Ev Restaurant Logo" width={60} height={60} style={{objectFit: 'contain'}} />
        </Link>
        
        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li><Link href="/#home" onClick={() => setMobileMenuOpen(false)}>{t('navHome')}</Link></li>
          <li><Link href="/#about" onClick={() => setMobileMenuOpen(false)}>{t('navAbout')}</Link></li>
          <li><Link href="/menu" onClick={() => setMobileMenuOpen(false)}>{t('navMenus')}</Link></li>
        </ul>

        <div style={{display: 'flex', alignItems: 'center', gap: '1.2rem'}}>
          
          {/* Luxury i18n Language Dropdown */}
          <div 
            className="lang-selector"
            onMouseEnter={() => setLangDropdownOpen(true)}
            onMouseLeave={() => setLangDropdownOpen(false)}
          >
            <button className="lang-active-btn font-heading" onClick={() => setLangDropdownOpen(!langDropdownOpen)}>
              <span>{language.toUpperCase()}</span>
              <span className="arrow">▼</span>
            </button>
            <ul className={`lang-dropdown ${langDropdownOpen ? 'open' : ''}`}>
              <li><button onClick={() => { setLanguage('tr'); setLangDropdownOpen(false); }}>TR</button></li>
              <li><button onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}>EN</button></li>
              <li><button onClick={() => { setLanguage('ru'); setLangDropdownOpen(false); }}>RU</button></li>
              <li><button onClick={() => { setLanguage('no'); setLangDropdownOpen(false); }}>NO</button></li>
            </ul>
          </div>

          <Link href="/#reservation" className="btn btn-find-table" style={{padding: '0.6rem 1.3rem', fontSize: '0.75rem'}}>
            {t('navFindTable')}
          </Link>
          
          <div 
            className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </nav>
  );
}
