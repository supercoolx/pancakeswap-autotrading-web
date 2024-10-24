import mongoose from "mongoose";

// Define the Follow schema
const ConfigSchema = new mongoose.Schema({
    walletCount: { type: Number, default: 5 },
    txFee: { type: Number, default: 0.02 },
    minBNB: { type: Number, default: 0.3 },
    maxBNB: { type: Number, default: 0.5 },
    minToken: { type: Number, default: 5000 },
    maxToken: { type: Number, default: 10000 },
    intervalMin: { type: Number, default: 2 },
    intervalMax: { type: Number, default: 5 },
    bnbLimit: { type: Number, default: 0 },
    tokenLimit: { type: Number, default: 0 }
});

ConfigSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret._id;  // Remove _id field
        delete ret.__v;  // Remove __v field
        return ret;      // Return modified object
    }
});

export interface ConfigType {
    walletCount: number
    txFee: number
    minBNB: number
    maxBNB: number
    minToken: number
    maxToken: number
    intervalMin: number
    intervalMax: number
    bnbLimit: number
    tokenLimit: number
}

const Config = mongoose.model('config', ConfigSchema);
export default Config;