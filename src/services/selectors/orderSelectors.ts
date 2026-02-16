import type { RootState } from '../store';

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const selectOrderData = (state: RootState) => state.order.data;
export const selectOrderLoading = (state: RootState) => state.order.isLoading;
export const selectOrderError = (state: RootState) => state.order.error;

export const selectOrderByNumber = (number: number) => (state: RootState) =>
  state.profileOrders.data.find((order) => order.number === number) ||
  state.feed.data.find((order) => order.number === number) ||
  (state.order.data?.number === number ? state.order.data : null);
