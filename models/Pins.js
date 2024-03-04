import mongoose from "mongoose";
const schema = mongoose.Schema;

const PinsSchema = new schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pinStatus: {
        type: String,
        enum: ['used','unused'],
        default: 'unused'
    },
    pinCode:{
        type: String,
        required: true, 
        unique: true 
    }
},
    {
        timestamps: true
    }
)

const Pins = mongoose.model("Pins", PinsSchema);
export default Pins;