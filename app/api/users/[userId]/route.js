// app/api/users/[userId]/route.js

import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

export async function GET(request, { params }) {
    await dbConnect();
    const resolvedParams = await params;
    const { userId } = resolvedParams;

    const user = await User.findOne({ public_id: userId });

    if (user) {
        return new Response(JSON.stringify(user), { status: 200 });
    } else {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
}