const express = require('express');
const { body, validationResult } = require('express-validator');
const { Payment, Order, Customer } = require('../models');
const router = express.Router();

// Get all payments with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      status, 
      paymentMethod,
      orderId,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (paymentMethod) {
      whereClause.method = paymentMethod;
    }

    if (orderId) {
      whereClause.orderId = orderId;
    }

    const { count, rows: payments } = await Payment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Order,
          include: [
            {
              model: Customer,
              attributes: ['id', 'name', 'email', 'phone']
            }
          ],
          attributes: ['id', 'tableNumber', 'total', 'status']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
});

// Get payment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Order,
          include: [
            {
              model: Customer,
              attributes: ['id', 'name', 'email', 'phone']
            }
          ]
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message
    });
  }
});

// Create new payment
router.post('/', [
  body('orderId').isInt().withMessage('Order ID is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('method').isIn(['cash', 'card', 'upi', 'netbanking']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId, amount, method, notes } = req.body;

    // Check if order exists and is not already paid
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status === 'PAID' || order.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create payment
    const payment = await Payment.create({
      orderId,
      amount,
      method: method,
      status: 'completed'
    });

    // Note: Order status should be updated manually by staff, not automatically
    // This allows proper workflow control: PENDING → CONFIRMED → PREPARING → READY → DELIVERED → PAID

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      data: payment
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  }
});

// Get payment statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const { sequelize } = require('../models');
    
    const totalPayments = await Payment.count();
    const completedPayments = await Payment.count({ where: { status: 'completed' } });
    const pendingPayments = await Payment.count({ where: { status: 'pending' } });
    
    const totalAmount = await Payment.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
      ],
      where: { status: 'completed' },
      raw: true
    });

    // Count payments by method, treating null/unknown as 'card' for UI
    const rawMethodStats = await Payment.findAll({
      attributes: [
        'method',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
      ],
      where: { status: 'completed' },
      group: ['method'],
      raw: true
    });

    const normalizeMethod = (m) => {
      if (!m || typeof m !== 'string') return 'card';
      const v = m.toLowerCase();
      return ['cash', 'card', 'upi', 'netbanking'].includes(v) ? v : 'card';
    };

    const methodStatsMap = {};
    for (const row of rawMethodStats) {
      const key = normalizeMethod(row.method);
      const countNum = Number(typeof row.count === 'string' ? parseInt(row.count, 10) : row.count || 0);
      const amountNum = Number(typeof row.totalAmount === 'string' ? parseFloat(row.totalAmount) : row.totalAmount || 0);
      if (!methodStatsMap[key]) {
        methodStatsMap[key] = { method: key, count: 0, totalAmount: 0 };
      }
      methodStatsMap[key].count += countNum;
      methodStatsMap[key].totalAmount += amountNum;
    }
    const methodStats = Object.values(methodStatsMap);

    const recentPayments = await Payment.findAll({
      include: [
        {
          model: Order,
          attributes: ['id', 'tableNumber', 'total']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      data: {
        totalPayments,
        completedPayments,
        pendingPayments,
        totalAmount: parseFloat(totalAmount[0]?.totalAmount || 0),
        methodStats,
        recentPayments
      }
    });
  } catch (error) {
    console.error('Error fetching payment statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment statistics',
      error: error.message
    });
  }
});

module.exports = router;