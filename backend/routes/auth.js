import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();


router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, username, password, email, phone } = req.body;

        if (!firstName || !lastName || !username || !password || !email) {
            return res.status(400).json({ message: 'Заповніть всі обовязкові поля' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач вже існує' });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ firstName, lastName, username, password: hashedPassword, email, phone });
        await newUser.save();

        res.status(201).json({ message: 'Користувач створено' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Помилка сервера', error: err.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Введіть логін та пароль' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Користувач не знайдено' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Невірний пароль' });
        }

        res.status(200).json({ message: 'Вхід виконано', user: { username: user.username, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Помилка сервера', error: err.message });
    }
});

export default router;
