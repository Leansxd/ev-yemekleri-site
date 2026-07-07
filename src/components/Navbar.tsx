'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <Image src="/assets/logo.jpg" alt="EV Bar & Kitchen Logo" width={60} height={60} style={{objectFit: 'contain'}} />
        </Link>
        
        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li><Link href="/#home" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
          <li><Link href="/#about" onClick={() => setMobileMenuOpen(false)}>About Us</Link></li>
          <li><Link href="/menu" onClick={() => setMobileMenuOpen(false)}>Menus</Link></li>
          <li><Link href="/showroom" onClick={() => setMobileMenuOpen(false)}>Showroom</Link></li>
        </ul>

        <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
          <Link href="/#reservation" className="btn" style={{padding: '0.6rem 1.5rem', fontSize: '0.8rem'}}>
            Find A Table
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
