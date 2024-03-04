import mongoose from "mongoose";
const schema = mongoose.Schema;

const UserSchema = new schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    transactionPin: {
        type: Number,
    },
    pinCode: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['beginner', 'sapphire', 'silicon', 'classical', 'emerald', 'elite', 'royalty', 'excel'],
        default: 'beginner'
    },
    referredBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    generatedPins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pins",
        },
    ],
    isAdmin: {
        type: Boolean,
        default: false,
    },
    bankDetails: {
        accountNumber: { type: String },
        accountName: { type: String },
        bankName: { type: String },
    },
    personalDetails: {
        firstName: { type: String },
        lastName: { type: String },
        gender: { type: String },
        phoneNumber: { type: String },
        country: { type: String },
        city: { type: String },
        address: { type: String },
        dateOfBirth: { type: Date },
    }
},
    {
        timestamps: true
    }
)

const User = mongoose.model("User", UserSchema);
export default User;