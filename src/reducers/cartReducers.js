// src/reducers/cartReducers.js

export const cartReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case "ADD_TO_CART":
            return {
                ...state,
                cartList: payload.products,
                total: payload.total,
            };

        case "REMOVE_FROM_CART":
            return {
                ...state,
                cartList: payload.products,
                total: payload.total,
            };

        case "CLEAR_CART":
            return {
                ...state,
                cartList: [], // Reset cartList to an empty array
                total: 0,     // Reset total to 0
            };

        default:
            throw new Error(`No case found for action type: ${type}`);
    }
};
