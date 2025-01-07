// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, editUser, deleteUser, loginUser } = require('../models/userModel');

// รับข้อมูลผู้ใช้ทั้งหมด
router.get('/users', async (req, res) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลผู้ใช้ได้' });
    }
});

// รับข้อมูลผู้ใช้ตาม ID
router.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await getUserById(Number(id));

    if (!user) {
        return res.status(404).json({ error: 'ไม่พบผู้ใช้ที่มี ID นี้' });
    }

    res.json(user);
});

// เพิ่มผู้ใช้ใหม่
router.post('/users', async (req, res) => {
    const { username, email, first_name, last_name, password } = req.body;

    if (!username || !email || !first_name || !last_name || !password) {
        return res.status(400).json({ error: 'กรุณากรอกข้อมูลที่จำเป็น' });
    }

    try {
        const newUser = await createUser({ username, email, first_name, last_name, password });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'ไม่สามารถสร้างผู้ใช้ได้', details: err.message });
    }
});

// แก้ไขข้อมูลผู้ใช้
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, first_name, last_name, password } = req.body;

    try {
        const updatedUser = await editUser(Number(id), { username, email, first_name, last_name, password });

        if (!updatedUser) {
            return res.status(404).json({ error: 'ไม่พบผู้ใช้ที่มี ID นี้' });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: 'ไม่สามารถแก้ไขข้อมูลผู้ใช้ได้' });
    }
});

// ลบผู้ใช้
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const deletedUser = await deleteUser(Number(id));

    if (!deletedUser) {
        return res.status(404).json({ error: 'ไม่พบผู้ใช้ที่มี ID นี้' });
    }

    res.json({ message: 'ลบผู้ใช้สำเร็จ', deletedUser });
});

// เส้นทางสำหรับ Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
    }

    try {
        const { user, token } = await loginUser(username, password);
        res.json({
            message: 'เข้าสู่ระบบสำเร็จ',
            user,
            token
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
