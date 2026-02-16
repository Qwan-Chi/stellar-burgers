import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

type TFeedState = {
  data: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  data: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Не удалось загрузить ленту заказов'
      );
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Ошибка загрузки ленты';
      });
  }
});

export const feedReducer = feedSlice.reducer;
