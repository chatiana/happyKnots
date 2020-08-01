const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// ============================================
//  User schema
// ============================================  
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
 /* roles: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
    default: 'user'
  },*/

  /*rconfirmPassword: {
    type: String,
    equired: true
  },

  phone: {
    type: Number,
    /*required: true
  },*/
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});
// ============================================
//  schema to add items to cart
// ============================================  
userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

// ============================================
//  schema to remove items from cart
// ============================================  

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};


// ============================================
// schema to remove cart once order was placed
// ============================================  

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);