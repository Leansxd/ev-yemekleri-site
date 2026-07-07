import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Disable cache for admin pages

export default async function AdminReservations() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <div className="admin-header">
        <h1>Rezervasyon Yönetimi</h1>
        <p>Tüm rezervasyon taleplerini buradan görüntüleyebilirsiniz.</p>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Tarih & Saat</th>
            <th>Müşteri Bilgisi</th>
            <th>Kişi</th>
            <th>Durum</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">Henüz rezervasyon bulunmuyor.</td>
            </tr>
          ) : (
            reservations.map(res => (
              <tr key={res.id}>
                <td>
                  <strong>{res.date}</strong><br/>
                  {res.time}
                </td>
                <td>
                  <strong>{res.name}</strong><br/>
                  <small style={{color: 'var(--color-text-muted)'}}>{res.phone}</small>
                </td>
                <td>{res.guests}</td>
                <td>
                  <span className={`status-badge status-${res.status}`}>
                    {res.status === 'pending' ? 'Bekliyor' : res.status === 'confirmed' ? 'Onaylandı' : 'İptal'}
                  </span>
                </td>
                <td>
                  {res.status === 'pending' && (
                    <>
                      <button className="action-btn" style={{borderColor: '#4caf50', color: '#4caf50'}}>Onayla</button>
                      <button className="action-btn" style={{borderColor: '#f44336', color: '#f44336'}}>İptal Et</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
