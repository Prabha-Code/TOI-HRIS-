const path = require('path');
const { Sequelize } = require('sequelize');

const dialect = process.env.DB_DIALECT || 'sqlite';
const commonOptions = {
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
  }
};

const sequelize = dialect === 'postgres'
  ? new Sequelize({
      ...commonOptions,
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || 'peopleos',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres'
    })
  : new Sequelize({
      ...commonOptions,
      dialect: 'sqlite',
      storage: process.env.SQLITE_STORAGE || path.join(__dirname, '..', 'peopleos.db')
    });

const User = require('./User')(sequelize);
const Leave = require('./Leave')(sequelize);
const PayrollRun = require('./PayrollRun')(sequelize);

User.hasMany(Leave, { foreignKey: 'employeeId', as: 'leaves' });
Leave.belongsTo(User, { foreignKey: 'employeeId', as: 'employee' });

User.hasMany(Leave, { foreignKey: 'approverId', as: 'approved_leaves' });
Leave.belongsTo(User, { foreignKey: 'approverId', as: 'approver' });

const seedDemoAccounts = async () => {
  try {
    const bcryptjs = require('bcryptjs');
    const demoPassword = 'password123';

    const ensureDemoPassword = async (user, label) => {
      if (!user) {
        return;
      }

      const passwordMatches = await bcryptjs.compare(demoPassword, user.password);
      if (!passwordMatches) {
        user.password = demoPassword;
        await user.save();
        console.log(`Demo ${label} password reset`);
      }
    };

    const demoUsers = [
      {
        name: 'Jane Manager',
        email: 'manager@example.com',
        password: demoPassword,
        role: 'manager',
        department: 'Engineering',
        title: 'Engineering Manager',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        leaveBalance: { annual: 30, sick: 10, personal: 5 }
      },
      {
        name: 'Sarah HR',
        email: 'hr@example.com',
        password: demoPassword,
        role: 'hr',
        department: 'People Operations',
        title: 'HR Director',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        leaveBalance: { annual: 30, sick: 10, personal: 5 }
      },
      {
        name: 'John Employee',
        email: 'employee@example.com',
        password: demoPassword,
        role: 'employee',
        department: 'Engineering',
        title: 'Senior Product Designer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        leaveBalance: { annual: 30, sick: 10, personal: 5 }
      },
      {
        name: 'Asha Product',
        email: 'asha@example.com',
        password: demoPassword,
        role: 'employee',
        department: 'Product',
        title: 'Software Engineer',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        leaveBalance: { annual: 30, sick: 10, personal: 5 }
      },
      {
        name: 'Rahul Design',
        email: 'rahul@example.com',
        password: demoPassword,
        role: 'employee',
        department: 'Design',
        title: 'QA Engineer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        leaveBalance: { annual: 30, sick: 10, personal: 5 }
      }
    ];

    for (const demoUser of demoUsers) {
      const [user, created] = await User.findOrCreate({
        where: { email: demoUser.email },
        defaults: demoUser
      });

      if (!created) {
        await user.update({
          name: demoUser.name,
          role: demoUser.role,
          department: demoUser.department,
          title: demoUser.title,
          avatar: demoUser.avatar
        });
      }

      await ensureDemoPassword(user, demoUser.role);

      if (created) {
        console.log(`Demo ${demoUser.role} account created`);
      }
    }

    const manager = await User.findOne({ where: { email: 'manager@example.com' } });
    if (manager) {
      await User.update(
        { managerId: manager.id },
        { where: { email: ['employee@example.com', 'asha@example.com', 'rahul@example.com'] } }
      );
    }

    const payrollSeeds = [
      { month: 'August 2026', employees: 5, grossPay: 4900000, status: 'Processing', dueDate: '2026-08-28' },
      { month: 'July 2026', employees: 5, grossPay: 4720000, status: 'Paid', dueDate: '2026-07-28' }
    ];

    for (const run of payrollSeeds) {
      await PayrollRun.findOrCreate({
        where: { month: run.month },
        defaults: run
      });
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(`${dialect === 'postgres' ? 'PostgreSQL' : 'SQLite'} database connected`);

    if (dialect === 'sqlite') {
      await sequelize.query('DROP TABLE IF EXISTS `users_backup`;');
      await sequelize.query('DROP TABLE IF EXISTS `leaves_backup`;');
      await sequelize.query('DROP TABLE IF EXISTS `payroll_runs_backup`;');
    }

    await sequelize.sync(dialect === 'postgres' ? { alter: true } : {});
    console.log('Database synchronized');

    await seedDemoAccounts();

    return true;
  } catch (error) {
    console.error('Database sync error:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  User,
  Leave,
  PayrollRun,
  syncDatabase
};
