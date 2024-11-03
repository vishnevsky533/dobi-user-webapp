import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, // Название категории
    message_thread_id: {
        type: String,
        required: true
    } // ID темы в группе где будет публиковаться сообщение
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);