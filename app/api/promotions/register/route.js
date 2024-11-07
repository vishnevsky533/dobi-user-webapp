// app/api/promotions/register/route.js
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import Promotion from '@/models/Promotion';
import Publication from '@/models/Publication';
import SlotPlace from '@/models/SlotPlace';
import {Telegraf, Markup} from 'telegraf';
import {generateInstructionsPartOne, generateInstructionsPartTwo} from '@/helpers/instruction';

const bot = new Telegraf(process.env.BOT_USER_TOKEN);

function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

const sendInstructionPartTwo = async (userId, selectedPromotion) => {
    try {
        const {screenshot_link} = selectedPromotion;

        if (screenshot_link && isValidURL(screenshot_link)) {

            await bot.telegram.sendPhoto(userId, screenshot_link, {
                caption: generateInstructionsPartTwo(selectedPromotion),
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                        Markup.button.callback('Управление акцией', 'promotion_menu')
                    ]
                )
            })
        } else {
            await bot.telegram.sendMessage(userId, generateInstructionsPartOne(selectedPromotion));
        }
    } catch (error) {
        console.error(error);
    }
}

const handleParticipation = async (userId, publicationId) => {

    try {
        const user = await User.findOne({public_id: userId});

        if (!user) {
            // Пользователь не найден
            return {success: false, message: 'Пользователь не найден'};
        }
        // Получаем публикацию и акцию
        const publication = await Publication.findById(publicationId).populate('promotion_id');
        if (!publication) {
            // Публикация не найдена
            return {success: false, message: 'Публикация не найдена'};
        }

        const activePromotions = user.participated_promotions.filter(promotion => promotion.status === 'in_progress');
        if (activePromotions.length >= 3) {
            // Максимальное количество акций
            return {success: false, message: 'Вы участвуете в максимальном количестве акций'};
        }

        if (publication.available_places <= 0) {
            // Нет доступных мест
            return {success: false, message: 'К сожалению, в акции больше нет доступных мест'};
        }

        let slotPlace = await SlotPlace.findOne({publication_id: publicationId});

        if (!slotPlace) {
            slotPlace = new SlotPlace({
                publication_id: publicationId,
                participants: []
            });
        }

        const existingParticipant = slotPlace.participants.find(participant => participant.user_id.toString() === user._id.toString());

        if (existingParticipant) {
            // Уже зарегистрирован
            return {success: false, message: 'Вы уже зарегистрированы в этой акции'};
        }

        const alreadyParticipating = user.participated_promotions.some(promotion =>
            promotion.promotion_id.toString() === publication.promotion_id._id.toString()
        );

        if (alreadyParticipating) {
            // Уже участвует в акции
            return {success: false, message: 'Вы уже зарегистрированы в этой акции'};
        }

        // Пробуем отправить сообщение пользователю
        try {
            await bot.telegram.sendMessage(
                userId,
                `Вы успешно зарегистрировались для участия в акции "${publication.promotion_id.product_name}". Инструкция:`
            );
        } catch (err) {
            if (err.code === 403) {
                // Пользователь заблокировал бота или не запустил его
                return {
                    success: false,
                    message: 'Пожалуйста, запустите бота для регистрации в акции',
                    botNotStarted: true,
                    publicationId: publication._id
                };
            } else {
                throw err; // Другая ошибка
            }
        }

        // Регистрация пользователя в акции
        slotPlace.participants.push({
            user_id: user._id,
            participation_status: 'registered'
        });

        await slotPlace.save();

        publication.available_places -= 1;
        await publication.save();

        user.participated_promotions.push({
            promotion_id: publication.promotion_id._id,
            status: 'in_progress',
            participation_date: new Date(),
            actions: {}
        });

        await user.save();

        const selectedPromotion = await Promotion.findById(publication.promotion_id);

        // Отправляем инструкцию пользователю

        await bot.telegram.sendMessage(
            userId,
            generateInstructionsPartOne(selectedPromotion),
        );
        await sendInstructionPartTwo(userId, selectedPromotion);

        return {success: true};
    } catch (error) {
        console.error('Ошибка при регистрации участия:', error);
        return {success: false, message: 'Ошибка при регистрации участия'};
    }
};

export async function POST(request) {
    await dbConnect();
    const {userId, publicationId} = await request.json();
    const result = await handleParticipation(userId, publicationId);

    if (result.success) {
        return new Response(JSON.stringify({success: true}), {status: 200});
    } else {
        return new Response(
            JSON.stringify({
                success: false,
                message: result.message,
                botNotStarted: result.botNotStarted || false,
                publicationId: result.publicationId || null
            }),
            {status: 200}
        );
    }
}
