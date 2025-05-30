import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios.config";

// Accept parameters for dynamic end_date and tin
export const fetchCitBenchmarkProfiling = createAsyncThunk(
  "citBenchmarkProfiling/fetch",
  async ({ start_date, end_date, tin }) => {
    const response = await api.get(
      `/analytics/compliance/benchmark/cit_payable_vs_cit_refundable/${tin}?start_date=${start_date}&end_date=${end_date}`
    );
    return response.data;
  }
);

const citBenchmarkProfilingSlice = createSlice({
  name: "citBenchmarkProfiling",
  initialState: {
    citBenchmarkProfilingData: null,
    citBenchmarkProfilingLoading: false,
    citBenchmarkProfilingError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCitBenchmarkProfiling.pending, (state) => {
        state.citBenchmarkProfilingLoading = true;
        state.citBenchmarkProfilingError = null;
      })
      .addCase(fetchCitBenchmarkProfiling.fulfilled, (state, action) => {
        state.citBenchmarkProfilingLoading = false;
        state.citBenchmarkProfilingData = action.payload;
      })
      .addCase(fetchCitBenchmarkProfiling.rejected, (state, action) => {
        state.citBenchmarkProfilingLoading = false;
        state.citBenchmarkProfilingError = action.error.message;
      });
  },
});

export default citBenchmarkProfilingSlice.reducer;
