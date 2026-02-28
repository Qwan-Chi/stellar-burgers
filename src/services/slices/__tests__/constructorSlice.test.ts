import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../constructorSlice';
import { TConstructorIngredient, TIngredient } from '../../../utils/types';

const mockBun: TIngredient = {
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
};

const mockMain: TIngredient = {
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
};

const mockSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

const mockMain2: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0943',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
};

const initialState = {
  bun: null,
  ingredients: []
};

describe('constructorSlice', () => {
  it('должен вернуть начальное состояние', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  describe('addIngredient', () => {
    it('должен добавить булку в конструктор', () => {
      const state = constructorReducer(initialState, addIngredient(mockBun));

      expect(state.bun).not.toBeNull();
      expect(state.bun!._id).toBe(mockBun._id);
      expect(state.bun!.name).toBe(mockBun.name);
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен заменить булку при добавлении новой', () => {
      const stateWithBun = constructorReducer(
        initialState,
        addIngredient(mockBun)
      );
      const newBun: TIngredient = {
        ...mockBun,
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3'
      };
      const state = constructorReducer(stateWithBun, addIngredient(newBun));

      expect(state.bun!._id).toBe(newBun._id);
      expect(state.bun!.name).toBe(newBun.name);
    });

    it('должен добавить начинку в конструктор', () => {
      const state = constructorReducer(initialState, addIngredient(mockMain));

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockMain._id);
      expect(state.ingredients[0]).toHaveProperty('id');
    });

    it('должен добавить соус в конструктор', () => {
      const state = constructorReducer(initialState, addIngredient(mockSauce));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockSauce._id);
    });

    it('должен генерировать уникальный id для каждого добавленного ингредиента', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockMain));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент по id', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      const addedId = state.ingredients[0].id;

      state = constructorReducer(state, addIngredient(mockSauce));
      expect(state.ingredients).toHaveLength(2);

      state = constructorReducer(state, removeIngredient(addedId));
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockSauce._id);
    });

    it('не должен удалять ничего при несуществующем id', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, removeIngredient('non-existent-id'));

      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredientUp', () => {
    it('должен переместить ингредиент вверх', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockMain2));

      const originalSecond = state.ingredients[1];
      state = constructorReducer(state, moveIngredientUp(1));

      expect(state.ingredients[0]._id).toBe(originalSecond._id);
    });

    it('не должен перемещать первый ингредиент вверх', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      const originalFirst = state.ingredients[0];
      state = constructorReducer(state, moveIngredientUp(0));

      expect(state.ingredients[0]._id).toBe(originalFirst._id);
    });
  });

  describe('moveIngredientDown', () => {
    it('должен переместить ингредиент вниз', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockMain2));

      const originalFirst = state.ingredients[0];
      state = constructorReducer(state, moveIngredientDown(0));

      expect(state.ingredients[1]._id).toBe(originalFirst._id);
    });

    it('не должен перемещать последний ингредиент вниз', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      const originalLast = state.ingredients[1];
      state = constructorReducer(state, moveIngredientDown(1));

      expect(state.ingredients[1]._id).toBe(originalLast._id);
    });
  });

  describe('clearConstructor', () => {
    it('должен очистить конструктор', () => {
      let state = constructorReducer(initialState, addIngredient(mockBun));
      state = constructorReducer(state, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      state = constructorReducer(state, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
