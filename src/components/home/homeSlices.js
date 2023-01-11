import { createSlice } from "@reduxjs/toolkit";

export const homeSlice = createSlice({
    name: 'homePageFeatures',
    //2 states: View, Add, Update
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
        notification: {
            message: '',
            open: false
        },
        //Home, Cart, Detail
        pageState: "home"
    },
    reducers: {
        addToCart: (state, action) => {
            let old = false;
            for (let i = 0; i < state.cart.length; i++) {
                if (state.cart[i].id === action.payload.id) {
                    state.cart[i].quantity = state.cart[i].quantity + 1
                    old = true
                }
            }
            if (!old) {
                state.cart.push(action.payload);
            }
        },
        removeFromCart: (state, action) => {
            state.cart = state.value.filter((item) => item.id !== action.payload.id);
        },
        changeSearchValue: (state, action) => {
            state.searchValue = action.payload
        },
        chnageSearchType: (state, action) => {
            state.searchType = action.payload
        },
    }
})