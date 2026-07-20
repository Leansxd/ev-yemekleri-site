import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendReservationAlert } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, date, time, guests, hasShuttle } = body;
    
    if (!name || !phone || !date || !time || !guests) {
      return NextResponse.json({ error: 'Eksik bilgi girdiniz' }, { status: 400 });
    }

    const reservation = await prisma.reservation.create({
      data: {
        name,
        phone,
        date,
        time,
        guests,
        hasShuttle: Boolean(hasShuttle)
      }
    });

    // Send real-time mail notification alert to restaurant owner (non-blocking)
    sendReservationAlert(reservation).catch(err => {
      console.error('Mail notification failed:', err);
    });

    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Rezervasyon işlemi sırasında bir hata oluştu' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 });
    }

    const updated = await prisma.reservation.update({
      where: { id: Number(id) },
      data: { status }
    });

    return NextResponse.json({ success: true, reservation: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Rezervasyon güncellenirken bir hata oluştu' }, { status: 500 });
  }
}
