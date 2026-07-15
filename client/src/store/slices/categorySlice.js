import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchCategories = createAsyncThunk("categories/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/categories");
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
  }
});

export const addCategory = createAsyncThunk("categories/add", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post("/categories", formData);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to add category");
  }
});

export const editCategory = createAsyncThunk("categories/edit", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/categories/${id}`, formData);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update category");
  }
});

export const removeCategory = createAsyncThunk("categories/remove", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/categories/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete category");
  }
});

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Edit
      .addCase(editCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Remove
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
