import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Disable cache for admin pages

export default async function AdminMenu() {
  const menuItems = await prisma.menuItem.findMany({
    orderBy: { category: 'asc' }
  });

  return (
    <>
      <div className="admin-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1>Menü Yönetimi</h1>
          <p>Sitedeki ve QR menüdeki ürünleri yönetin.</p>
        </div>
        <button className="btn-primary" style={{padding: '0.6rem 1.5rem', fontSize: '0.9rem'}}>+ Yeni Ürün</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Ürün Adı</th>
            <th>Kategori</th>
            <th>Fiyat</th>
            <th>Durum</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">Henüz ürün bulunmuyor.</td>
            </tr>
          ) : (
            menuItems.map(item => (
              <tr key={item.id}>
                <td>
                  <strong>{item.name}</strong><br/>
                  <small style={{color: 'var(--color-text-muted)'}}>{item.description}</small>
                </td>
                <td>{item.category}</td>
                <td>{item.price} ₺</td>
                <td>
                  <span className={`status-badge ${item.isAvailable ? 'status-confirmed' : 'status-cancelled'}`}>
                    {item.isAvailable ? 'Aktif' : 'Tükendi'}
                  </span>
                </td>
                <td>
                  <button className="action-btn">Düzenle</button>
                  <button className="action-btn" style={{borderColor: '#f44336', color: '#f44336'}}>Sil</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
