import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

type TAuthState = {
  data: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthChecked: boolean;
};

const initialState: TAuthState = {
  data: null,
  isLoading: false,
  error: null,
  isAuthChecked: false
};

const persistAuth = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearAuth = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { rejectWithValue }) => {
    if (!getCookie('accessToken')) {
      return null;
    }

    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      clearAuth();
      return rejectWithValue(
        (error as Error).message || 'Не удалось получить пользователя'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(payload);
      persistAuth(response.accessToken, response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Ошибка авторизации');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(payload);
      persistAuth(response.accessToken, response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Ошибка регистрации');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      clearAuth();
      return null;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Ошибка выхода');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (payload: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(payload);
      return response.user;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Ошибка обновления профиля'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.data = null;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Ошибка проверки авторизации';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Ошибка авторизации';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Ошибка регистрации';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.data = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Ошибка выхода';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Ошибка обновления профиля';
      });
  }
});

export const { clearAuthError } = authSlice.actions;
export const authReducer = authSlice.reducer;
