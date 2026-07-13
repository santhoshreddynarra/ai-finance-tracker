import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ─── Helpers ───────────────────────────────────────────────────────────────
const loadFromStorage = () => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
});

const persistAuth = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

const clearAuth = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// ─── Thunks ────────────────────────────────────────────────────────────────

/**
 * Register a new user account.
 * Auto-logs in on success by storing token + user.
 */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/signup", formData);
      persistAuth(data.user, data.token);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  }
);

/**
 * Log in an existing user.
 * Stores token + user in localStorage on success.
 */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", formData);
      persistAuth(data.user, data.token);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────
const { user: storedUser, token: storedToken } = loadFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    token: storedToken,
    loading: false,
    error: null,
  },
  reducers: {
    /**
     * Clear auth state and remove persisted data.
     */
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      clearAuth();
    },
    /**
     * Manually clear any error message (e.g., when the form input changes).
     */
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Register ────────────────────────────────
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Login ───────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
