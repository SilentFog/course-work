import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Указываем путь к файлу относительно server.js
dotenv.config({ path: './secret.env' }); // <-- именно так

import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// Проверка, что dotenv подхватил переменную
console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
