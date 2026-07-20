'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2 className="cinzel"><span className="gold-text">EV</span> ADMIN</h2>
        </div>
        <nav className="admin-nav">
          <ul>
            <li>
              <Link href="/admin" className={pathname === '/admin' ? 'active' : ''}>
                Rezervasyonlar
              </Link>
            </li>
            <li>
              <Link href="/admin/menu" className={pathname === '/admin/menu' ? 'active' : ''}>
                Menü Yönetimi
              </Link>
            </li>
            <li>
              <Link href="/">
                Siteye Dön
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
