import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import ticketReducer from "./slices/ticketSlice";
import adminReducer from "./slices/adminSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    admin: adminReducer,
  },
  // Redux DevTools is automatically enabled in development
  devTools: import.meta.env.DEV,
});

export default store;
