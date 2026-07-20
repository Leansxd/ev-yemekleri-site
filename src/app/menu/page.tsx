'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageWrapper from '@/components/PageWrapper';
import { useLanguage } from '@/context/LanguageContext';
import './page.css';

interface MenuItem {
  id: string;
  nameTr: string;
  nameEn: string;
  nameRu: string;
  nameNo: string;
  descriptionTr: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionNo: string;
  categoryTr: string;
  categoryEn: string;
  categoryRu: string;
  categoryNo: string;
  imageUrl: string | null;
}

export default function MenuPage() {
  const { t, language } = useLanguage();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Modal State
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu');
        if (res.ok) {
          const data = await res.json();
          setMenuItems(data);
        }
      } catch (err) {
        console.error("Failed to fetch menu items: ", err);
      } finally {
        setLoadingItems(false);
      }
    }
    fetchMenu();
  }, []);

  // Multi-language getter functions for each item
  const getItemName = (item: MenuItem) => {
    if (language === 'tr') return item.nameTr;
    if (language === 'ru') return item.nameRu;
    if (language === 'no') return item.nameNo;
    return item.nameEn;
  };

  const getItemDesc = (item: MenuItem) => {
    if (language === 'tr') return item.descriptionTr;
    if (language === 'ru') return item.descriptionRu;
    if (language === 'no') return item.descriptionNo;
    return item.descriptionEn;
  };

  const getItemCategory = (item: MenuItem) => {
    if (language === 'tr') return item.categoryTr;
    if (language === 'ru') return item.categoryRu;
    if (language === 'no') return item.categoryNo;
    return item.categoryEn;
  };

  // Get distinct categories in the current active language (excluding 'All')
  const uniqueCategories = Array.from(new Set(menuItems.map(item => getItemCategory(item))));
  const categories = ['All', ...uniqueCategories];

  // Helper to dynamically parse dietary badges based on English name/description keywords
  const getDietaryTags = (item: MenuItem) => {
    const tags = [];
    const desc = (item.descriptionEn || '').toLowerCase();
    const name = (item.nameEn || '').toLowerCase();

    if (desc.includes('chef') || name.includes('special') || name.includes('signature') || name.includes('marmarina') || name.includes('sultan') || name.includes('schnitzel')) {
      tags.push({ key: 'chef', label: language === 'tr' ? 'Şefin Seçimi' : language === 'ru' ? 'Выбор шефа' : language === 'no' ? 'Kjøkkensjefens valg' : "Chef's Choice", icon: '⭐' });
    }
    if (desc.includes('vegetable') || name.includes('veggie') || name.includes('vegetarian') || name.includes('margarita') || name.includes('formagi') || name.includes('gorgonzola')) {
      tags.push({ key: 'vegan', label: language === 'tr' ? 'Vejetaryen' : language === 'ru' ? 'Вегетарианский' : language === 'no' ? 'Vegetarisk' : 'Vegetarian', icon: '🌱' });
    }
    if (desc.includes('hot') || desc.includes('chili') || desc.includes('spicy') || name.includes('spicy') || name.includes('mexican') || name.includes('pepperoni')) {
      tags.push({ key: 'spicy', label: language === 'tr' ? 'Baharatlı' : language === 'ru' ? 'Острый' : language === 'no' ? 'Sterk' : 'Spicy', icon: '🌶️' });
    }
    return tags;
  };

  // Helper to dynamically get sourced locations in 4 languages
  const getSourcedLocation = (item: MenuItem) => {
    const name = (item.nameEn || '').toLowerCase();
    const isTr = language === 'tr';
    const isRu = language === 'ru';
    const isNo = language === 'no';
    
    if (name.includes('steak') || name.includes('ribeye') || name.includes('beef') || name.includes('lamb') || name.includes('lokum')) {
      if (isTr) return 'Toros Dağları Yerel Besi Çiftlikleri';
      if (isRu) return 'Местные животноводческие фермы в горах Торос';
      if (isNo) return 'Lokale gårder i Taurusfjellene';
      return 'Taurus Mountains Local Livestock Farms';
    }
    if (name.includes('chicken') || name.includes('schnitzel')) {
      if (isTr) return 'Alanya Dim Çayı Ekolojik Çiftliğimiz';
      if (isRu) return 'Экологическая ферма Дим-Чай, Аланья';
      if (isNo) return 'Dim River økologisk gård i Alanya';
      return 'Alanya Dim River Ecological Farm';
    }
    if (name.includes('seafood') || name.includes('tonno') || name.includes('tuna')) {
      if (isTr) return 'Akdeniz Günlük Taze Avı';
      if (isRu) return 'Свежий ежедневный улов Средиземного моря';
      if (isNo) return 'Fersk fangst fra Middelhavet';
      return 'Mediterranean Fresh Daily Catch';
    }
    
    if (isTr) return 'Alanya Sarımut Yaylası Ekolojik Bahçeleri';
    if (isRu) return 'Экологические сады нагорья Сарымут, Аланья';
    if (isNo) return 'Sarimut høylandet økologiske hager i Alanya';
    return 'Alanya Sarimut Highland Ecological Gardens';
  };

  // Helper to dynamically match wine pairings in 4 languages
  const getWinePairing = (item: MenuItem) => {
    const category = item.categoryEn;
    const isTr = language === 'tr';
    const isRu = language === 'ru';
    const isNo = language === 'no';

    if (category.includes('Grill') || category.includes('Kitchen') || item.nameEn.toLowerCase().includes('steak')) {
      if (isTr) return '2019 Cabernet Sauvignon - Syrah Reserve (Kavımızdan)';
      if (isRu) return 'Каберне Совиньон 2019 года — Сира Резерв (из погреба)';
      if (isNo) return '2019 Cabernet Sauvignon - Syrah Reserve (fra kjelleren)';
      return '2019 Cabernet Sauvignon - Syrah Reserve (from Cellar)';
    }
    if (item.nameEn.toLowerCase().includes('chicken') || item.nameEn.toLowerCase().includes('pizza')) {
      if (isTr) return 'Chardonnay Oak Aged - Sauvignon Blanc (Soğutulmuş)';
      if (isRu) return 'Выдержанное в дубе Шардоне — Совиньон Блан (охлажденное)';
      if (isNo) return 'Chardonnay eiklagret - Sauvignon Blanc (avkjølt)';
      return 'Chardonnay Oak Aged - Sauvignon Blanc (chilled)';
    }

    if (isTr) return 'Şefin Özel Meyve Kokteylleri';
    if (isRu) return 'Фирменные фруктовые коктейли от шефа';
    if (isNo) return 'Våre signaturcocktailer';
    return 'Our Signature Cocktails';
  };

  // Filter items based on category tabs and search inputs
  const filteredItems = menuItems.filter(item => {
    const itemCategory = getItemCategory(item);
    const matchesCategory = activeCategory === 'All' || itemCategory === activeCategory;
    
    const name = getItemName(item);
    const desc = getItemDesc(item);
                 
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Re-observe and reset scroll animations whenever filtered items or active categories change
  useEffect(() => {
    if (loadingItems || menuItems.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.05 });

    const revealElements = document.querySelectorAll('.fade-up');
    revealElements.forEach(el => {
      el.classList.remove('visible'); // Reset to trigger clean entry animation again
      observer.observe(el);
    });

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, [filteredItems, activeCategory, loadingItems]);

  // Reusable render helper for a single menu card
  const renderMenuCard = (item: MenuItem) => {
    const tags = getDietaryTags(item);
    const name = getItemName(item);
    const desc = getItemDesc(item);
    return (
      <div 
        key={item.id} 
        className="menu-card fade-up"
        onClick={() => setSelectedDish(item)}
        style={{cursor: 'pointer'}}
      >
        {item.imageUrl ? (
          <div className="menu-img">
            <Image 
              src={item.imageUrl} 
              alt={name} 
              width={200} 
              height={200} 
              style={{objectFit: 'cover', width: '100%', height: '100%'}} 
            />
          </div>
        ) : (
          <div className="menu-img-placeholder">
            <span className="placeholder-icon">🍽️</span>
          </div>
        )}
        <div className="menu-info">
          <div className="menu-item-header">
            <h4 className="font-heading menu-item-name">{name}</h4>
          </div>
          <p className="desc font-body" style={{marginBottom: '1rem'}}>{desc}</p>
          
          {/* Dietary Badges */}
          {tags.length > 0 && (
            <div className="dietary-badges">
              {tags.map(t => (
                <span key={t.key} className={`badge-pill badge-${t.key}`} title={t.label}>
                  {t.icon} {t.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <PageWrapper>
      <div className="menu-page" style={{ position: 'relative', overflow: 'hidden' }}>
        <Navbar />

        <div className="menu-header">
          <div className="bg-watermark">CUISINE</div>
          <h2 className="font-heading">{t('navMenus')}</h2>
          <p className="font-body">{t('subMenuHeader')}</p>
        </div>

        <div className="container menu-content">

          {/* Visual Categories Grid - Only visible when "All" is active */}
          {activeCategory === 'All' && (
            <div className="categories-grid fade-up">
              <div className="categories-card-wrapper">
                {categories.map(cat => {
                  let bgImage = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80';
                  const catLower = cat.toLowerCase();
                  if (catLower === 'all' || catLower === 'hepsi' || catLower === 'все' || catLower === 'alle') {
                    bgImage = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80';
                  } else if (catLower.includes('gurme') || catLower.includes('gourmet') || catLower.includes('гурме')) {
                    bgImage = 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&auto=format&fit=crop&q=80';
                  } else if (catLower.includes('pizza') || catLower.includes('пицца')) {
                    bgImage = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80';
                  } else if (catLower.includes('tavuk') || catLower.includes('chicken') || catLower.includes('куриц') || catLower.includes('kylling')) {
                    bgImage = 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80';
                  } else if (catLower.includes('türk') || catLower.includes('turkish') || catLower.includes('турецк') || catLower.includes('tyrkisk')) {
                    bgImage = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80';
                  } else if (catLower.includes('ızgara') || catLower.includes('izgara') || catLower.includes('grill') || catLower.includes('гриль')) {
                    bgImage = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80';
                  }

                  const displayName = cat === 'All' ? (language === 'tr' ? 'Tüm Menü' : language === 'ru' ? 'Все меню' : language === 'no' ? 'Hele menyen' : 'All Menu') : cat;
                  const itemCount = cat === 'All' ? menuItems.length : menuItems.filter(item => getItemCategory(item) === cat).length;

                  return (
                    <div
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        const el = document.getElementById('dishes-section-anchor');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className={`category-card ${activeCategory === cat ? 'active' : ''}`}
                      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${bgImage})` }}
                    >
                      <div className="cat-card-content">
                        <h4 className="font-heading">{displayName}</h4>
                        <span className="font-body text-gold">{itemCount} {language === 'tr' ? 'Seçenek' : language === 'ru' ? 'Блюд' : language === 'no' ? 'Retter' : 'Options'}</span>
                      </div>
                      <div className="cat-card-gold-glow"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div id="dishes-section-anchor" style={{ scrollMarginTop: '120px' }}></div>


          {/* Category Filter Tabs */}
          <div className="category-tabs-container fade-up">
            <div className="category-tabs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`tab-btn font-heading ${activeCategory === cat ? 'active' : ''}`}
                >
                  {cat === 'All' ? (language === 'tr' ? 'Hepsi' : language === 'ru' ? 'Все' : language === 'no' ? 'Alle' : 'All') : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid with Category separation for 'All' tab */}
          {loadingItems ? (
            <div className="text-center font-body text-muted" style={{marginTop: '4rem'}}>
              {language === 'tr' ? 'Lezzetler yükleniyor...' : language === 'ru' ? 'Загрузка меню...' : language === 'no' ? 'Menyen lastes...' : 'Loading gourmet selections...'}
            </div>
          ) : filteredItems.length === 0 ? (
            <p className="text-center font-body text-muted" style={{marginTop: '4rem'}}>
              {language === 'tr' ? 'Arama kriterlerine uygun yemek bulunamadı.' : language === 'ru' ? 'Блюда не найдены.' : language === 'no' ? 'Ingen retter funnet.' : 'No dishes matched your search.'}
            </p>
          ) : (
            <div className="menu-categories-wrapper">
              {activeCategory === 'All' ? (
                // Group items by category when 'All' is active
                uniqueCategories.map(categoryName => {
                  const categoryItems = filteredItems.filter(item => getItemCategory(item) === categoryName);
                  if (categoryItems.length === 0) return null;
                  return (
                    <div key={categoryName} className="menu-category-section" style={{marginBottom: '5rem'}}>
                      <div className="category-header-wrap" style={{marginBottom: '2rem', borderBottom: '1px solid rgba(198, 155, 82, 0.18)', paddingBottom: '0.8rem'}}>
                        <h3 className="font-heading text-gold category-section-title" style={{fontSize: '1.8rem', textTransform: 'uppercase', letterSpacing: '3px'}}>{categoryName}</h3>
                      </div>
                      <div className="menu-grid">
                        {categoryItems.map(item => renderMenuCard(item))}
                      </div>
                    </div>
                  );
                })
              ) : (
                // Single category grid
                <div className="menu-grid">
                  {filteredItems.map(item => renderMenuCard(item))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 1. Dish Detail Explainer Modal */}
        {selectedDish && (
          <div className="glass-modal-overlay" onClick={() => setSelectedDish(null)}>
            <div className="glass-modal-card" onClick={e => e.stopPropagation()}>
              <button className="close-modal-btn" onClick={() => setSelectedDish(null)}>✕</button>
              
              <div className="modal-dish-grid">
                {selectedDish.imageUrl ? (
                  <div className="modal-dish-img">
                    <Image src={selectedDish.imageUrl} alt={getItemName(selectedDish)} fill style={{objectFit: 'cover'}} />
                  </div>
                ) : (
                  <div className="modal-dish-img-placeholder">
                    <span className="placeholder-icon">🍽️</span>
                  </div>
                )}
                
                <div className="modal-dish-info">
                  <span className="font-body text-gold category-label-tag">{getItemCategory(selectedDish)}</span>
                  <h3 className="font-heading text-white modal-dish-title">{getItemName(selectedDish)}</h3>
                  
                  <div className="modal-divider"></div>
                  
                  <p className="font-body modal-desc">{getItemDesc(selectedDish)}</p>
                  
                  <div className="modal-divider"></div>
                  
                  {/* Sourced Location & Pairing Info */}
                  <div className="modal-meta-section">
                    <div className="meta-row">
                      <span className="meta-icon">📍</span>
                      <div className="meta-text">
                        <strong>{t('sourcedLabel') || 'Köken'}:</strong>
                        <p>{getSourcedLocation(selectedDish)}</p>
                      </div>
                    </div>
                    
                    <div className="meta-row" style={{marginTop: '1.2rem'}}>
                      <span className="meta-icon">🍷</span>
                      <div className="meta-text">
                        <strong>{t('chefWineSuggestion') || 'Uyumlu Eşleşme'}:</strong>
                        <p>{getWinePairing(selectedDish)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="modal-action-row" style={{marginTop: '2.5rem'}}>
                    <Link 
                      href="/#reservation" 
                      className="btn btn-solid" 
                      style={{width: '100%', textAlign: 'center'}}
                      onClick={() => setSelectedDish(null)}
                    >
                      {t('reserveForDishBtn') || 'Bu Lezzet İçin Rezervasyon Yap'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </PageWrapper>
  );
}
