import { combineReducers } from '@reduxjs/toolkit';
import {
  authReducer,
  constructorReducer,
  feedReducer,
  ingredientsReducer,
  orderReducer,
  profileOrdersReducer
} from './slices';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  auth: authReducer,
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer,
  order: orderReducer
});
