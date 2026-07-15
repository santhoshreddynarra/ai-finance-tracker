import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import transactionReducer from "./slices/transactionSlice";
import categoryReducer from "./slices/categorySlice";
import budgetReducer from "./slices/budgetSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    categories: categoryReducer,
    budgets: budgetReducer,
  },
});

export default store;
