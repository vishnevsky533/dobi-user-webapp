import mongoose from 'mongoose';

// Схема для пользователя
const UserSchema = new mongoose.Schema({
    public_id: { type: Number, required: true }, // ID телеграмм
    nickname: { type: String}, // Ник пользователя
    first_name: { type: String },
    last_name: { type: String },
    rules_accepted: { type: Boolean, default: false }, // Поле для принятия правил
    registration_date: { type: Date, default: Date.now }, // Дата регистрации
    block_date: { type: Date }, // Дата блокировки
    is_ban: { type: Boolean , default: false }, // БАН
    participated_promotions: [{
        promotion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' }, // ID акции
        status: { type: String, enum: ['in_progress', 'completed', 'rejected'], default: 'in_progress' }, // Статус участия
        participation_date: { type: Date, default: Date.now }, // Дата начала участия
        actions: {
            confirm_order: {
                 type: mongoose.Schema.Types.ObjectId, ref: 'Request',
            },
            confirm_pickup: { type: mongoose.Schema.Types.ObjectId, ref: 'Request'}, // Подтвержден ли забор товара
            review_submitted: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' }, // Отправлен ли отзыв
            screenshot_review: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' }, //отправлен ли скриншот отзыва
            payout_requested: { type: mongoose.Schema.Types.ObjectId, ref: 'Payout' } // Запрошена ли выплата
        },
    }]
});

// Экспорт модели
export default mongoose.models.User || mongoose.model('User', UserSchema);

