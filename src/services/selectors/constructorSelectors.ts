import type { RootState } from '../store';

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor || { bun: null, ingredients: [] };
