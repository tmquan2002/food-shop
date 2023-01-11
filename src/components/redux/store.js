import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { userSlice } from '../login/slices'
import { productSlice } from '../manage/productSlices'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { homeSlice } from '../home/homeSlices';
import thunk from 'redux-thunk';

const rootPersistConfig = {
    key: 'root',
    storage,
    blacklist: ['manageProduct']
}

const rootReducer = combineReducers({
    loginUser: userSlice.reducer,
    manageProduct: productSlice.reducer,
    manageHome: homeSlice.reducer
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
})

export const persistor = persistStore(store)