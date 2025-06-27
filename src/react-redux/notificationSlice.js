import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Apis from "../component/Apis";
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (token) => {
    const res = await axios.get(Apis.Get_Notifications, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
     console.log("📥 RAW notification API response:", res.data.data)
    return res.data.data; // notifications array
  }
);

// ✅ Optional thunk to mark all as read
export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (token) => {
    await axios.patch(Apis.MarkAllRead, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    all: [],
    unreadCount: 0,
    loading: false,
  },
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const all = action.payload || [];
        state.all = all;
        const unread = all.filter((n) => !n.is_read); 
        state.unreadCount = all.filter((n) => !n.is_read).length;
        console.log("📊 Redux updated, unread count:", unread.length); 
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.all = state.all.map((n) => ({ ...n, is_read: true }));
        state.unreadCount = 0;
      });
  },
});


export const { setUnreadCount } = notificationsSlice.actions;
export default notificationsSlice.reducer;