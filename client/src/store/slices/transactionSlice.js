import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ─── Thunks ────────────────────────────────────────────────────────────────

// Get Transactions (with filters/pagination)
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/transactions", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch transactions");
    }
  }
);

// Add Transaction
export const addTransaction = createAsyncThunk(
  "transactions/add",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/transactions", formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add transaction");
    }
  }
);

// Update Transaction
export const editTransaction = createAsyncThunk(
  "transactions/edit",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/transactions/${id}`, formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update transaction");
    }
  }
);

// Delete Transaction
export const removeTransaction = createAsyncThunk(
  "transactions/remove",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/transactions/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete transaction");
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────────────

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    items: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      totalPages: 1,
      totalCount: 0,
    },
    filters: {
      search: "",
      type: "",
      category: "",
      sort: "newest",
    },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage(state, action) {
      state.pagination.page = action.payload;
    },
    clearTransactionError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination.page = action.payload.page;
        state.pagination.totalPages = action.payload.totalPages;
        state.pagination.totalCount = action.payload.total;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false;
        // Prepend to items list or we can re-fetch. Since we prepend, we might exceed limit locally,
        // but it gives immediate feedback. We will usually refetch from the component anyway.
        state.items.unshift(action.payload.data); 
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit
      .addCase(editTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(t => t._id === action.payload.data._id);
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
      })
      .addCase(editTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove
      .addCase(removeTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(t => t._id !== action.payload);
      })
      .addCase(removeTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, setPage, clearTransactionError } = transactionSlice.actions;
export default transactionSlice.reducer;
