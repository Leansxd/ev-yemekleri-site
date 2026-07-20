'use client';

import { useState } from 'react';

interface Reservation {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  hasShuttle: boolean;
  status: string;
  createdAt: string;
}

interface Props {
  initialReservations: Reservation[];
}

export default function ReservationDashboard({ initialReservations }: Props) {
  const [list, setList] = useState<Reservation[]>(initialReservations);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, confirmed, cancelled
  const [dateFilter, setDateFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Status updates handler
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/reservation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      } else {
        alert('Durum güncellenirken bir hata oluştu');
      }
    } catch (err) {
      console.error(err);
      alert('Sistem hatası oluştu');
    } finally {
      setUpdatingId(null);
    }
  };

  // Stats calculation
  const totalCount = list.length;
  const pendingCount = list.filter(item => item.status === 'pending').length;
  const confirmedCount = list.filter(item => item.status === 'confirmed').length;
  const cancelledCount = list.filter(item => item.status === 'cancelled').length;

  // Filtered list
  const filteredList = list.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesDate = !dateFilter || item.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="reservation-dashboard">
      {/* Header Info */}
      <div className="admin-header">
        <h1>Rezervasyon Yönetimi</h1>
        <p>Ev Restaurant tüm rezervasyon taleplerini gerçek zamanlı inceleyin ve güncelleyin.</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">Toplam Rezervasyon</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-label">Bekleyen Onay</div>
        </div>
        <div className="stat-card confirmed">
          <div className="stat-value">{confirmedCount}</div>
          <div className="stat-label">Onaylananlar</div>
        </div>
        <div className="stat-card cancelled">
          <div className="stat-value">{cancelledCount}</div>
          <div className="stat-label">İptal Edilenler</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="admin-filters-bar">
        <div className="filter-group">
          <input 
            type="text" 
            placeholder="Müşteri Adı veya Tel Ara..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input"
          />
        </div>

        <div className="filter-group">
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="admin-input"
          />
        </div>

        <div className="filter-tabs">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
          >
            Tümü
          </button>
          <button 
            onClick={() => setStatusFilter('pending')}
            className={`tab-btn status-pending-tab ${statusFilter === 'pending' ? 'active' : ''}`}
          >
            Bekleyenler ({pendingCount})
          </button>
          <button 
            onClick={() => setStatusFilter('confirmed')}
            className={`tab-btn status-confirmed-tab ${statusFilter === 'confirmed' ? 'active' : ''}`}
          >
            Onaylananlar
          </button>
          <button 
            onClick={() => setStatusFilter('cancelled')}
            className={`tab-btn status-cancelled-tab ${statusFilter === 'cancelled' ? 'active' : ''}`}
          >
            İptaller
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Müşteri Bilgisi</th>
              <th>Rezervasyon Detayı</th>
              <th>Kişi Sayısı</th>
              <th>Durum</th>
              <th className="text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4" style={{color: 'var(--color-text-muted)'}}>
                  Aradığınız kriterlere uygun rezervasyon bulunamadı.
                </td>
              </tr>
            ) : (
              filteredList.map(res => (
                <tr key={res.id} className={updatingId === res.id ? 'row-updating' : ''}>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name font-heading">{res.name}</span>
                      <span className="customer-phone">{res.phone}</span>
                    </div>
                  </td>
                  <td>
                    <div className="booking-details">
                      <span className="booking-date">📅 {res.date}</span>
                      <span className="booking-time">⏰ {res.time}</span>
                      {res.hasShuttle && (
                        <span className="shuttle-badge" style={{ backgroundColor: 'rgba(198, 155, 82, 0.15)', color: 'var(--color-gold)', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-block', width: 'fit-content', marginTop: '0.3rem', border: '1px solid rgba(198, 155, 82, 0.3)' }}>
                          🚗 VIP Shuttle
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="guests-count font-heading">{res.guests} Kişi</span>
                  </td>
                  <td>
                    <span className={`status-badge status-${res.status}`}>
                      {res.status === 'pending' ? 'Bekliyor' : res.status === 'confirmed' ? 'Onaylandı' : 'İptal Edildi'}
                    </span>
                  </td>
                  <td className="text-right">
                    {res.status === 'pending' && (
                      <div className="action-buttons-wrapper">
                        <button 
                          onClick={() => handleUpdateStatus(res.id, 'confirmed')}
                          disabled={updatingId !== null}
                          className="action-btn btn-confirm"
                        >
                          ✅ Onayla
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(res.id, 'cancelled')}
                          disabled={updatingId !== null}
                          className="action-btn btn-cancel"
                        >
                          ❌ İptal Et
                        </button>
                      </div>
                    )}
                    {res.status !== 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(res.id, 'pending')}
                        disabled={updatingId !== null}
                        className="action-btn btn-revert"
                        title="Bekleme durumuna geri al"
                      >
                        🔄 Geri Al
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
