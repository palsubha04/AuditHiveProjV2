import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/axios.config";

// Accept parameters for dynamic end_date and tin
export const fetchRiskAnomaly = createAsyncThunk(
  "riskAnomalyFrequency/fetch",
  async ({ start_date, end_date }) => {
    const response = await api.get(
      `/analytics/risk-assessment/fraud-rule-anomalies?start_date=${start_date}&end_date=${end_date}`
    );
    return response.data;
  }
);

const riskAnomalyFrequencySlice = createSlice({
  name: "riskAnomalyFrequency",
  initialState: {
    riskAnomalyFrequencyData: null,
    riskAnomalyFrequencyLoading: false,
    riskAnomalyFrequencyError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiskAnomaly.pending, (state) => {
        state.riskAnomalyFrequencyLoading = true;
        state.monthlySalesError = null;
      })
      .addCase(fetchRiskAnomaly.fulfilled, (state, action) => {
        state.riskAnomalyFrequencyLoading = false;
        state.riskAnomalyFrequencyData = action.payload;
      })
      .addCase(fetchRiskAnomaly.rejected, (state, action) => {
        state.riskAnomalyFrequencyLoading = false;
        state.riskAnomalyFrequencyError = action.error.message;
      });
  },
});

export default riskAnomalyFrequencySlice.reducer;
