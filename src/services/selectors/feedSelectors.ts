import type { RootState } from '../store';

export const selectFeedOrders = (state: RootState) => state.feed.data;
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedError = (state: RootState) => state.feed.error;
export const selectFeedInfo = (state: RootState) => ({
  total: state.feed.total,
  totalToday: state.feed.totalToday
});
