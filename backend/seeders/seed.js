const { sequelize, Customer, MenuItem, User } = require('../models');
const bcrypt = require('bcryptjs');
const models = require('../models');
const { exportAllTables } = require('../utils/tableExporter');

async function seed(){
  await sequelize.sync({ force: true });
  
  // Create default admin user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);
  await User.create({
    username: 'admin',
    password: hashedPassword,
    name: 'Admin User',
    role: 'admin'
  });

  await Customer.bulkCreate([
    { name: 'Aman', phone: '9999990001' },
    { name: 'Riya', phone: '9999990002' }
  ]);
  
  await MenuItem.bulkCreate([
    { name: 'Margherita Pizza', price: 250, category: 'Pizza' },
    { name: 'Veg Biryani', price: 180, category: 'Rice' },
    { name: 'Cold Coffee', price: 80, category: 'Beverage' }
  ]);
  
  // Export all tables to data_tables markdown files
  await exportAllTables(models);
  
  console.log('Seeded ✅ and exported to data_tables/');
  process.exit();
}
seed();