// src/services/index.js

export { login, register, logout, resetPassword } from "./authService";
export {
  getSession,
  getUserProfile,
  getUserOrders,
  createOrder,
  saveAddress,
} from "./dataService";
export { getProductList, getProduct, getFeaturedList } from "./productService";
export {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "./wishlistService";





