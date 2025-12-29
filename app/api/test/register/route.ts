import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Add your route logic here
    return NextResponse.json({ message: 'Test register route' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

