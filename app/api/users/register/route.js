import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import {findOrCreateUserInWebApp} from "@/helpers/findOrCreateUserInWebApp";

export async function POST(request) {
    await dbConnect();
    const {
        userId,
        nickname,
        firstName,
        lastName,
        rulesAccepted
    } = await request.json();


    try {
        await findOrCreateUserInWebApp({
            public_id: userId,
            nickname,
            first_name: firstName,
            last_name: lastName,
            rules_accepted: rulesAccepted
        });
        return new Response(JSON.stringify({success: true}), {status: 200});
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Ошибка при регистрации пользователя'
        }), {status: 500});
    }
}
