import { createSlice } from "@reduxjs/toolkit";

export const homeSlice = createSlice({
    name: 'homePageFeatures',
    initialState: {
        currentProduct: {
            id: '-1',
            name: '',
            type: '',
            quantity: 0,
            price: 0,
            sale: true,
            image: ''
        },
        searchValue: "",
        searchType: "",
        cart: [],
    },
    reducers: {
        addToCart: (state, action) => {
            let old = false;
            //Add 1 to quantity if this product has already in cart
            for (let i = 0; i < state.cart.length; i++) {
                if (state.cart[i].id === action.payload.id) {
                    state.cart[i].quantity = Number(state.cart[i].quantity) + 1
                    old = true
                }
            }
            //Default quantity is 1, add new product to cart
            if (!old) {
                state.cart.push(action.payload);
            }
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter((item) => item.id !== action.payload.id);
        },
        emptyCart: (state) => {
            state.cart = []
        },
        changeQuantity: (state, action) => {
            for (let i = 0; i < state.cart.length; i++) {
                if (state.cart[i].id === action.payload.id) {
                    state.cart[i].quantity = Number(action.payload.quantity)
                }
            }
        },
        changeSearchValue: (state, action) => {
            state.searchValue = action.payload
        },
        changeSearchType: (state, action) => {
            if (action.payload === "All") {
                state.searchType = ""
            } else {
                state.searchType = action.payload
            }
        },
        //For detail pages
        viewCurrentProduct: (state, action) => {
            state.currentProduct = action.payload
        }
    }
})