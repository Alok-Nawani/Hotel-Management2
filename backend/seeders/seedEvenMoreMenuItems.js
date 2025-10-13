const { MenuItem } = require('../models');

async function seedEvenMoreMenuItems() {
  const items = [
    // Dal additions
    { name: 'Dal Tadka', price: 90, category: 'Dal', description: 'Tempered yellow lentils', available: true },
    { name: 'Moong Dal', price: 80, category: 'Dal', description: 'Yellow split lentils', available: true },
    { name: 'Masoor Dal', price: 75, category: 'Dal', description: 'Red lentils curry', available: true },
    { name: 'Chana Dal Fry', price: 95, category: 'Dal', description: 'Split chickpea dal', available: true },
    
    // Rice
    { name: 'Tomato Rice', price: 85, category: 'Rice', description: 'Tangy tomato flavored rice', available: true },
    { name: 'Coconut Rice', price: 90, category: 'Rice', description: 'Light coconut flavored rice', available: true },
    { name: 'Lemon Rice', price: 85, category: 'Rice', description: 'Citrusy rice with mustard tempering', available: true },
    
    // Vegetables
    { name: 'Methi Malai Paneer', price: 160, category: 'Vegetable', description: 'Paneer with fenugreek and cream', available: true },
    { name: 'Kadai Paneer', price: 150, category: 'Vegetable', description: 'Paneer in kadai spices', available: true },
    { name: 'Aloo Jeera', price: 95, category: 'Vegetable', description: 'Cumin tempered potatoes', available: true },
    { name: 'Mix Veg Curry', price: 120, category: 'Vegetable', description: 'Seasonal mixed vegetables', available: true },
    
    // Curries
    { name: 'Paneer Butter Masala', price: 170, category: 'Curry', description: 'Rich tomato and butter gravy', available: true },
    { name: 'Navratan Korma', price: 165, category: 'Curry', description: 'Nine veggie creamy curry', available: true },
    { name: 'Egg Curry', price: 120, category: 'Curry', description: 'Boiled eggs in spiced gravy', available: true },
    
    // Breads
    { name: 'Rumali Roti', price: 25, category: 'Bread', description: 'Thin handkerchief roti', available: true },
    { name: 'Bhatura', price: 35, category: 'Bread', description: 'Deep fried leavened bread', available: true },
    { name: 'Poori', price: 30, category: 'Bread', description: 'Deep fried whole wheat bread', available: true },
    
    // Snacks
    { name: 'Vada Pav', price: 40, category: 'Snack', description: 'Mumbai style potato slider', available: true },
    { name: 'Dhokla', price: 50, category: 'Snack', description: 'Steamed gram flour cake', available: true },
    { name: 'Medu Vada', price: 55, category: 'Snack', description: 'South Indian lentil donut', available: true },
    
    // Beverages
    { name: 'Green Tea', price: 40, category: 'Beverage', description: 'Light green tea', available: true },
    { name: 'Herbal Tea', price: 45, category: 'Beverage', description: 'Aromatic herbal infusion', available: true },
    { name: 'Hot Chocolate', price: 80, category: 'Beverage', description: 'Rich chocolate drink', available: true },
    
    // Desserts
    { name: 'Barfi', price: 50, category: 'Dessert', description: 'Milk-based fudge', available: true },
    { name: 'Ladoo', price: 45, category: 'Dessert', description: 'Gram flour sweet balls', available: true },
    { name: 'Phirni', price: 70, category: 'Dessert', description: 'Creamy ground rice pudding', available: true }
  ];

  await MenuItem.bulkCreate(items);
}

module.exports = { seedEvenMoreMenuItems };


