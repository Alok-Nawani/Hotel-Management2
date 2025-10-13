import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { fetchJSON } from '../api/api';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegFilter, setVegFilter] = useState('All'); // All, Veg, Non-Veg
  const [showCart, setShowCart] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  async function loadMenu() {
    const data = await fetchJSON('/menu?limit=500');
    setItems(data.items || data || []);
  }

  useEffect(() => {
    loadMenu();
  }, []);

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const nameLower = (item.name || '').toLowerCase();
    const baseCategory = item.category || 'Other';
    // Treat common dal dishes as Dal category even if backend marks them as Curry
    const isDalDish = /\b(dal|daal|makhani|tadka|moong|masoor|chana dal|rajma)\b/.test(nameLower);
    const category = baseCategory === 'Curry' && isDalDish ? 'Dal' : baseCategory;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Category display names and food icons
  const categoryInfo = {
    'Appetizer': { name: 'Starters', icon: '🥗', color: 'bg-orange-100 border-orange-300' },
    'Beverage': { name: 'Drinks', icon: '🥤', color: 'bg-orange-100 border-orange-300' },
    'Bread': { name: 'Breads', icon: '🍞', color: 'bg-orange-100 border-orange-300' },
    'Pizza': { name: 'Pizzas', icon: '🍕', color: 'bg-orange-100 border-orange-300' },
    'Rice': { name: 'Rice', icon: '🍚', color: 'bg-orange-100 border-orange-300' },
    'Curry': { name: 'Curries', icon: '🍛', color: 'bg-orange-100 border-orange-300' },
    'Vegetable': { name: 'Vegetables', icon: '🥬', color: 'bg-orange-100 border-orange-300' },
    'Dessert': { name: 'Desserts', icon: '🍰', color: 'bg-orange-100 border-orange-300' },
    'Snack': { name: 'Snacks', icon: '🍟', color: 'bg-orange-100 border-orange-300' },
    'Side': { name: 'Sides', icon: '🥒', color: 'bg-orange-100 border-orange-300' },
    'Dal': { name: 'Dal', icon: '🫘', color: 'bg-orange-100 border-orange-300' },
    'Other': { name: 'Other', icon: '🍽️', color: 'bg-orange-100 border-orange-300' }
  };

  // Determine if item is vegetarian
  const isVegetarian = (name, category) => {
    const nameLower = name.toLowerCase();
    
    // Non-vegetarian keywords
    const nonVegKeywords = ['chicken', 'mutton', 'fish', 'prawn', 'egg', 'meat', 'beef', 'pork', 'lamb'];
    
    // Check if name contains non-veg keywords
    if (nonVegKeywords.some(keyword => nameLower.includes(keyword))) {
      return false;
    }
    
    // Category-based determination
    if (category === 'Curry' && nameLower.includes('chicken')) return false;
    if (category === 'Rice' && (nameLower.includes('chicken') || nameLower.includes('mutton'))) return false;
    
    return true; // Default to vegetarian
  };

  // Food item icons mapping
  const getFoodIcon = (name, category) => {
    const nameLower = name.toLowerCase();
    
    // Specific food icons
    if (nameLower.includes('pizza')) return '🍕';
    if (nameLower.includes('burger')) return '🍔';
    if (nameLower.includes('pasta')) return '🍝';
    if (nameLower.includes('noodles')) return '🍜';
    if (nameLower.includes('rice')) return '🍚';
    if (nameLower.includes('curry')) return '🍛';
    if (nameLower.includes('soup')) return '🍲';
    if (nameLower.includes('salad')) return '🥗';
    if (nameLower.includes('sandwich')) return '🥪';
    if (nameLower.includes('fries')) return '🍟';
    if (nameLower.includes('chicken')) return '🍗';
    if (nameLower.includes('fish')) return '🐟';
    if (nameLower.includes('paneer')) return '🧀';
    if (nameLower.includes('aloo') || nameLower.includes('potato')) return '🥔';
    if (nameLower.includes('naan') || nameLower.includes('roti') || nameLower.includes('paratha')) return '🍞';
    if (nameLower.includes('tea') || nameLower.includes('chai')) return '☕';
    if (nameLower.includes('coffee')) return '☕';
    if (nameLower.includes('juice')) return '🧃';
    if (nameLower.includes('lassi')) return '🥤';
    if (nameLower.includes('ice cream')) return '🍦';
    if (nameLower.includes('cake') || nameLower.includes('dessert')) return '🍰';
    if (nameLower.includes('samosa')) return '🥟';
    if (nameLower.includes('roll')) return '🌯';
    
    // Category-based icons
    switch (category) {
      case 'Beverage': return '🥤';
      case 'Bread': return '🍞';
      case 'Pizza': return '🍕';
      case 'Rice': return '🍚';
      case 'Curry': return '🍛';
      case 'Vegetable': return '🥬';
      case 'Dessert': return '🍰';
      case 'Snack': return '🍟';
      case 'Side': return '🥒';
      case 'Dal': return '🫘';
      case 'Appetizer': return '🥗';
      default: return '🍽️';
    }
  };

  const addToCart = (item) => {
    if (item.available === false) {
      toast.error('This item is currently unavailable');
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    toast.success(`${item.name} added to cart!`);
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredItems = items.filter(item => {
    // Category filter
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
    
    // Veg/Non-Veg filter
    const isVeg = isVegetarian(item.name, item.category);
    const vegMatch = vegFilter === 'All' || 
      (vegFilter === 'Veg' && isVeg) || 
      (vegFilter === 'Non-Veg' && !isVeg);
    
    return categoryMatch && vegMatch;
  });

  const onSubmit = async (data) => {
    try {
      const menuData = {
        ...data,
        available: data.available === 'true',
        price: parseFloat(data.price)
      };
      await fetchJSON('/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData)
      });
      toast.success('Menu item added');
      setShowForm(false);
      reset();
      loadMenu();
    } catch (err) {
      toast.error('Failed to add menu item');
    }
  };

  const handleCheckout = async (orderData) => {
    try {
      // Create order
      const order = await fetchJSON('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber: orderData.tableNumber,
          items: cart.map(item => ({
            menuItemId: item.id,
            qty: item.quantity
          })),
          total: getTotalPrice()
        })
      });

      // Create payment
      await fetchJSON('/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          method: orderData.paymentMethod,
          amount: getTotalPrice()
        })
      });

      toast.success('Order placed successfully!');
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
    } catch (err) {
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-orange-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">🍽️ Restaurant Menu</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCart(true)}
              className="bg-orange-700 hover:bg-orange-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              🛒 Cart ({getCartItemCount()})
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-700 hover:bg-orange-800 px-4 py-2 rounded-lg transition-colors"
            >
              ➕ Add Item
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Veg/Non-Veg Filters */}
        <div className="mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setVegFilter('All')}
              className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                vegFilter === 'All'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-orange-600 border border-orange-300 hover:bg-orange-50'
              }`}
            >
              🍽️ All ({items.length})
            </button>
            <button
              onClick={() => setVegFilter('Veg')}
              className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                vegFilter === 'Veg'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-600 border border-green-300 hover:bg-green-50'
              }`}
            >
              🟢 Veg ({items.filter(item => isVegetarian(item.name, item.category)).length})
            </button>
            <button
              onClick={() => setVegFilter('Non-Veg')}
              className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                vegFilter === 'Non-Veg'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-red-600 border border-red-300 hover:bg-red-50'
              }`}
            >
              🔴 Non-Veg ({items.filter(item => !isVegetarian(item.name, item.category)).length})
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-orange-600 border border-orange-300 hover:bg-orange-50'
              }`}
            >
              All ({items.length})
            </button>
            {Object.entries(categoryInfo).map(([category, info]) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                  selectedCategory === category
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-orange-600 border border-orange-300 hover:bg-orange-50'
                }`}
              >
                <span>{info.icon}</span>
                {info.name} ({groupedItems[category]?.length || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-orange-200">
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">{getFoodIcon(item.name, item.category)}</div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${isVegetarian(item.name, item.category) ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-orange-600">₹{item.price}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.available !== false
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.available !== false ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(item)}
                  disabled={item.available === false}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    item.available !== false
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {item.available !== false ? '➕ Add to Cart' : 'Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-600">No items found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">🛒 Your Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🛒</div>
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl">{getFoodIcon(item.name, item.category)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-800">{item.name}</h4>
                            <div className={`w-2 h-2 rounded-full ${isVegetarian(item.name, item.category) ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          </div>
                          <p className="text-orange-600 font-medium">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-gray-800">Total:</span>
                      <span className="text-2xl font-bold text-orange-600">₹{getTotalPrice()}</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowCart(false);
                        setShowCheckout(true);
                      }}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      💳 Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">💳 Checkout</h2>
            
            <form onSubmit={handleSubmit(handleCheckout)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                <input
                  {...register('tableNumber', { required: true })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter table number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  {...register('paymentMethod', { required: true })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select payment method</option>
                  <option value="cash">💵 Cash</option>
                  <option value="card">💳 Card</option>
                  <option value="upi">📱 UPI</option>
                  <option value="netbanking">🏦 Net Banking</option>
                </select>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total Amount:</span>
                  <span className="text-xl font-bold text-orange-600">₹{getTotalPrice()}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  🚀 Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Add Menu Item</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  {...register('name', { required: true })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register('description')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  {...register('price', { required: true })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  {...register('category', { required: true })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select Category</option>
                  <option value="Appetizer">🥗 Starters & Appetizers</option>
                  <option value="Beverage">🥤 Beverages</option>
                  <option value="Bread">🍞 Breads</option>
                  <option value="Pizza">🍕 Pizzas</option>
                  <option value="Rice">🍚 Rice Dishes</option>
                  <option value="Curry">🍛 Curries</option>
                  <option value="Vegetable">🥬 Vegetables</option>
                  <option value="Dessert">🍰 Desserts</option>
                  <option value="Snack">🍟 Snacks</option>
                  <option value="Side">🥒 Sides</option>
                  <option value="Dal">🫘 Dal & Lentils</option>
                  <option value="Other">🍽️ Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available</label>
                <select
                  {...register('available', { required: true })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  defaultValue="true"
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}