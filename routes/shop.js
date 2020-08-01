const path = require('path');

const express = require('express');

const  shopController = require('../controllers/shop');
//middleware to protect routes
const isAuth = require('../middleware/is-auth');  

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/about', shopController.getAbout);
router.get('/contact', shopController.getContact);
router.get('/tutorial', shopController.getTutorial);

router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct); //Product Details

router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
router.post('/create-order',isAuth, shopController.postOrder);
router.get('/orders', isAuth, shopController.getOrders);

router.get('/checkout', isAuth, shopController.getCheckout);
//router.get('/checkout/success', isAuth, shopController.getCheckoutSuccess);


module.exports = router;