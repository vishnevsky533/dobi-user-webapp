import mongoose from 'mongoose';

// Схема для акции (Promotion)
const PromotionSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected', 'in_progress', 'paused', 'completed', 'archived'],
        default: 'pending',
    }, // Статус модерации
    seller_id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Seller'}, // ID селлера создателя
    team_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'}, // ID команды создателя
    action_name: {type: String, required: true}, // Имя акции
    market_name: {type: String, required: true}, // Маркетплейс
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'}, // Категория
    product_name: {type: String, required: true}, // Имя товара
    regular_price: {type: Number, required: true}, // Обычная цена товара
    review_points: {type: Number, required: true}, // Баллы за отзыв
    cashback: {type: Number, required: true}, // Процент кешбека
    client_price: {type: Number}, // Цена для клиента (рассчитывается системой)
    client_payout: {type: Number}, // Выплата клиенту (рассчитывается системой)
    search_query: {type: String}, // Поисковый запрос для продукта
    screenshot_link: {type: String}, // Ссылка на скриншот инструкции
    publication_image: {type: String}, // Картинка для публикации акции
    creation_date: { type: Date, required: true, default: Date.now } // Дата создания
});

export default mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);
