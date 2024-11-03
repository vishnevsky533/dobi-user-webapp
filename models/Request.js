import mongoose from 'mongoose';

// Схема для запросов
const RequestSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: ['pending', 'moderation', 'approved', 'rejected', 'reserved'], // Статус запроса
        default: 'moderation'
    }, // Статус запроса (в ожидании, одобрено, отклонено)
    request_date: { type: Date, required: true, default: Date.now }, // Дата запроса
    request_type: {
        type: String,
        required: true,
        enum: ['publication', 'promotion', 'general'] // Тип запроса (публикация, акция, общий)
    }, // Тип запроса
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID клиента
    promotion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' }, // ID акции (если применимо)
    publication_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Publication' }, // ID публикации (если применимо)
    request_data: {
        action: { type: String },//
        text: { type: String }, // Текст запроса
        images: [{
            file_id: { type: String },
            author_type: {
                type: String,
                required: true,
                enum: ['user', 'seller', 'admin'], // Кто добавил изображение нужно для генерации
                default: 'user'// ссылки тем ботом, кому принадлежит file_id
            }
        }] // Массив с изображениями
    },
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
    } // Комментарий продавца (необязательно)
});

export default mongoose.models.Request || mongoose.model('Request', RequestSchema);
