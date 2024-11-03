import mongoose from 'mongoose';

const AdminInvitationCodeSchema = new mongoose.Schema({
    invitation_code: { type: String, required: true, unique: true },
    creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    invited_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    status: { type: String, required: true, enum: ['pending', 'accepted', 'expired'], default: 'pending' },
    creation_date: { type: Date, required: true, default: Date.now },
    role: {type: String, enum: ['manager', 'admin'], required: true}
});

export default mongoose.models.AdminInvitationCode || mongoose.model('AdminInvitationCode', AdminInvitationCodeSchema);
