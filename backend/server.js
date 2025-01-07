// server.js
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// ใช้ bodyParser สำหรับรับข้อมูลที่ส่งมาจาก client (JSON)
app.use(bodyParser.json());

// ใช้ CORS เพื่อให้ API สามารถเข้าถึงจากที่อื่นได้
app.use(cors());

// ใช้ router สำหรับจัดการเส้นทางเกี่ยวกับผู้ใช้
app.use('/api', userRoutes);

// เริ่มต้น server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
