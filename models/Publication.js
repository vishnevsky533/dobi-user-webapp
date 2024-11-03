import mongoose from 'mongoose';

// Схема для публикаций
const PublicationSchema = new mongoose.Schema({
    slot_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Schedule' }, // Ссылка на расписание публикаций (слот)
    slot_status: {
        type: String,
        required: true,
        enum: ['free', 'booked', 'active', 'completed_full', 'completed_partial'],
        default: 'free'
    }, // Статус слота
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }, // ID оплаты в нашей системе
    payment_status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }, // Статус оплаты
    promotion_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Promotion' }, // ID акции в нашей системе
    slot_place_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SlotPlace' }, // ID места у публикации
    booking_date: { type: Date }, // Дата бронирования
    payment_date: { type: Date }, // Дата оплаты
    available_places: { type: Number, required: true }, // Доступно мест в акции
    total_places: { type: Number, required: true }, // Всего мест в акции
    creation_date: { type: Date, required: true, default: Date.now } // Дата создания
});

export default mongoose.models.Publication || mongoose.model('Publication', PublicationSchema);
