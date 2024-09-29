// src/reducers/filterReducers.js
export const filterReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "PRODUCT_LIST":
      return {
        ...state,
        productList: payload.products, // Update the productList in the state
      };

    case "SORT_BY":
      return {
        ...state,
        sortBy: payload.sortBy, // Update the sortBy field in the state
      };

    case "RATINGS":
      return {
        ...state,
        ratings: payload.ratings, // Update the ratings filter in the state
      };

    case "BEST_SELLER_ONLY":
      return {
        ...state,
        bestSellerOnly: payload.bestSellerOnly, // Update the bestSellerOnly filter in the state
      };

    case "ONLY_IN_STOCK":
      return {
        ...state,
        onlyInStock: payload.onlyInStock, // Update the onlyInStock filter in the state
      };

    case "CLEAR_FILTER":
      return {
        ...state,
        onlyInStock: false,
        bestSellerOnly: false,
        sortBy: null,
        ratings: null,
      };

    default:
      throw new Error(`No case found for action type: ${type}`);
  }
};
