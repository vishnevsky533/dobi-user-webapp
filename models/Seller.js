import mongoose from 'mongoose';

// Схема для статистики
const StatisticsSchema = new mongoose.Schema({
    completed: { type: Number }, // Количество выполненных задач
    clients: { type: Number }, // Количество клиентов
    cost: { type: Number } // Общая стоимость
});

// Схема для продавца
const SellerSchema = new mongoose.Schema({
    public_id: { type: Number, required: true }, // Телеграм айди
    nickname: { type: String, required: true }, // Ник продавца
    first_name: { type: String },
    last_name: { type: String },
    balance: { type: Number, required: true, default: 0 }, // Баланс
    registration_date: { type: Date, default: Date.now }, // Дата регистрации
    block_date: { type: Date }, // Дата блокировки
    statistics: { type: StatisticsSchema }, // Статистика продавца
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }], // Ссылка на команды
    is_ban: { type: Boolean, default: false }, // Флаг бана
    rules_accepted: { type: Boolean, default: false }, // По умолчанию правила еще не приняты
    invite_code_applied: { type: Boolean, default: false }, // Инвайт-код применен
});

// Экспорт модели продавца
export default mongoose.models.Seller || mongoose.model('Seller', SellerSchema);