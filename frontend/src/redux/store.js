import { configureStore } from "@reduxjs/toolkit";
// help us setup redux store to manage state in app

import authReducer from "./slices/authSlice"
import productReducer from "./slices/productsSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },
});

export default store;
