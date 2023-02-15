import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { userSlice } from '../login/slices'
import { productSlice } from '../manage/productSlices'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { homeSlice } from '../home/homeSlices';
import thunk from 'redux-thunk';
import { notiAndSwitchPageSlices } from '../home/notiAndSwitchPageSlices';

/*Normally, when reload page redux state will lost
Using redux persist to create a storage (default is local storage) to save the state */

//Create a storage and blacklist reducer that don't need to be stored
const rootPersistConfig = {
    key: 'root',
    storage,
    blacklist: ['manageProduct', 'manageSwitchNoti']
}

/*4 reducer used:*/
//Login: store current logged in user
//Product: Store current product choose to update (Used for update product information), switch between each features (Show, Add, Update)
//Home: Store products in cart and current product to show product details
//Noti: For Home Page, switch between home and detail page; store message that can be used anywhere
const rootReducer = combineReducers({
    loginUser: userSlice.reducer,
    manageProduct: productSlice.reducer,
    manageHome: homeSlice.reducer,
    manageSwitchNoti: notiAndSwitchPageSlices.reducer
})

//Add reducer to persist reducer
const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

//Middleware used to return functions rather than just actions
//Allow the store to run async functions before do the actions from reducer and add to redux store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
})

export const persistor = persistStore(store)