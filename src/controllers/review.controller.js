const Review = require('../models/review.model');
const catchAsync = require('../utils/catchAsync');

exports.create = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { id } = req.params;
  const uid = req.sessionUser.id;

  await Review.create({ comment, rating, restaurantId: +id, userId: +uid });

  res.status(201).json({
    status: 'success',
    message: 'The review has been created successfully',
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const { review } = req;

  const { comment, rating } = req.body;

  await review.update({ comment, rating });

  res.status(200).json({
    status: 'success',
    message: 'The review has been updated successfully',
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'The review has been deleted successfully',
  });
});
