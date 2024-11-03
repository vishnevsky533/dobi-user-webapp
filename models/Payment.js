import mongoose from 'mongoose';

// Схема для оплаты
const PaymentSchema = new mongoose.Schema({
    payment_date: { type: Date, required: true, default: Date.now }, // Дата оплаты
    amount: { type: Number, required: true }, // Сумма оплаты
    promotion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion', required: true }, // ID акции
    publication_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Publication', required: true }, // ID публикации
    purpose: {
        type: String,
        required: true,
        enum: ['publication_payment', 'slot_payment'], // Назначение оплаты: публикация или место
        default: 'publication_payment'
    } // Назначение (оплата публикации или оплата места)
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
