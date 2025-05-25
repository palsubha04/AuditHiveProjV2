import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/axios.config";

// Accept parameters for dynamic end_date and tin
export const fetchFraudRulesAnomaly = createAsyncThunk(
  "fraudRulesAnomalyFrequency/fetch",
  async ({ start_date, end_date }) => {
    const response = await api.get(
      `analytics/fraudRules-assessment/fraud-rule-anomalies?start_date=${start_date}&end_date=${end_date}`
    );
    return response.data;
  }
);

const fraudRulesAnomalyFrequencySlice = createSlice({
  name: "fraudRulesAnomalyFrequency",
  initialState: {
    fraudRulesAnomalyFrequencyData: null,
    fraudRulesAnomalyFrequencyLoading: false,
    fraudRulesAnomalyFrequencyError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFraudRulesAnomaly.pending, (state) => {
        state.fraudRulesAnomalyFrequencyLoading = true;
        state.monthlySalesError = null;
      })
      .addCase(fetchFraudRulesAnomaly.fulfilled, (state, action) => {
        state.fraudRulesAnomalyFrequencyLoading = false;
        state.fraudRulesAnomalyFrequencyData = action.payload;
      })
      .addCase(fetchFraudRulesAnomaly.rejected, (state, action) => {
        state.fraudRulesAnomalyFrequencyLoading = false;
        state.fraudRulesAnomalyFrequencyError = action.error.message;
      });
  },
});

export default fraudRulesAnomalyFrequencySlice.reducer;
