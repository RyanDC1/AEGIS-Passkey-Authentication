import { User } from "@/models";
import mongoose from "mongoose";

const modelName = 'User'

mongoose.set('strictQuery', true)

interface UserSchema extends Partial<User> {
    normalizedUsername: string,
    expiresAt: Date
}

const user = new mongoose.Schema<UserSchema>({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: [4, 'Username should be at least 4 characters long']
    },
    normalizedUsername: {
        type: String,
        required: true,
        unique: true,
        minLength: [4, 'Username should be at least 4 characters long']
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    passkeys: {
        type: Array,
        required: false,
        default: []
    }
})

user.set('toJSON', {
    versionKey: false,
    virtuals: true,
    transform: (doc, prop) => {
        prop.id = prop._id.toString()
        delete prop._id
        delete prop.__v
        return prop
    }
})

export default (mongoose.models?.[modelName] as mongoose.Model<User> || mongoose.model(modelName, user))