const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
//middleware to protect routes
const isAuth = require('../middleware/is-auth');  

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/product => GET
router.get('/products', isAuth, adminController.getProducts);
router.get('/admindash', isAuth, adminController.getAdminDash);

// /admin/add-product => POST
router.post(
    '/add-product',
    [
      body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
      body('category')
        .isString()
        .isLength({ min: 4 })
        .trim(),
      body('price').isFloat(),
      body('description')
         .isString()
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
    isAuth,
    adminController.postAddProduct
  );

// /admin/edit-product => GET
router.get('/edit-product/:productId/', isAuth, adminController.getEditProduct);

// /admin/edit-product => POST
router.post('/edit-product',
[
  body('title')
    .isString()
    .isLength({ min: 5, max: 20 })
    .trim()
    .withMessage('Title must be at least 5 chars and max 20 chars'),
  body('category')
    .isString()
    .isLength({ min: 4 })
    .trim(),
  body('price')
    .isFloat({ min: 0.0, max: 1000000.0 })
    .trim()
    .withMessage('Price can be positve value only'),
  body('description')
    .isString()
    .isLength({ max: 400 })
    .trim()
    .withMessage('Please enter a valid Product desctription, maxium 400 characters long.'),
],
isAuth,  adminController.postEditProduct);

// /admin/delete-product => POST
router.post('/delete-product',isAuth, adminController.postDeleteProduct);

module.exports = router;
