import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./UserSlice";
import notificationsReducer from "./notificationSlice";

export const store = configureStore({
    reducer:{
        user: UserReducer,
         notifications: notificationsReducer,
    },
})