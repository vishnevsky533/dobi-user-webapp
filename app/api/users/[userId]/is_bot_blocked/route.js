import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_USER_TOKEN);

export async function GET(request, { params }) {
    const { userId } = params;
    try {
        const chatMember = await bot.telegram.getChatMember(userId, userId);
        const isBlocked = chatMember.status === 'kicked' || chatMember.status === 'left';
        return new Response(JSON.stringify({ blocked: isBlocked }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ blocked: true }), { status: 200 });
    }
}
