import { createSlice } from "@reduxjs/toolkit";

export const notiAndSwitchPageSlices = createSlice({
    name: 'homePageFeatures',
    initialState: {
        notification: {
            message: '',
            open: false
        },
        //Home, Detail
        pageState: "home"
    },
    reducers: {
        switchPage: (state, action) => {
            state.pageState = action.payload
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