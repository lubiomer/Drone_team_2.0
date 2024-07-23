import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authAPI } from './api/authAPI';
import { getMeAPI } from './api/getMeAPI';
import userReducer from './api/userSlice';
import { supportAPI } from './api/supportAPI';
import { userAPI } from './api/userAPI';
import { productAPI } from './api/productAPI';
import { cartAPI } from './api/cartAPI';
import { purchaseAPI } from './api/purchaseAPI';
import { flightAPI } from './api/flightAPI';
import { dashboardAPI } from './api/dashboardAPI';
import { reviewAPI } from './api/reviewAPI';
import { commentAPI } from './api/commentAPI';
import { statsAPI } from './api/statsAPI';

export const store = configureStore({
  reducer: {
    [authAPI.reducerPath]: authAPI.reducer,
    [getMeAPI.reducerPath]: getMeAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [supportAPI.reducerPath]: supportAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [cartAPI.reducerPath]: cartAPI.reducer,
    [purchaseAPI.reducerPath]: purchaseAPI.reducer,
    [flightAPI.reducerPath]: flightAPI.reducer,
    [dashboardAPI.reducerPath]: dashboardAPI.reducer,
    [reviewAPI.reducerPath]: reviewAPI.reducer,
    [commentAPI.reducerPath]: commentAPI.reducer,
    [statsAPI.reducerPath]: statsAPI.reducer,
    userState: userReducer

  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
        authAPI.middleware,
        getMeAPI.middleware,
        userAPI.middleware,
        supportAPI.middleware,
        productAPI.middleware,
        cartAPI.middleware,
        purchaseAPI.middleware,
        flightAPI.middleware,
        dashboardAPI.middleware,
        reviewAPI.middleware,
        commentAPI.middleware,
        statsAPI.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
