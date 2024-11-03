import mongoose from 'mongoose';

const BotSettingsSchema = new mongoose.Schema({
    invitation_code_enabled: { type: Boolean, default: true },
    // Добавьте другие настройки, если необходимо
});

export default mongoose.models.BotSettings || mongoose.model('BotSettings', BotSettingsSchema);
