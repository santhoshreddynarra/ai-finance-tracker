import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import transactionReducer from "./slices/transactionSlice";
import categoryReducer from "./slices/categorySlice";
import budgetReducer from "./slices/budgetSlice";
import dashboardReducer from "./slices/dashboardSlice";
import aiReducer from "./slices/aiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    categories: categoryReducer,
    budget: budgetReducer,
    dashboard: dashboardReducer,
    ai: aiReducer,
  },
});

export default store;
