import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchBudgets = createAsyncThunk("budgets/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/budgets");
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch budgets");
  }
});

export const upsertBudget = createAsyncThunk("budgets/upsert", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post("/budgets", formData);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to save budget");
  }
});

export const removeBudget = createAsyncThunk("budgets/remove", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/budgets/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete budget");
  }
});

const budgetSlice = createSlice({
  name: "budgets",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBudgetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upsert
      .addCase(upsertBudget.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      // Remove
      .addCase(removeBudget.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  },
});

export const { clearBudgetError } = budgetSlice.actions;
export default budgetSlice.reducer;
