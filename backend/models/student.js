// models/Student.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Adjust path as needed

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,  // Optional email field
    validate: {
      isEmail: true,  // Ensure it's a valid email format if provided
    }
  },
  insuranceStatus: {
    type: DataTypes.ENUM('pending', 'active', 'expired'),
    defaultValue: 'pending'
  },
  lastPaymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

export default Student;
