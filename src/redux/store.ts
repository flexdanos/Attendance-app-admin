import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './features/api/authApi';
import { membersApi } from './features/api/membersApi';
import { eventsApi } from './features/api/eventsApi';
import { userApi } from './features/api/userApi';
// import signupReducer from './features/slice/signupSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [membersApi.reducerPath]: membersApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    // signup: signupReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, membersApi.middleware, eventsApi.middleware, userApi.middleware),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
