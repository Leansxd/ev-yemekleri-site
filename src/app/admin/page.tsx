import { prisma } from '@/lib/prisma';
import ReservationDashboard from './ReservationDashboard';

export const revalidate = 0; // Disable cache for admin pages

export default async function AdminReservations() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Serialize date fields for Next.js boundary transition safety
  const serialized = reservations.map(res => ({
    ...res,
    createdAt: res.createdAt.toISOString()
  }));

  return <ReservationDashboard initialReservations={serialized} />;
}
