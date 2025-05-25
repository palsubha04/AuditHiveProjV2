import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/axios.config';

// Accept parameters for dynamic end_date and tin
export const fetchRiskAnalysis = createAsyncThunk(
  'riskAnalysisByIndustry/fetch',
  async ({ start_date, end_date }) => {
    const response = await api.get(
      `analytics/risk-assessment/risk-breakdown-by-industry?start_date=${start_date}&end_date=${end_date}`
    );
    return response.data;
  }
);

const riskAnalysisByIndustrySlice = createSlice({
  name: 'riskAnalysisByIndustry',
  initialState: {
    riskAnalysisData: null,
    riskAnalysisLoading: false,
    riskAnalysisError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiskAnalysis.pending, (state) => {
        state.riskAnalysisLoading = true;
        state.monthlySalesError = null;
      })
      .addCase(fetchRiskAnalysis.fulfilled, (state, action) => {
        state.riskAnalysisLoading = false;
        state.riskAnalysisData = action.payload;
      })
      .addCase(fetchRiskAnalysis.rejected, (state, action) => {
        state.riskAnalysisLoading = false;
        state.riskAnalysisError = action.error.message;
      });
  },
});

export default riskAnalysisByIndustrySlice.reducer;