import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios.config";

// Accept parameters for dynamic end_date and tin
export const fetchGstBenchmarkProfiling = createAsyncThunk(
  "gstBenchmarkProfiling/fetch",
  async ({ start_date, end_date, tin }) => {
    const response = await api.get(
      `/analytics/compliance/benchmark/gst_payable_vs_gst_refundable/${tin}?start_date=${start_date}&end_date=${end_date}`
    );
    return response.data;
  }
);

const gstBenchmarkProfilingSlice = createSlice({
  name: "gstBenchmarkProfiling",
  initialState: {
    gstBenchmarkProfilingData: null,
    gstBenchmarkProfilingLoading: false,
    gstBenchmarkProfilingError: null,
  },
  reducers: {
    // Add the reset reducer here
    resetGstBenchmarkProfiling: (state) => {
      state.gstBenchmarkProfilingData = null;
      state.gstBenchmarkProfilingLoading = false;
      state.gstBenchmarkProfilingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGstBenchmarkProfiling.pending, (state) => {
        state.gstBenchmarkProfilingLoading = true;
        state.gstBenchmarkProfilingError = null;
      })
      .addCase(fetchGstBenchmarkProfiling.fulfilled, (state, action) => {
        state.gstBenchmarkProfilingLoading = false;
        state.gstBenchmarkProfilingData = action.payload;
      })
      .addCase(fetchGstBenchmarkProfiling.rejected, (state, action) => {
        state.gstBenchmarkProfilingLoading = false;
        state.gstBenchmarkProfilingError = action.error.message;
      });
  },
});

// Export the new action creator
export const { resetGstBenchmarkProfiling } =
  gstBenchmarkProfilingSlice.actions;

export default gstBenchmarkProfilingSlice.reducer;
