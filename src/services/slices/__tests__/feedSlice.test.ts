import { feedReducer, fetchFeed } from '../feedSlice';
import { TOrder } from '../../../utils/types';

const initialState = {
  data: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

const mockFeedResponse = {
  success: true,
  orders: [
    {
      _id: '6601a1b797ede0001d0671a1',
      status: 'done',
      name: 'Краторный бургер',
      createdAt: '2024-03-25T12:00:00.000Z',
      updatedAt: '2024-03-25T12:00:00.000Z',
      number: 12345,
      ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
    }
  ] as TOrder[],
  total: 100,
  totalToday: 10
};

describe('feedSlice', () => {
  it('должен вернуть начальное состояние', () => {
    const state = feedReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  describe('fetchFeed', () => {
    it('должен установить isLoading в true при pending', () => {
      const state = feedReducer(
        initialState,
        fetchFeed.pending('', undefined)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записать данные при fulfilled', () => {
      const state = feedReducer(
        { ...initialState, isLoading: true },
        fetchFeed.fulfilled(mockFeedResponse, '', undefined)
      );

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockFeedResponse.orders);
      expect(state.total).toBe(mockFeedResponse.total);
      expect(state.totalToday).toBe(mockFeedResponse.totalToday);
      expect(state.error).toBeNull();
    });

    it('должен записать ошибку при rejected', () => {
      const errorMessage = 'Не удалось загрузить ленту заказов';
      const state = feedReducer(
        { ...initialState, isLoading: true },
        fetchFeed.rejected(
          new Error(errorMessage),
          '',
          undefined,
          errorMessage
        )
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
