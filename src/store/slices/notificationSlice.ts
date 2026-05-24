import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { NotificationItem } from '@/types';

interface NotificationState {
  notifications: NotificationItem[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<NotificationItem>) {
      state.notifications.unshift(action.payload);
    },
    markRead(state, action: PayloadAction<string>) {
      const item = state.notifications.find((n) => n.id === action.payload);
      if (item) item.read = true;
    },
    clearAll(state) {
      state.notifications = [];
    },
  },
});

export const { addNotification, markRead, clearAll } = notificationSlice.actions;
export default notificationSlice.reducer;
