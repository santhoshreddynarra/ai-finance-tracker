import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchDashboardData = createAsyncThunk("dashboard/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/analytics/dashboard");
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch dashboard data");
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: {
      summary: null,
      categoryBreakdown: [],
      monthlyTrend: [],
      recentTransactions: [],
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
