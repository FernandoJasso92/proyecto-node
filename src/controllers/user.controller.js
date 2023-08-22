const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const catchAsync = require('../utils/catchAsync');
const generateJWT = require('../utils/jwt');

const User = require('../models/user.model');
const Order = require('../models/order.model');
const Restaurant = require('../models/restaurant.model');
const Meal = require('../models/meal.model');

exports.create = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encryptedPassword,
    role,
  });

  const token = await generateJWT(user.id);

  res.status(201).json({
    status: 'success',
    message: 'The user has been created successfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  //1 Traer la informacion de la req.body
  const { email, password } = req.body;

  //2 Buscar el usuario y revisar si existe
  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: true,
    },
  });

  if (!user) {
    return next(new AppError('The user could not found', 404));
  }

  //3 Validar si la contraseña es correcta
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('The password is incorrect', 401));
  }

  //4 Generar el token
  const token = await generateJWT(user.id);

  //5 Enviar la contraseña
  res.status(200).json({
    status: 'success',
    message: 'The user has been logged in successfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({ name, email });

  return res.satatus(200).json({
    status: 'success',
    message: 'The user has been updated successfully',
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const { user } = req;
  await user.update({ status: false });

  return res.status(200).json({
    status: 'success',
    message: 'The user has been deleted successfully',
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const { user } = req;

  const orders = await Order.getAllOrders({
    where: {
      userId: user.id,
    },
    attributes: { exclude: ['mealId', 'userId', 'status'] },
    include: [
      {
        model: Meal,
        attributes: ['name', 'price'],
      },
      {
        model: Restaurant,
        attributes: ['name'],
      },
    ],
  });

  return res.status(200).json({
    status: 'success',
    results: orders.length,
    orders,
  });
});

exports.ordersDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const orderDetails = await Order.findOne({
    where: {
      id,
    },
    include: [
      {
        model: Meal,
        attributes: ['name', 'price'],
      },
      {
        model: Restaurant,
        attributes: ['name'],
      },
    ],
  });

  return res.status(200).json({
    status: 'success',
    orderDetails,
  });
});
