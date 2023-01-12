import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { userSlice } from '../login/slices'
import { productSlice } from '../manage/productSlices'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { homeSlice } from '../home/homeSlices';
import thunk from 'redux-thunk';
import { notiAndSwitchPageSlices } from '../home/notiAndSwitchPageSlices';

const rootPersistConfig = {
    key: 'root',
    storage,
    blacklist: ['manageProduct', 'manageSwitchNoti']
}

const rootReducer = combineReducers({
    loginUser: userSlice.reducer,
    manageProduct: productSlice.reducer,
    manageHome: homeSlice.reducer,
    manageSwitchNoti: notiAndSwitchPageSlices.reducer
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
})

export const persistor = persistStore(store)