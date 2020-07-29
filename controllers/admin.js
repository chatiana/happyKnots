const mongoose = require('mongoose');

const { validationResult } = require('express-validator/check')

const Product = require('../models/product');

// ============================================
//  Get Admin Dash
// ============================================
exports.getAdminDash= (req, res, next) => {
  console.log(req.session.isLoggedIn);
    res.render('admin/admindash', {
      path: '/admindash',
      pageTitle: 'Admin Control Panel',
    });
  };
// ============================================
//  Get add Product
// ============================================
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};
// ============================================
//  Post Add Product
// ============================================
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const category = req.body.category;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if (!image) {  //if image is set. if not i want to return a response w/stat 422
  return res.status(422).render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: true,
    product: {
      title: title,
      category: category,
      price: price,
      description: description
    },
    errorMessage: 'Attached file is not a valid image.',
    validationErrors: []
  });
}
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        category: category,
        imageUrl: imageUrl,
        price: price,
        description: description
       },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  //files are not stored in the DB, but in a fole system
  const imageUrl = image.path; //will store the path of the image

  const product = new Product({
   // _id: new mongoose.Types.ObjectId('5f1f08b551942d8057fba085'),
    title: title,
    category: category,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('PRODUCT CREATED');
      res.redirect('/admin/products');
    })
    .catch(err => {
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing: false,
      //   hasError: true,
      //   product: {
      //     title: title,
      //     imageUrl: imageUrl,
      //     price: price,
      //     description: description
      //   },
      //   errorMessage: 'Database operation failed, please try again.',
      //   validationErrors: []
      // });
      // res.redirect('/error500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
// ============================================
//  Get Edit Product
// ============================================
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
// ============================================
//  Post Edit Product
// ============================================
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedCategory = req.body.category;
  const image = req.file; //file extracted by malter
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        category: updatedCategory,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.category= updatedCategory;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (image) {
        product.imageUrl =  image.path;
      }
      return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      });
    })
    .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
    });
};
// ============================================
//  Get all product for user
// ============================================
exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id}) //restriction to only display if prod was created
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      });
};
// ============================================
//  Post Delete product
// ============================================
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  //delete the prod where id is equal to prd id but ALSO user id is equal to _id
  Product.deleteOne({ _id: prodId, userId: req.user._id})
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      });
};
