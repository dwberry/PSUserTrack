import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, path, query, timestamp } = body;

        if (!userId || !path) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const ref = db.ref(`visits/${userId}`).push();
        await ref.set({
            path,
            query: query || '',
            timestamp: timestamp || Date.now(),
        });

        const response = NextResponse.json({ success: true });

        // Add CORS headers
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

        return response;
    } catch (error) {
        console.error('Error tracking visit:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function OPTIONS() {
    const response = NextResponse.json({}, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
}
