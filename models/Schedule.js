import mongoose from 'mongoose';

// Схема для расписания публикаций Расписание слотов для публикаций.
// 8:00 8:15 8:30 8:45 9:00 9:15 9:30 9:45 и так далее до 21:00 21:15 21:30 21:45 Всего получается 56 слотов.
// Каждый день.
const ScheduleSchema = new mongoose.Schema({
    publication_date: { type: Date, required: true }, // Дата публикации и время публикации
    slot_publication_status: {
        type: String,
        required: true,
        enum: ['free', 'booked', 'pending', 'active', 'completed_full', 'completed_partial'],
        default: 'free'
    }, // Статус слота (свободный, занят, активная, завершена полностью, завершена частично)
    expire_at: {
        type: Date,
        default: null
    } // Время жизни
});

export default mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);
