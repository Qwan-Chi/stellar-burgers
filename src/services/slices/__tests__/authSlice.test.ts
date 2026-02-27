import {
  authReducer,
  checkUserAuth,
  loginUser,
  registerUser,
  logoutUser,
  updateUser,
  clearAuthError
} from '../authSlice';
import { TUser } from '../../../utils/types';

const initialState = {
  data: null,
  isLoading: false,
  error: null,
  isAuthChecked: false
};

const mockUser: TUser = {
  email: 'test@test.com',
  name: 'Test User'
};

describe('authSlice', () => {
  it('должен вернуть начальное состояние', () => {
    const state = authReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  describe('clearAuthError', () => {
    it('должен очистить ошибку', () => {
      const stateWithError = { ...initialState, error: 'Ошибка авторизации' };
      const state = authReducer(stateWithError, clearAuthError());
      expect(state.error).toBeNull();
    });
  });

  describe('checkUserAuth', () => {
    it('должен установить isLoading в true при pending', () => {
      const state = authReducer(
        initialState,
        checkUserAuth.pending('', undefined)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записать данные пользователя при fulfilled', () => {
      const state = authReducer(
        { ...initialState, isLoading: true },
        checkUserAuth.fulfilled(mockUser, '', undefined)
      );

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен записать ошибку при rejected и установить isAuthChecked', () => {
      const errorMessage = 'Не удалось получить пользователя';
      const state = authReducer(
        { ...initialState, isLoading: true },
        checkUserAuth.rejected(
          new Error(errorMessage),
          '',
          undefined,
          errorMessage
        )
      );

      expect(state.isLoading).toBe(false);
      expect(state.data).toBeNull();
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('loginUser', () => {
    const loginData = { email: 'test@test.com', password: 'password' };

    it('должен установить isLoading в true при pending', () => {
      const state = authReducer(
        initialState,
        loginUser.pending('', loginData)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записать данные пользователя при fulfilled', () => {
      const state = authReducer(
        { ...initialState, isLoading: true },
        loginUser.fulfilled(mockUser, '', loginData)
      );

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockUser);
    });

    it('должен записать ошибку при rejected', () => {
      const errorMessage = 'Ошибка авторизации';
      const state = authReducer(
        { ...initialState, isLoading: true },
        loginUser.rejected(
          new Error(errorMessage),
          '',
          loginData,
          errorMessage
        )
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('registerUser', () => {
    const registerData = {
      email: 'test@test.com',
      name: 'Test User',
      password: 'password'
    };

    it('должен установить isLoading в true при pending', () => {
      const state = authReducer(
        initialState,
        registerUser.pending('', registerData)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записать данные пользователя при fulfilled', () => {
      const state = authReducer(
        { ...initialState, isLoading: true },
        registerUser.fulfilled(mockUser, '', registerData)
      );

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockUser);
    });

    it('должен записать ошибку при rejected', () => {
      const errorMessage = 'Ошибка регистрации';
      const state = authReducer(
        { ...initialState, isLoading: true },
        registerUser.rejected(
          new Error(errorMessage),
          '',
          registerData,
          errorMessage
        )
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('logoutUser', () => {
    it('должен установить isLoading в true при pending', () => {
      const state = authReducer(
        { ...initialState, data: mockUser },
        logoutUser.pending('', undefined)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен очистить данные пользователя при fulfilled', () => {
      const state = authReducer(
        { ...initialState, data: mockUser, isLoading: true },
        logoutUser.fulfilled(null, '', undefined)
      );

      expect(state.isLoading).toBe(false);
      expect(state.data).toBeNull();
    });

    it('должен записать ошибку при rejected', () => {
      const errorMessage = 'Ошибка выхода';
      const state = authReducer(
        { ...initialState, data: mockUser, isLoading: true },
        logoutUser.rejected(
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

  describe('updateUser', () => {
    const updateData = { name: 'Updated User' };

    it('должен установить isLoading в true при pending', () => {
      const state = authReducer(
        { ...initialState, data: mockUser },
        updateUser.pending('', updateData)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен обновить данные пользователя при fulfilled', () => {
      const updatedUser = { ...mockUser, name: 'Updated User' };
      const state = authReducer(
        { ...initialState, data: mockUser, isLoading: true },
        updateUser.fulfilled(updatedUser, '', updateData)
      );

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(updatedUser);
    });

    it('должен записать ошибку при rejected', () => {
      const errorMessage = 'Ошибка обновления профиля';
      const state = authReducer(
        { ...initialState, data: mockUser, isLoading: true },
        updateUser.rejected(
          new Error(errorMessage),
          '',
          updateData,
          errorMessage
        )
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
