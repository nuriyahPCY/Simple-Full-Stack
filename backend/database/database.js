// database.js
const { Sequelize, DataTypes } = require('sequelize');


// สร้างการเชื่อมต่อกับฐานข้อมูล SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // ที่เก็บไฟล์ฐานข้อมูล
});

// กำหนดโมเดล User
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING,
    },
    last_name: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    date_joined: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
});

// ซิงค์โมเดลกับฐานข้อมูล
sequelize.sync()
    .then(() => {
        console.log("ตาราง Users ถูกสร้างเรียบร้อยแล้ว");
    })
    .catch(err => {
        console.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล:', err);
    });

module.exports = { User };
