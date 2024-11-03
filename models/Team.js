import mongoose from 'mongoose';

// Схема для команды
const TeamSchema = new mongoose.Schema({
    name: {type: String, required: true}, // Имя команды
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Seller'}, // ID селлера владельца команды
    balance: {type: Number, default: 0, required: true}, // Баланс команды
    sellers: [{
        seller_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Seller'},
        role: {type: String, enum: ['admin', 'author', 'manager'], default: 'manager'},
    }] // Массив продавцов команды
});

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);
