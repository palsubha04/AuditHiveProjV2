import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios.config";

// Accept parameters for dynamic end_date and tin
export const fetchRiskBreakdownByCategoryProfiling = createAsyncThunk(
  "riskBreakdownByCategoryProfiling/fetch",
  async ({ start_date, end_date, tin }) => {
    console.log("start_date", start_date);
    console.log("end_date", end_date);
    console.log("tin", tin);
    const response = await api.get(
      `analytics/risk-profiling/risk-category/${tin}?start_date=${start_date}&end_date=${end_date}`
    );
    console.log("risk breakdown response", response);
    return response.data;
  }
);

const riskBreakdownByCategoryProfilingSlice = createSlice({
  name: "riskBreakdownByCategoryProfiling",
  initialState: {
    riskBreakdownByCategoryProfilingData: null,
    riskBreakdownByCategoryProfilingLoading: false,
    riskBreakdownByCategoryProfilingError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiskBreakdownByCategoryProfiling.pending, (state) => {
        state.riskBreakdownByCategoryProfilingLoading = true;
        state.riskBreakdownByCategoryProfilingError = null;
      })
      .addCase(fetchRiskBreakdownByCategoryProfiling.fulfilled, (state, action) => {
        state.riskBreakdownByCategoryProfilingLoading = false;
        state.riskBreakdownByCategoryProfilingData = action.payload;
      })
      .addCase(fetchRiskBreakdownByCategoryProfiling.rejected, (state, action) => {
        state.riskBreakdownByCategoryProfilingLoading = false;
        state.riskBreakdownByCategoryProfilingError = action.error.message;
      });
  },
});

export default riskBreakdownByCategoryProfilingSlice.reducer;
