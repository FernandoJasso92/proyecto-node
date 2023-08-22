const express = require('express');

//Controllers
const userController = require('../controllers/user.controller');
const orderController = require('../controllers/orders.controller');

//Middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');

const router = express.Router();

router.post('/signup', userController.create);

router.post('/login', userController.login);

router.use(authMiddleware.protect);

router
  .post('/:id', userMiddleware.existUser)
  .route('/:id')
  .patch(authMiddleware.protectAccountOwner, userController.update)
  .delete(authMiddleware.protectAccountOwner, userController.delete);

router
  .get('/orders', authMiddleware.restrictTo, userController.getAllOrders)
  .get('/orders/:id', authMiddleware.restrictTo, userController.ordersDetails);

module.exports = router;
