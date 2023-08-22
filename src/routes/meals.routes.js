const express = require('express');

//Controllers
const mealsController = require('../controllers/meals.controllers');

//Middlewares
const validMiddleware = require('../middlewares/valid.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const mealsMiddleware = require('../middlewares/meals.middleware');

const router = express.Router();

router.get('/', mealsController.getAllMeals);
router.get('/:id', mealsMiddleware.existMeals, mealsController.getOneMeal);

router
  .use(authMiddleware.protect, authMiddleware.restrictTo('admin'))
  .post(
    '/:id',
    validMiddleware.createOrderValidation,
    mealsController.createMeal
  )
  .patch(
    '/:id',
    authMiddleware.protect,
    mealsMiddleware.existMeals,
    mealsController.updateMeal
  )
  .delete(
    '/:id',
    authMiddleware.protect,
    mealsMiddleware.existMeals,
    mealsController.deleteMeal
  );

module.exports = router;
