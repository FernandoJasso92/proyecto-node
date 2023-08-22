const Restaurant = require('../models/restaurant.model');
const catchAsync = require('../utils/catchAsync');

exports.findAll = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: {
      status: true,
    },
  });
  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    restaurants,
  });
});

exports.create = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  await Restaurant.create({ name, address, rating });

  res.status(201).json({
    status: 'success',
    message: 'The restaurant has been created successfully',
  });
});

exports.findOne = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  return res.status(200).json({
    status: 'success',
    message: 'The restaurant has been found successfully',
    restaurant,
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  const { name, address } = req.body;

  await restaurant.update({ name, address });

  res.status(200).json({
    status: 'success',
    message: 'The restaurant has been updated successfully',
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'The restaurant has been deleted successfully',
  });
});
