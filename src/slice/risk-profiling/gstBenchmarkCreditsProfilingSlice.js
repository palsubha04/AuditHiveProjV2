import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios.config";

// Accept parameters for dynamic end_date and tin
export const fetchGstBenchmarkCreditsProfiling = createAsyncThunk(
  "gstBenchmarkCreditsProfiling/fetch",
  async ({ start_date, end_date, tin }) => {
    const response = await api.get(
      `/analytics/compliance/benchmark/input_credits_vs_output_debits/${tin}?start_date=${start_date}&end_date=${end_date}`
    );
    return response.data;
  }
);

const gstBenchmarkCreditsProfilingSlice = createSlice({
  name: "gstBenchmarkCreditsProfiling",
  initialState: {
    gstBenchmarkCreditsProfilingData: null,
    gstBenchmarkCreditsProfilingLoading: false,
    gstBenchmarkCreditsProfilingError: null,
  },
  reducers: {
    // Add the reset reducer here
    resetGstBenchmarkCreditsProfiling: (state) => {
      state.gstBenchmarkCreditsProfilingData = null;
      state.gstBenchmarkCreditsProfilingLoading = false;
      state.gstBenchmarkCreditsProfilingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGstBenchmarkCreditsProfiling.pending, (state) => {
        state.gstBenchmarkCreditsProfilingLoading = true;
        state.gstBenchmarkCreditsProfilingError = null;
      })
      .addCase(fetchGstBenchmarkCreditsProfiling.fulfilled, (state, action) => {
        state.gstBenchmarkCreditsProfilingLoading = false;
        state.gstBenchmarkCreditsProfilingData = action.payload;
      })
      .addCase(fetchGstBenchmarkCreditsProfiling.rejected, (state, action) => {
        state.gstBenchmarkCreditsProfilingLoading = false;
        state.gstBenchmarkCreditsProfilingError = action.error.message;
      });
  },
});

// Export the new action creator
export const { resetGstBenchmarkCreditsProfiling } =
  gstBenchmarkCreditsProfilingSlice.actions;

export default gstBenchmarkCreditsProfilingSlice.reducer;
