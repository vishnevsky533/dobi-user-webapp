import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const AdminSchema = new mongoose.Schema({
    public_id: {type: Number, required: true}, // ID телеграмм
    nickname: {type: String}, // Ник пользователя
    first_name: {type: String},
    last_name: {type: String},
    rules_accepted: {type: Boolean, default: false}, // Поле для принятия правил
    registration_date: {type: Date, default: Date.now}, // Дата регистрации
    block_date: {type: Date}, // Дата блокировки
    is_ban: {type: Boolean, default: false}, // БАН
    password: {type: String, required: true},
    invite_code_applied: { type: Boolean, default: false },
    role: {type: String, enum: ['manager', 'admin'], required: true}
});

AdminSchema.pre('save', async function (next) {
    const admin = this;

    if (!admin.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

AdminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
