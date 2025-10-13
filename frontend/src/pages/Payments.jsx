import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api } from '../api/api';

// Icons
const CreditCardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const CashIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const BankIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const { register, handleSubmit, reset } = useForm();
  const [submitState, setSubmitState] = useState({ success: false, message: '' });

  const capitalize = (value) => {
    if (typeof value !== 'string' || value.length === 0) {
      return 'Unknown';
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  async function loadPayments() {
    try {
      setLoading(true);
      const [paymentsData, ordersData, statsData] = await Promise.all([
        api.getPayments(),
        api.getOrders(),
        api.getPaymentStats()
      ]);
      
      const paymentsArray = Array.isArray(paymentsData) ? paymentsData : (paymentsData.payments || []);
      const ordersArray = Array.isArray(ordersData) ? ordersData : (ordersData.orders || []);
      
      setPayments(paymentsArray);
      setFilteredPayments(paymentsArray);
      setOrders(ordersArray);
      const rawStats = statsData.data || statsData || {};
      const methodStats = Array.isArray(rawStats.methodStats) ? rawStats.methodStats : [];
      const getMethodCount = (method) => {
        const entry = methodStats.find(m => m.method === method);
        const countValue = entry?.count;
        const parsed = typeof countValue === 'string' ? parseInt(countValue, 10) : countValue;
        return Number(parsed || 0);
      };
      setStats({
        totalPayments: rawStats.totalPayments || 0,
        totalAmount: rawStats.totalAmount || 0,
        cardPayments: getMethodCount('card'),
        upiPayments: getMethodCount('upi'),
        cashPayments: getMethodCount('cash'),
        netbankingPayments: getMethodCount('netbanking'),
        methodStats,
        recentPayments: rawStats.recentPayments || []
      });
    } catch (error) {
      console.error('Error loading payments:', error);
      toast.error('Failed to load payments data');
    } finally {
      setLoading(false);
    }
  }

  // Filter payments based on search term and method
  useEffect(() => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.orderId.toString().includes(searchTerm) ||
        payment.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.amount.toString().includes(searchTerm)
      );
    }

    if (methodFilter) {
      filtered = filtered.filter(payment => payment.method === methodFilter);
    }

    setFilteredPayments(filtered);
  }, [searchTerm, methodFilter, payments]);

  useEffect(() => {
    loadPayments();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await api.createPayment({
        orderId: parseInt(data.orderId),
        method: data.method,
        amount: parseFloat(data.amount)
      });
      setSubmitState({ success: true, message: 'Payment processed successfully' });
      toast.success('Payment processed successfully');
      // Brief delay to show success confirmation in-form
      setTimeout(() => {
        setShowForm(false);
        setSubmitState({ success: false, message: '' });
        reset();
      }, 800);
      loadPayments();
    } catch (err) {
      console.error('Error creating payment:', err);
      toast.error('Failed to process payment');
      setSubmitState({ success: false, message: 'Failed to process payment' });
    }
  };

  const getMethodColor = (method) => {
    const normalized = normalizeMethod(method);
    const colors = {
      'cash': 'bg-green-100 text-green-800',
      'card': 'bg-blue-100 text-blue-800',
      'upi': 'bg-purple-100 text-purple-800',
      'netbanking': 'bg-orange-100 text-orange-800'
    };
    return colors[normalized] || 'bg-gray-100 text-gray-800';
  };

  const getMethodIcon = (method) => {
    const normalized = normalizeMethod(method);
    const icons = {
      'cash': <CashIcon />,
      'card': <CreditCardIcon />,
      'upi': <PhoneIcon />,
      'netbanking': <BankIcon />
    };
    return icons[normalized] || <CreditCardIcon />;
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const normalizeMethod = (value) => {
    if (!value || typeof value !== 'string') return 'card';
    const v = value.toLowerCase();
    return ['cash', 'card', 'upi', 'netbanking'].includes(v) ? v : 'card';
  };

  const uniqueMethods = [...new Set(payments.map(payment => normalizeMethod(payment.method)).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium">Loading Payment Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">💳 Payment Management</h1>
          <p className="text-indigo-100">Process and track all restaurant payments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-indigo-200">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <CreditCardIcon />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPayments || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-indigo-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <CashIcon />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalAmount || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-indigo-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <CreditCardIcon />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Card Payments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.cardPayments || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-indigo-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <PhoneIcon />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">UPI Payments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upiPayments || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search payments by order ID, method, or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
            </div>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            >
              <option value="">All Methods</option>
              {uniqueMethods.map(method => (
                <option key={method} value={method}>{capitalize(method)}</option>
              ))}
            </select>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PlusIcon />
              Process Payment
            </button>
          </div>
        </div>

        {/* Payments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPayments.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || methodFilter ? 'No payments found' : 'No payments yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || methodFilter ? 'Try adjusting your search criteria' : 'Process your first payment to get started!'}
              </p>
            </div>
          ) : (
            filteredPayments.map(payment => (
              <div key={payment.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 group">
                {/* Payment Header */}
                <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative">
                  <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    {getMethodIcon(payment.method)}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      Payment #{payment.id}
                    </h3>
                    <div className="flex gap-2 mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getMethodColor(payment.method)}`}>
                        {capitalize(normalizeMethod(payment.method))}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {capitalize(payment.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Order ID:</span>
                      <span className="text-sm font-semibold text-gray-900">#{payment.orderId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Amount:</span>
                      <span className="text-lg font-bold text-green-600">₹{payment.amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Date:</span>
                      <span className="text-sm text-gray-900">{new Date(payment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Time:</span>
                      <span className="text-sm text-gray-900">{new Date(payment.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckIcon />
                        <span className="ml-1">Processed</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Process Payment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form 
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="bg-indigo-500 text-white p-6">
              <h3 className="text-xl font-bold">Process New Payment</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Select Order</label>
                <select
                  {...register('orderId', { required: true })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Choose an order...</option>
                  {Array.isArray(orders) ? orders.filter(order => order.status !== 'PAID' && order.status !== 'paid').map(order => (
                    <option key={order.id} value={order.id}>
                      Order #{order.id} - Table {order.tableNumber} - ₹{order.total}
                    </option>
                  )) : null}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Payment Method</label>
                <select
                  {...register('method', { required: true })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select payment method...</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('amount', { required: true, min: 0.01 })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>
            </div>
            {submitState.success && (
              <div className="px-6 pt-4 text-green-700">
                ✅ {submitState.message}
              </div>
            )}
            <div className="flex gap-3 p-6 bg-gray-50">
              <button
                type="submit"
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Process Payment
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}