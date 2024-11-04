import User from '../models/User.js';
import {Telegraf} from "telegraf";

export const findOrCreateUserInWebApp = async (UserObj) => {
    // Поиск пользователя
    let user = await User.findOne({public_id: UserObj.public_id});

    const bot = new Telegraf(process.env.BOT_USER_TOKEN);
    // Если пользователя нет, создаем нового
    if (!user) {
        user = new User({
            public_id: UserObj.public_id,
            nickname: UserObj.nickname || '',
            first_name: UserObj.first_name || '',
            last_name: UserObj.last_name || '',
            rules_accepted: UserObj.rules_accepted, // По умолчанию правила еще не приняты
        });
        await bot.telegram.sendMessage(process.env.REPORTS_GROUP_ID, `Пользователь @${user.nickname} (${user.first_name}) зарегистрировался`);
        await user.save();
    }
    return user;
};
