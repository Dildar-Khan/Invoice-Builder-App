import mongoose from 'mongoose';
// import bcryptjs from 'bcryptjs';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    local: {
        name: String,
        email: String,
        password: String,
    },
    // email: { type: String, required: true, lowercase: true, unique: true },
    // password: { type: String, required: true },
    google: {
        email: String,
        id: String,
        displayName: String,
        token: String,
    },
    twitter: {
        username: String,
        id: String,
        token: String,
        displayName: String,
    },
    github: {
        email: String,
        id: String,
        displayName: String,
        token: String,
    },
});
// UserSchema.pre('save', async function() {
//     if (this.isModified('password') || this.isNew) {
//         const salt = await bcryptjs.genSalt();
//         const hash = await bcryptjs.hash(this.password, salt);
//         this.password = hash;
//     }
// });
export default mongoose.model('User', UserSchema);
