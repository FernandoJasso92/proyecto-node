const catchAsync = require('../utils/catchAsync');
const Order = require('../models/order.model');
const Meal = require('../models/meal.model');
const AppError = require('../utils/appError');
const Restaurant = require('../models/restaurant.model');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { mealId, quantity } = req.body;
  const { sessionUser } = req;

  const meal = await Meal.findOne({
    where: {
      id: mealId,
    },
  });

  if (!meal) {
    return next(new AppError('The meal not found', 404));
  }

  const totalprice = meal.price * quantity;

  const order = await Order.create({
    userId: sessionUser.id,
    mealId,
    quantity,
    totalprice,
  });

  res.status(200).json({
    status: 'success',
    message: 'Order created successfully',
    order,
  });
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Order.findAll({
    where: {
      userId: sessionUser.id,
    },
    attributes: {
      exclude: ['userId', 'mealId', 'status'],
    },

    include: [
      {
        model: Meal,
        attributes: ['name', 'price'],
        include: [
          {
            model: Restaurant,
          },
        ],
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    orders,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'completed' });

  res.status(200).json({
    status: 'completed',
    message: 'Order completed successfully',
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'cancelled' });

  res.status(200).json({
    status: 'completed',
    message: 'Order cancelled successfully',
  });
});
