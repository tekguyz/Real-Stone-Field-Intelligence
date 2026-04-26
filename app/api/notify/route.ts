import { NextResponse } from 'next/server';
import { sendVerificationNotification } from '../../../shared/api/notification-service';

export async function POST(req: Request) {
  try {
    const { job, userEmail } = await req.json();

    if (!job) {
      return NextResponse.json({ error: 'Job details are required' }, { status: 400 });
    }

    const result = await sendVerificationNotification(job, userEmail || 'demo@example.com');

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing notification request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
