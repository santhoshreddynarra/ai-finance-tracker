import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchBudget = createAsyncThunk("budget/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/budgets");
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch budget");
  }
});

export const upsertBudget = createAsyncThunk("budget/upsert", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post("/budgets", formData);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to save budget");
  }
});

const budgetSlice = createSlice({
  name: "budget",
  initialState: {
    data: {
      monthlyBudget: 0,
      categoryBudgets: [],
    },
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
      .addCase(fetchBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upsert
      .addCase(upsertBudget.pending, (state) => {
        state.error = null;
      })
      .addCase(upsertBudget.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(upsertBudget.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearBudgetError } = budgetSlice.actions;
export default budgetSlice.reducer;
