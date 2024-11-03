import mongoose from 'mongoose';

// Схема для истории пополнений
const ReplenishmentHistorySchema = new mongoose.Schema({
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }, // ID селлера
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed'], // Статус пополнения
        default: 'pending'
    }, // Статус пополнения (в ожидании, завершено, неудачно)
    payment_method: {
        type: String,
        required: true,
        enum: ['bank_transfer', 'card', 'e_wallet'], // Метод пополнения
    }, // Метод пополнения (например, банковский перевод, карта, электронный кошелек)
    replenishment_date: { type: Date, required: true, default: Date.now }, // Дата пополнения
    amount: { type: Number, required: true } // Сумма пополнения
});

export default mongoose.models.ReplenishmentHistory || mongoose.model('ReplenishmentHistory', ReplenishmentHistorySchema);
