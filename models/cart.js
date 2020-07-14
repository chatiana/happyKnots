//logic for fetching a cart from a file
const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {  //export class
  static addProduct(id, productPrice) {
    //Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
        let cart = {products: [], totalPrice: 0};
        if (!err) {  //if we dont get an error
            cart = JSON.parse(fileContent);
        }
        // Analyze the cart => Find existing product
        const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
        const existingProduct = cart.products[existingProductIndex];
        let updatedProduct;
        //Add new product  / increase qty.
        if (existingProduct) { //if we have an existing product already we want to update the qty
          updatedProduct = { ...existingProduct }; //object spread operator
          updatedProduct.qty = updatedProduct.qty + 1;
          cart.products = [...cart.products];
          cart.products[existingProductIndex] = updatedProduct;
        } else {
            updatedProduct = { id: id, qty: 1 };
            cart.products = [...cart.products, updatedProduct]; //array with all cart products.
        }
        //update price of the cart
        cart.totalPrice = cart.totalPrice + +productPrice;
        fs.writeFile(p, JSON.stringify(cart), err => { 
            console.log(err);
        });
      });
    }

    static deleteProduct(id, productPrice) {
      fs.readFile(p, (err, fileContent) => {
        if (err) {
          return;
        }
        //update cart
        const updatedCart = { ...JSON.parse(fileContent) };
        const product = updatedCart.products.find(prod => prod.id === id);
        if (!product) {  //check if you dont have a product
          return;
      }
        const productQty = product.qty;
        updatedCart.products = updatedCart.products.filter(
            prod => prod.id !== id //return true
        );
        updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;  

        fs.writeFile(p, JSON.stringify(updatedCart), err => {
          console.log(err);
        });
      });
    };
    
  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};