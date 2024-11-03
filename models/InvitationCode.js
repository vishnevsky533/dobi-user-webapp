import mongoose from 'mongoose';

// Схема для кодов приглашений
const InvitationCodeSchema = new mongoose.Schema({
    invitation_code: { type: String, required: true, unique: true }, // Код приглашения (уникальный)
    creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }, // ID создателя приглашения (ссылка на селлера)
    invited_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }, // ID приглашенного (может быть пустым, пока не используется)
    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'expired'], // Статус приглашения
        default: 'pending'
    }, // Статус (в ожидании, принято, истекло)
    creation_date: { type: Date, required: true, default: Date.now } // Дата создания
});

export default mongoose.models.InvitationCode || mongoose.model('InvitationCode', InvitationCodeSchema);
