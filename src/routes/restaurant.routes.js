const express = require('express');

//Controllers
const restaurantController = require('../controllers/restaurant.controller');
const reviewController = require('../controllers/review.controller');

//Middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const restaurantMiddleware = require('../middlewares/restaurant.middleware');
const reviewMiddleware = require('../middlewares/review.middleware');

const router = express.Router();

router
  .route('/')
  .get(restaurantController.findAll)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    restaurantController.create
  );

router
  .route('/:id')
  .get(restaurantMiddleware.existRestaurant, restaurantController.findOne)
  .patch(
    restaurantMiddleware.existRestaurant,
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    restaurantController.update
  )
  .delete(
    restaurantMiddleware.existRestaurant,
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    restaurantController.delete
  );

router.use(authMiddleware.protect);

router.post(
  '/review/:id',
  restaurantMiddleware.existRestaurant,
  reviewController.create
);
router
  .use(
    '/review/:resstaurantId/:id',
    reviewMiddleware.existReview,
    restaurantMiddleware.existRestaurant
  )
  .route('/review/:resstaurantId/:id')
  .patch(authMiddleware.protectAccountOwner, reviewController.update)
  .delete(authMiddleware.protectAccountOwner, reviewController.delete);

module.exports = router;
