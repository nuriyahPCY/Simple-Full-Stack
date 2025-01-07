// models/userModel.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../database/database');

// ฟังก์ชันสำหรับรับข้อมูลผู้ใช้ทั้งหมด
const getUsers = async () => {
    return await User.findAll();
};

// ฟังก์ชันสำหรับรับข้อมูลผู้ใช้ตาม ID
const getUserById = async (id) => {
    return await User.findByPk(id);
};

// ฟังก์ชันสำหรับสร้างผู้ใช้ใหม่
const createUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10); // เข้ารหัสรหัสผ่าน
    const newUser = await User.create({
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        password: hashedPassword,
        is_active: true,
    });
    return newUser;
};

// ฟังก์ชันสำหรับแก้ไขข้อมูลผู้ใช้
const editUser = async (id, userData) => {
    const user = await User.findByPk(id);
    if (!user) {
        return null;
    }

    await user.update(userData);
    return user;
};

// ฟังก์ชันสำหรับลบผู้ใช้
const deleteUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        return null;
    }

    await user.destroy();
    return user;
};

// ฟังก์ชันสำหรับเข้าสู่ระบบ (Login)

const loginUser = async (username, password) => {
    const user = await User.findOne({ where: { username } });

    if (!user) {
        throw new Error('ไม่พบผู้ใช้');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('รหัสผ่านไม่ถูกต้อง');
    }

    const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET, // ใช้ค่า JWT_SECRET ที่เก็บใน .env
        { expiresIn: '1h' }
    );

    return { user, token };
};

module.exports = { getUsers, getUserById, createUser, editUser, deleteUser, loginUser };
