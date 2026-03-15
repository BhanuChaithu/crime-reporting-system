const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const CrimeReport = sequelize.define('CrimeReport', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    evidence: {
        type: DataTypes.STRING // Path
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Under Investigation', 'Closed'),
        defaultValue: 'Pending'
    },
    remarks: {
        type: DataTypes.TEXT
    },
    trackingId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true // Allow null for existing records, though we should ideally populate them
    }
}, {
    timestamps: true
});

// Relationships
CrimeReport.belongsTo(User, { as: 'reporter', foreignKey: 'reporterId' });
CrimeReport.belongsTo(User, { as: 'assignedOfficer', foreignKey: 'assignedToId' });
User.hasMany(CrimeReport, { foreignKey: 'reporterId' });
User.hasMany(CrimeReport, { foreignKey: 'assignedToId' });

module.exports = CrimeReport;
