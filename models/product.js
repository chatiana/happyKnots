const fs = require('fs');
const path = require('path');
//import cart model
const Cart = require('./cart'); 

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description ) {
    this.id = id,
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }
//SAVE PRODUCT
  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          prod => prod.id === this.id
          );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {  //writeFile will replace old content
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();  //generate  a unique id for each product
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
      });
  };
});
};
//DELETE PRODUCT
  static deleleById(id){
    getProductsFromFile( products => {
      const product = products.find(prod => prod.id === id);
      const updatedProducts = products.filter(prod => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  //load a single product adding a new static method : findById
  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id); //will return the product
      cb(product); //callback
    });
  }
};
