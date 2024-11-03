import mongoose from 'mongoose';

// Схема для сообщений
const MessageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ссылка на пользователя
    messageType: { type: String, required: true, enum: ['report', 'suggestion'] }, // Тип сообщения (жалоба, предложение)
    messageText: { type: String, required: true }, // Текст сообщения
    createdAt: { type: Date, default: Date.now } // Дата создания сообщения
});

// Экспорт модели
const Message = mongoose.model('Message', MessageSchema);
export default Message;
