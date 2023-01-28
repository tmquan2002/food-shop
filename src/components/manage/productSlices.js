import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
    name: 'manageProductFeatures',
    //3 states: View, Add, Update
    initialState: {
        currentProduct: {
            id: '-1',
            name: '',
            type: 'Fruit',
            quantity: 0,
            price: 1000,
            sale: false,
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
            state.currentProduct = {
                id: '-1',
                name: '',
                type: 'Fruit',
                quantity: 0,
                price: 1000,
                sale: false,
                image: ''
            }
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
            state.notification.message = action.payload
            state.notification.open = true
        },
        closeMessageNotification: (state) => {
            state.notification.open = false
        }
    }
})