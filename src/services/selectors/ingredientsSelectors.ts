import type { RootState } from '../store';

export const selectIngredients = (state: RootState) => state.ingredients.data;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
