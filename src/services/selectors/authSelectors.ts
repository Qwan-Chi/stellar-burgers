import type { RootState } from '../store';

export const selectUser = (state: RootState) => state.auth.data;
export const selectIsAuthChecked = (state: RootState) =>
  state.auth.isAuthChecked;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.data);
