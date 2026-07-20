import { NextResponse } from 'next/server';
import { menuData } from '@/lib/menuData';

export async function GET() {
  try {
    return NextResponse.json(menuData);
  } catch (error) {
    console.error("Error serving menu data: ", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
