import mongoose from 'mongoose';

// Схема для участников слота
const SlotParticipantSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID участника (покупателя)
    participation_status: {
        type: String,
        required: true,
        enum: ['registered',
            'confirm_order',
            'confirm_pickup',
            'review_submitted',
            'screenshot_review',
            'payout_requested',
            'rejected',
            'banned',
            'finished',
        ],
        default: 'registered'
    },
    booking_date: { type: Date, default: Date.now }, // Дата бронирования
    payment_date: { type: Date } // Дата оплаты (если применимо)
});

// Схема для места в публикации
const SlotPlaceSchema = new mongoose.Schema({
    publication_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Publication', required: true }, // ID слота (расписания публикаций)
    participants: [{ type: SlotParticipantSchema }], // Массив участников данного места
});

export default mongoose.models.SlotPlace || mongoose.model('SlotPlace', SlotPlaceSchema);
