import { ingredientsReducer, fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';

const initialState = {
  data: [],
  isLoading: false,
  error: null
};

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

describe('ingredientsSlice', () => {
  it('должен вернуть начальное состояние', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  describe('fetchIngredients', () => {
    it('должен установить isLoading в true при pending', () => {
      const state = ingredientsReducer(
        initialState,
        fetchIngredients.pending('', undefined)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записать данные при fulfilled', () => {
      const state = ingredientsReducer(
        { ...initialState, isLoading: true },
        fetchIngredients.fulfilled(mockIngredients, '', undefined)
      );

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    it('должен записать ошибку при rejected', () => {
      const errorMessage = 'Не удалось загрузить ингредиенты';
      const state = ingredientsReducer(
        { ...initialState, isLoading: true },
        fetchIngredients.rejected(
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
