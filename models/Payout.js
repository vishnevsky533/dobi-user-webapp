import mongoose from 'mongoose';

const PayoutSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'rejected'], // Статус выплаты
        default: 'pending'
    }, // Статус выплаты (в ожидании, завершено, отклонено)
    request_text: { type: String, required: true }, // Текст запроса выплаты
    promotion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion', required: true }, // ID акции, связанной с выплатой/ Ссылка на картинку выплаты (например, подтверждение)
    creation_date: { type: Date, default: Date.now }, // Дата создания запроса выплаты
    seller_comment: {
        seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
        text: { type: String }, // Текст комментария
        image: { type: String }, // Фото комментария
        author_type: {
            type: String,
            required: true,
            enum: ['user', 'seller', 'admin'], // Кто добавил изображение нужно для генерации
            default: 'user'// ссылки тем ботом, кому принадлежит file_id
        }
    }, // Комментарий продавца (необязательно)
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID клиента
    payout_amount: { type: Number } // Сумма выплаты
});

export default mongoose.models.Payout || mongoose.model('Payout', PayoutSchema);
