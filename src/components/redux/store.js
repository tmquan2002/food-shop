import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from '../login/slices'
import { productSlice } from '../manage/productSlices'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
}

const loginUserPersistReducer = persistReducer(persistConfig, userSlice.reducer)

export const store = configureStore({
    reducer: {
        loginUser: loginUserPersistReducer,
        manageProduct: productSlice.reducer
    }
})

export const persistor = persistStore(store)