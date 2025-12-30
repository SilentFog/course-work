import express from 'express';
import User from '../models/User.js';

const router = express.Router();


router.get('/me', async (req, res) => {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: 'Нема username' });

    try {
        const user = await User.findOne({ username }).select('-password'); 
        if (!user) return res.status(404).json({ message: 'Користувач не знайдено' });

        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,    
            username: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address,
            birthday: user.birthday
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

export default router;
