const Meal = require('./meal.model');
const Order = require('./order.model');
const Restaurant = require('./restaurant.model');
const Review = require('./review.model');
const User = require('./user.model');

const initModels = () => {
  User.hasMany(Order);
  Order.belongsTo(User);

  User.hasMany(Review);
  Review.belongsTo(User);

  Restaurant.hasMany(Review);
  Review.belongsTo(Restaurant);

  Restaurant.hasMany(Meal);
  Meal.belongsTo(Restaurant);

  Meal.hasOne(Order);
  Order.belongsTo(Meal);
};

module.exports = initModels;
