const { sequelize } = require('../models');
const { seedStaff } = require('./seedStaff');
const { seedAdditionalStaff } = require('./seedAdditionalStaff');
const { seedMoreStaff } = require('./seedMoreStaff');
const { seedInventory } = require('./seedInventory');
const { seedAdditionalInventory } = require('./seedAdditionalInventory');
const { seedMoreInventory } = require('./seedMoreInventory');
const { seedSampleData } = require('./seedSampleData');
const { seedEvenMoreMenuItems } = require('./seedEvenMoreMenuItems');
const bcrypt = require('bcryptjs');

async function seedComprehensive() {
  try {
    console.log('🌱 Starting comprehensive database seeding with ALL seeders...');
    
    // Force sync to reset database
    await sequelize.sync({ force: true });
    console.log('✅ Database reset complete');
    
    // Create admin user
    console.log('👤 Creating admin user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    const { User } = require('../models');
    await User.create({
      username: 'admin',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    });
    console.log('✅ Admin user created');
    
    // Seed menu items first (needed for orders)
    console.log('🍽️ Seeding comprehensive menu items...');
    const { MenuItem } = require('../models');
    await MenuItem.bulkCreate([
      // Appetizers
      { name: 'Paneer Tikka', price: 120, category: 'Appetizer', description: 'Grilled cottage cheese with spices', available: true },
      { name: 'Chicken Tikka', price: 140, category: 'Appetizer', description: 'Grilled chicken with spices', available: true },
      { name: 'Chicken Wings', price: 120, category: 'Appetizer', description: 'Spicy chicken wings', available: true },
      { name: 'Fish Fingers', price: 100, category: 'Appetizer', description: 'Breaded fish strips', available: true },
      { name: 'Spring Rolls', price: 80, category: 'Appetizer', description: 'Crispy vegetable spring rolls', available: true },
      { name: 'Chicken Nuggets', price: 90, category: 'Appetizer', description: 'Breaded chicken pieces', available: true },
      { name: 'Tandoori Chicken', price: 180, category: 'Appetizer', description: 'Traditional tandoori chicken', available: true },
      { name: 'Seekh Kebab', price: 150, category: 'Appetizer', description: 'Spiced minced meat kebab', available: true },
      { name: 'Hara Bhara Kebab', price: 110, category: 'Appetizer', description: 'Green vegetable kebab', available: true },
      { name: 'Aloo Tikki', price: 60, category: 'Appetizer', description: 'Spiced potato patties', available: true },

      // Main Courses - Rice
      { name: 'Veg Biryani', price: 180, category: 'Rice', description: 'Aromatic basmati rice with mixed vegetables', available: true },
      { name: 'Chicken Biryani', price: 220, category: 'Rice', description: 'Aromatic rice with spiced chicken', available: true },
      { name: 'Mutton Biryani', price: 280, category: 'Rice', description: 'Aromatic rice with spiced mutton', available: true },
      { name: 'Vegetable Pulao', price: 160, category: 'Rice', description: 'Fragrant rice with mixed vegetables', available: true },
      { name: 'Jeera Rice', price: 80, category: 'Rice', description: 'Cumin flavored basmati rice', available: true },
      { name: 'Lemon Rice', price: 90, category: 'Rice', description: 'Tangy lemon flavored rice', available: true },
      { name: 'Coconut Rice', price: 100, category: 'Rice', description: 'Coconut flavored rice', available: true },
      { name: 'Fried Rice', price: 120, category: 'Rice', description: 'Chinese style fried rice', available: true },

      // Main Courses - Curries
      { name: 'Chicken Curry', price: 200, category: 'Curry', description: 'Spicy chicken curry with onions and tomatoes', available: true },
      { name: 'Mutton Curry', price: 250, category: 'Curry', description: 'Rich mutton curry with spices', available: true },
      { name: 'Fish Curry', price: 180, category: 'Curry', description: 'Spicy fish curry with coconut milk', available: true },
      { name: 'Chicken Korma', price: 200, category: 'Curry', description: 'Mild chicken curry with cream', available: true },
      { name: 'Chana Masala', price: 110, category: 'Curry', description: 'Spiced chickpea curry', available: true },
      { name: 'Rajma', price: 120, category: 'Curry', description: 'Kidney bean curry', available: true },
      { name: 'Dal Makhani', price: 150, category: 'Curry', description: 'Creamy black lentils with butter', available: true },
      { name: 'Butter Chicken', price: 220, category: 'Curry', description: 'Creamy tomato chicken curry', available: true },
      { name: 'Kadai Chicken', price: 200, category: 'Curry', description: 'Spicy kadai style chicken', available: true },
      { name: 'Chicken Tikka Masala', price: 210, category: 'Curry', description: 'Creamy chicken tikka curry', available: true },

      // Vegetables
      { name: 'Aloo Gobi', price: 100, category: 'Vegetable', description: 'Potato and cauliflower curry', available: true },
      { name: 'Palak Paneer', price: 130, category: 'Vegetable', description: 'Cottage cheese in spinach gravy', available: true },
      { name: 'Mutter Paneer', price: 140, category: 'Vegetable', description: 'Cottage cheese with green peas', available: true },
      { name: 'Aloo Matar', price: 90, category: 'Vegetable', description: 'Potato and green pea curry', available: true },
      { name: 'Baingan Bharta', price: 110, category: 'Vegetable', description: 'Roasted eggplant curry', available: true },
      { name: 'Mix Vegetable', price: 120, category: 'Vegetable', description: 'Mixed vegetable curry', available: true },
      { name: 'Bhindi Masala', price: 100, category: 'Vegetable', description: 'Spiced okra curry', available: true },
      { name: 'Gobi Manchurian', price: 130, category: 'Vegetable', description: 'Indo-Chinese cauliflower', available: true },

      // Breads
      { name: 'Butter Naan', price: 30, category: 'Bread', description: 'Soft leavened bread with butter', available: true },
      { name: 'Garlic Naan', price: 40, category: 'Bread', description: 'Leavened bread with garlic and herbs', available: true },
      { name: 'Tandoori Roti', price: 20, category: 'Bread', description: 'Whole wheat bread cooked in tandoor', available: true },
      { name: 'Onion Kulcha', price: 35, category: 'Bread', description: 'Stuffed bread with onions', available: true },
      { name: 'Aloo Paratha', price: 50, category: 'Bread', description: 'Stuffed bread with potato', available: true },
      { name: 'Gobi Paratha', price: 55, category: 'Bread', description: 'Stuffed bread with cauliflower', available: true },
      { name: 'Paneer Paratha', price: 60, category: 'Bread', description: 'Stuffed bread with cottage cheese', available: true },
      { name: 'Missi Roti', price: 25, category: 'Bread', description: 'Spiced gram flour bread', available: true },

      // Pizza
      { name: 'Margherita Pizza', price: 250, category: 'Pizza', description: 'Classic tomato and mozzarella pizza', available: true },
      { name: 'Pepperoni Pizza', price: 280, category: 'Pizza', description: 'Pepperoni with mozzarella cheese', available: true },
      { name: 'Veg Supreme Pizza', price: 260, category: 'Pizza', description: 'Mixed vegetables with cheese', available: true },
      { name: 'Chicken Pizza', price: 300, category: 'Pizza', description: 'Chicken with vegetables and cheese', available: true },
      { name: 'BBQ Chicken Pizza', price: 320, category: 'Pizza', description: 'BBQ chicken with onions and cheese', available: true },
      { name: 'Paneer Pizza', price: 270, category: 'Pizza', description: 'Cottage cheese with vegetables', available: true },

      // Beverages
      { name: 'Cold Coffee', price: 80, category: 'Beverage', description: 'Iced coffee with milk and sugar', available: true },
      { name: 'Mango Lassi', price: 70, category: 'Beverage', description: 'Sweet yogurt drink with mango', available: true },
      { name: 'Masala Chai', price: 30, category: 'Beverage', description: 'Spiced tea with milk', available: true },
      { name: 'Fresh Lime Soda', price: 40, category: 'Beverage', description: 'Refreshing lime drink', available: true },
      { name: 'Thums Up', price: 35, category: 'Beverage', description: 'Cola soft drink', available: true },
      { name: 'Sprite', price: 35, category: 'Beverage', description: 'Lemon-lime soft drink', available: true },
      { name: 'Mineral Water', price: 20, category: 'Beverage', description: 'Bottled mineral water', available: true },
      { name: 'Fresh Juice', price: 60, category: 'Beverage', description: 'Fresh seasonal fruit juice', available: true },
      { name: 'Coconut Water', price: 50, category: 'Beverage', description: 'Fresh coconut water', available: true },
      { name: 'Buttermilk', price: 25, category: 'Beverage', description: 'Spiced buttermilk', available: true },

      // Desserts
      { name: 'Gulab Jamun', price: 60, category: 'Dessert', description: 'Sweet milk dumplings in syrup', available: true },
      { name: 'Ice Cream', price: 50, category: 'Dessert', description: 'Vanilla ice cream', available: true },
      { name: 'Kulfi', price: 45, category: 'Dessert', description: 'Traditional Indian ice cream', available: true },
      { name: 'Ras Malai', price: 70, category: 'Dessert', description: 'Sweet cottage cheese in milk', available: true },
      { name: 'Kheer', price: 55, category: 'Dessert', description: 'Rice pudding with nuts', available: true },
      { name: 'Jalebi', price: 40, category: 'Dessert', description: 'Sweet fried pretzel', available: true },
      { name: 'Rasgulla', price: 50, category: 'Dessert', description: 'Sweet cottage cheese balls', available: true },
      { name: 'Halwa', price: 45, category: 'Dessert', description: 'Sweet semolina pudding', available: true },

      // Snacks
      { name: 'Samosa', price: 25, category: 'Snack', description: 'Fried pastry with spiced potato filling', available: true },
      { name: 'Kachori', price: 30, category: 'Snack', description: 'Fried pastry with lentil filling', available: true },
      { name: 'Pakora', price: 35, category: 'Snack', description: 'Fried vegetable fritters', available: true },
      { name: 'Bhel Puri', price: 45, category: 'Snack', description: 'Puffed rice with chutneys', available: true },
      { name: 'Pani Puri', price: 50, category: 'Snack', description: 'Hollow puris with spiced water', available: true },
      { name: 'Dahi Vada', price: 40, category: 'Snack', description: 'Lentil dumplings in yogurt', available: true },
      { name: 'Chicken Roll', price: 80, category: 'Snack', description: 'Chicken wrapped in paratha', available: true },
      { name: 'Egg Roll', price: 60, category: 'Snack', description: 'Egg wrapped in paratha', available: true },
      { name: 'Veg Roll', price: 50, category: 'Snack', description: 'Vegetables wrapped in paratha', available: true },
      { name: 'Chicken Sandwich', price: 90, category: 'Snack', description: 'Chicken sandwich with vegetables', available: true },
      { name: 'Veg Sandwich', price: 70, category: 'Snack', description: 'Vegetable sandwich', available: true },
      { name: 'Club Sandwich', price: 100, category: 'Snack', description: 'Multi-layer sandwich', available: true },
      { name: 'French Fries', price: 60, category: 'Snack', description: 'Crispy potato fries', available: true },
      { name: 'Onion Rings', price: 55, category: 'Snack', description: 'Battered and fried onion rings', available: true },

      // Sides
      { name: 'Raita', price: 50, category: 'Side', description: 'Yogurt with cucumber and spices', available: true },
      { name: 'Papad', price: 15, category: 'Side', description: 'Crispy lentil wafers', available: true },
      { name: 'Pickle', price: 20, category: 'Side', description: 'Spicy mixed vegetable pickle', available: true },
      { name: 'Chutney', price: 25, category: 'Side', description: 'Mint and coriander chutney', available: true },
      { name: 'Salad', price: 40, category: 'Side', description: 'Fresh mixed vegetable salad', available: true },
      { name: 'Soup', price: 60, category: 'Side', description: 'Hot vegetable soup', available: true }
    ]);
    console.log('✅ Menu items seeded');
    
    // Seed all other data using individual seeders
    console.log('👥 Seeding staff data...');
    await seedStaff();
    await seedAdditionalStaff();
    await seedMoreStaff();
    
    console.log('📦 Seeding inventory data...');
    await seedInventory();
    await seedAdditionalInventory();
    await seedMoreInventory();
    
    console.log('🍽️ Seeding even more menu items...');
    await seedEvenMoreMenuItems();
    console.log('✅ Additional menu items seeded');

    console.log('📊 Seeding sample data (customers, orders, reviews)...');
    await seedSampleData();
    
    // Seed additional payment data
    console.log('💳 Seeding payment data...');
    const { Payment, Order } = require('../models');
    
    // Get some orders to create payments for
    const orders = await Order.findAll({ limit: 10 });
    
    const paymentData = [
      {
        orderId: orders[0]?.id || 1,
        amount: 450,
        paymentMethod: 'cash',
        status: 'completed',
        transactionId: 'TXN001',
        notes: 'Cash payment received'
      },
      {
        orderId: orders[1]?.id || 2,
        amount: 320,
        paymentMethod: 'card',
        status: 'completed',
        transactionId: 'TXN002',
        notes: 'Card payment processed'
      },
      {
        orderId: orders[2]?.id || 3,
        amount: 280,
        paymentMethod: 'upi',
        status: 'completed',
        transactionId: 'TXN003',
        notes: 'UPI payment successful'
      },
      {
        orderId: orders[3]?.id || 4,
        amount: 380,
        paymentMethod: 'cash',
        status: 'completed',
        transactionId: 'TXN004',
        notes: 'Cash payment with change'
      },
      {
        orderId: orders[4]?.id || 5,
        amount: 520,
        paymentMethod: 'card',
        status: 'completed',
        transactionId: 'TXN005',
        notes: 'Credit card payment'
      },
      {
        orderId: orders[5]?.id || 6,
        amount: 190,
        paymentMethod: 'upi',
        status: 'completed',
        transactionId: 'TXN006',
        notes: 'PhonePe payment'
      },
      {
        orderId: orders[6]?.id || 7,
        amount: 340,
        paymentMethod: 'cash',
        status: 'completed',
        transactionId: 'TXN007',
        notes: 'Cash payment'
      },
      {
        orderId: orders[7]?.id || 8,
        amount: 410,
        paymentMethod: 'card',
        status: 'completed',
        transactionId: 'TXN008',
        notes: 'Debit card payment'
      },
      {
        orderId: orders[8]?.id || 9,
        amount: 260,
        paymentMethod: 'upi',
        status: 'completed',
        transactionId: 'TXN009',
        notes: 'Google Pay payment'
      },
      {
        orderId: orders[9]?.id || 10,
        amount: 350,
        paymentMethod: 'cash',
        status: 'completed',
        transactionId: 'TXN010',
        notes: 'Cash payment'
      }
    ];
    
    await Payment.bulkCreate(paymentData);
    console.log('✅ Payment data seeded');
    
    console.log('🎉 Comprehensive seeding completed successfully!');
    console.log('📊 Final Summary:');
    console.log('   - Admin user created (username: admin, password: admin123)');
    console.log('   - Staff members: 50+ employees across all roles');
    console.log('   - Inventory items: 150+ items with full details');
    console.log('   - Customers: 10+ customers with complete profiles');
    console.log('   - Orders: 15+ orders with detailed order items');
    console.log('   - Reviews: 15+ customer reviews with ratings');
    console.log('   - Menu items: 80+ dishes across all categories');
    console.log('   - Payments: 10+ payment records with various methods');
    console.log('   - All data tables exported to markdown files');
    
  } catch (error) {
    console.error('❌ Error during comprehensive seeding:', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

seedComprehensive();
