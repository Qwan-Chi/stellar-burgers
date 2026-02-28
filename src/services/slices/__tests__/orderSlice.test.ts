import {
  orderReducer,
  orderBurger,
  fetchOrderByNumber,
  closeOrderModal
} from '../orderSlice';
import { TOrder } from '../../../utils/types';

const initialState = {
  data: null,
  isLoading: false,
  error: null,
  orderRequest: false,
  orderModalData: null
};

const mockOrder: TOrder = {
  _id: '6601a1b797ede0001d0671a1',
  status: 'done',
  name: 'Краторный люминесцентный бургер',
  createdAt: '2024-03-25T12:00:00.000Z',
  updatedAt: '2024-03-25T12:00:00.000Z',
  number: 12345,
  ingredients: [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093c'
  ]
};

describe('orderSlice', () => {
  it('должен вернуть начальное состояние', () => {
    const state = orderReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  describe('orderBurger', () => {
    it('должен установить orderRequest в true при pending', () => {
      const state = orderReducer(
        initialState,
        orderBurger.pending('', [])
      );

      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записать данные заказа при fulfilled', () => {
      const state = orderReducer(
        { ...initialState, orderRequest: true },
        orderBurger.fulfilled(mockOrder, '', [])
      );

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('должен записать ошибку при rejected', () => {
      const errorMessage = 'Ошибка оформления заказа';
      const state = orderReducer(
        { ...initialState, orderRequest: true },
        orderBurger.rejected(
          new Error(errorMessage),
          '',
          [],
          errorMessage
        )
      );

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchOrderByNumber', () => {
    it('должен установить isLoading в true при pending', () => {
      const state = orderReducer(
        initialState,
        fetchOrderByNumber.pending('', 12345)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записать данные заказа при fulfilled', () => {
      const state = orderReducer(
        { ...initialState, isLoading: true },
        fetchOrderByNumber.fulfilled(mockOrder, '', 12345)
      );

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockOrder);
    });

    it('должен записать ошибку при rejected', () => {
      const errorMessage = 'Не удалось загрузить заказ';
      const state = orderReducer(
        { ...initialState, isLoading: true },
        fetchOrderByNumber.rejected(
          new Error(errorMessage),
          '',
          12345,
          errorMessage
        )
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('closeOrderModal', () => {
    it('должен закрыть модальное окно заказа', () => {
      const stateWithModal = {
        ...initialState,
        orderModalData: mockOrder,
        error: 'some error'
      };

      const state = orderReducer(stateWithModal, closeOrderModal());

      expect(state.orderModalData).toBeNull();
      expect(state.error).toBeNull();
    });
  });
});
