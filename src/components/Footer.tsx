'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { language, t } = useLanguage();

  const desc = {
    tr: "Toroslardan yerel malzemeler, avangart mutfak teknikleri ve Alanya'da standartları belirleyen ağırlama sanatı.",
    en: "Premium ingredients, avant-garde techniques, and standard-setting hospitality in Alanya.",
    ru: "Премиальные ингредиенты, авангардные кулинарные методы и гостеприимство, задающее стандарты в Аланье.",
    no: "Førsteklasses råvarer, avantgardistiske teknikker og standardsettende gjestfrihet i Alanya."
  };

  const nav = {
    tr: "Gezinti",
    en: "Navigation",
    ru: "Навигация",
    no: "Navigasjon"
  };

  const addr = {
    tr: "Adres & Sosyal Medya",
    en: "Address & Social",
    ru: "Адрес и соцсети",
    no: "Adresse & sosiale medier"
  };

  const rights = {
    tr: "Tüm hakları saklıdır.",
    en: "All Rights Reserved.",
    ru: "Все права защищены.",
    no: "Alle rettigheter forbeholdt."
  };

  const designed = {
    tr: "Kusursuzlukla tasarlandı.",
    en: "Designed with excellence.",
    ru: "Создано с превосходством.",
    no: "Designet med fortreffelighet."
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo-glow">
              <Image src="/assets/logo.jpg" alt="Ev Restaurant Logo" width={120} height={120} style={{objectFit: 'contain'}} />
            </div>
            <p className="font-body">
              {desc[language]}
            </p>
          </div>
          
          <div className="footer-links-col">
            <h4 className="footer-title">{nav[language]}</h4>
            <div className="footer-links-list">
              <Link href="/#home">{t('navHome')}</Link>
              <Link href="/#about">{t('navAbout')}</Link>
              <Link href="/menu">{t('navMenus')}</Link>
            </div>
          </div>
          
          <div className="footer-contact-info">
            <h4 className="footer-title">{addr[language]}</h4>
            <div className="footer-contact-item">
              <p className="font-body">
                {t('addressText')}
              </p>
            </div>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-btn" title="Instagram">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-btn" title="Facebook">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="https://www.tripadvisor.com/UserReviewEdit-g297961-d2675774-Ev_Restaurant-Alanya_Turkish_Mediterranean_Coast.html" target="_blank" rel="noreferrer" className="footer-social-btn" title="TripAdvisor">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 10c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm12 0c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm-6 2c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zm0-2c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Ev Restaurant. {rights[language]}</p>
          <p>{designed[language]}</p>
        </div>
      </div>
    </footer>
  );
}
