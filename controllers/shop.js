const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {  //render view
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId; //estract dynamic path segment. cont: prodId; params object on request to access our productId from routes.
  Product.findById(prodId, product => {
    res.render('shop/product-detail', {
      product: product,     //(left product: key to access on the view. (right product: product that we are retrieveing))
      pageTitle: product.title,
      path: '/products'
  });
});
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', { //render view
      prods: products,
      pageTitle: 'Shop/Index',
      path: '/',
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll (products => {
      const cartProducts = [];
      for (product of products){
        const cartProductData = cart.products.find( prod => prod.id === product.id
          );
        if (cartProductData ){
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {  //render view
        pageTitle: 'Your Cart',
        path: '/cart',
        products: cartProducts
    });
  });
});
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);  //method
  });
  res.redirect('/cart');
};

//delete product just from the cart
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your orders',
    path: '/orders'
  });
}