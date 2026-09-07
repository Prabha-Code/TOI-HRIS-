const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PayrollRun = sequelize.define('PayrollRun', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false
    },
    employees: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    grossPay: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Processing', 'Paid'),
      allowNull: false,
      defaultValue: 'Draft'
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'payroll_runs'
  });

  return PayrollRun;
};
