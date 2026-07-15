import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchAiInsights = createAsyncThunk("ai/fetchInsights", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/ai/insights");
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch AI insights");
  }
});

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAiInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAiInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAiInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default aiSlice.reducer;
