const express = require('express');

//Controllers
const ordersController = require('../controllers/orders.controller');

//Middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const ordersMiddleware = require('../middlewares/orders.middleware');
const usersMiddleware = require('../middlewares/user.middleware');
const mealsMiddleware = require('../middlewares/meals.middleware');

const router = express.Router();

router.use(authMiddleware.protect);
router.post('/', ordersController.createOrder);
router.get('/:me', ordersController.getUserOrders);
router.patch('/:id', ordersMiddleware.existOrder, ordersController.updateOrder);
router.delete(
  '/:id',
  authMiddleware.restrictTo('admin'),
  ordersMiddleware.existOrder,
  ordersController.deleteOrder
);

module.exports = router;
