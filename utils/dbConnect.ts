import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' })

export const connectToDB = async (): Promise<void> => {
    mongoose.set('strictQuery', true)

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
    }

    if (mongoose.connection.readyState >= 1) {
        console.log('Using existing MongoDB connection')
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI!, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            retryWrites: true,
            retryReads: true,
            connectTimeoutMS: 10000,
        });
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        throw error
    }
}