import mongoose from 'mongoose';

// Схема для стоимости
const PricingSchema = new mongoose.Schema({
    regular_publication_price: { type: Number, required: true }, // Стоимость публикации обычная
    promotional_publication_price: { type: Number, required: true }, // Стоимость публикации акционная
    regular_slot_price: { type: Number, required: true }, // Стоимость места обычная
    promotional_slot_price: { type: Number, required: true } // Стоимость места акционная
});

export default mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);
