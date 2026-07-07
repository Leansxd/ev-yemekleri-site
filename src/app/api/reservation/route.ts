import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, date, time, guests } = body;
    
    if (!name || !phone || !date || !time || !guests) {
      return NextResponse.json({ error: 'Eksik bilgi girdiniz' }, { status: 400 });
    }

    const reservation = await prisma.reservation.create({
      data: {
        name,
        phone,
        date,
        time,
        guests
      }
    });

    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Rezervasyon işlemi sırasında bir hata oluştu' }, { status: 500 });
  }
}
