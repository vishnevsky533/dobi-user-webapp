// app/api/users/[userId]/route.js

import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { Telegraf } from 'telegraf';

// Инициализация бота Telegraf
const bot = new Telegraf(process.env.BOT_USER_TOKEN);

/**
 * Проверяет, подписан ли пользователь на канал.
 * @param {number} userId - Telegram ID пользователя.
 * @returns {boolean} - Возвращает true, если пользователь подписан, иначе false.
 */
const checkUserSubscription = async (userId) => {
    const CHANNEL_USERNAME = process.env.NEXT_PUBLIC_PUBLICATION_GROUP_NAME; // Например, 'my_channel'

    try {
        const chatMember = await bot.telegram.getChatMember(`@${CHANNEL_USERNAME}`, userId);
        const { status } = chatMember;

        // Возможные статусы: creator, administrator, member, restricted, left, kicked
        return status === 'creator' || status === 'administrator' || status === 'member';
    } catch (error) {
        console.error('Ошибка при проверке подписки:', error.message);
        // Если пользователь не найден в чате или произошла ошибка, считается, что он не подписан
        return false;
    }
}

export async function GET(request, { params }) {
    await dbConnect();
    const { userId } = await params;

    try {
        const user = await User.findOne({ public_id: userId });

        if (!user) {
            return new Response(JSON.stringify({ success: false, message: 'Пользователь не найден' }), { status: 404 });
        }

        if (user.is_ban) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Ваш аккаунт заблокирован и вы не можете участвовать в акциях.'
            }), { status: 403 });
        }

        // Проверка наличия никнейма
        const hasNickname = user.nickname && user.nickname.trim() !== '';

        // Проверка подписки на канал
        const isSubscribed = await checkUserSubscription(userId);

        // Если все проверки пройдены, возвращаем информацию о пользователе
        return new Response(JSON.stringify({
            success: true,
            user: {
                id: user.public_id,
                nickname: user.nickname,
                firstName: user.first_name,
                lastName: user.last_name,
                isBanned: user.is_ban,
                hasNickname,
                isSubscribed,
                rulesAccepted: user.rules_accepted,
            },
        }), { status: 200 });

    } catch (error) {
        console.error('Ошибка при получении пользователя:', error);
        return new Response(JSON.stringify({ success: false, message: 'Внутренняя ошибка сервера' }), { status: 500 });
    }
}
