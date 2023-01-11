import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
    name: 'manageProductFeatures',
    //3 states: View, Add, Update
    initialState: {
        currentProduct: {
            id: '-1',
            name: '',
            type: '',
            quantity: 0,
            price: 0,
            sale: true,
            image: ''
        }, feature: 'view',
        notification: {
            message: '',
            open: false
        }
    },
    reducers: {
        updateCurrentProduct: (state, action) => {
            state.currentProduct = action.payload
        },
        switchView: (state) => {
            state.feature = 'view'
        },
        switchAdd: (state) => {
            state.feature = 'add'
        },
        switchUpdate: (state, action) => {
            state.feature = 'update'
            state.currentProduct = action.payload
        },
        setMessageNotification: (state, action) => {
            state.feature = 'view'
            state.notification.message = action.payload
            state.notification.open = true
        },
        closeMessageNotification: (state) => {
            state.notification.open = false
        }
    }
})