import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios.config";

// Accept parameters for dynamic end_date and tin
export const fetchFrequencyOfAnomalyProfiling = createAsyncThunk(
  "frequencyOfAnomalyProfiling/fetch",
  async ({ start_date, end_date, tin }) => {
    const response = await api.get(
      `/analytics/risk-assessment/fraud-rule-anomalies?start_date=${start_date}&end_date=${end_date}&tin=${tin}`
    );
    return response.data;
  }
);

const frequencyOfAnomalyProfilingSlice = createSlice({
  name: "frequencyOfAnomalyProfiling",
  initialState: {
    frequencyOfAnomalyProfilingData: null,
    frequencyOfAnomalyProfilingLoading: false,
    frequencyOfAnomalyProfilingError: null,
  },
  reducers: {
    resetFrequencyOfAnomalyProfiling: (state) => {
      state.frequencyOfAnomalyProfilingData = null;
      state.frequencyOfAnomalyProfilingLoading = false;
      state.frequencyOfAnomalyProfilingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFrequencyOfAnomalyProfiling.pending, (state) => {
        state.frequencyOfAnomalyProfilingLoading = true;
        state.frequencyOfAnomalyProfilingError = null;
      })
      .addCase(fetchFrequencyOfAnomalyProfiling.fulfilled, (state, action) => {
        state.frequencyOfAnomalyProfilingLoading = false;
        state.frequencyOfAnomalyProfilingData = action.payload;
      })
      .addCase(fetchFrequencyOfAnomalyProfiling.rejected, (state, action) => {
        state.frequencyOfAnomalyProfilingLoading = false;
        state.frequencyOfAnomalyProfilingError = action.error.message;
      });
  },
});

export const { resetFrequencyOfAnomalyProfiling } =
  frequencyOfAnomalyProfilingSlice.actions;

export default frequencyOfAnomalyProfilingSlice.reducer;
