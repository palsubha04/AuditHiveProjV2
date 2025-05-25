import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/axios.config';

// Accept parameters for dynamic end_date and tin
export const fetchRiskBreakdownByCategory = createAsyncThunk(
  'riskBreakdownByCategory/fetch',
  async ({ start_date, end_date }) => {
    console.log('start_date', start_date);
    console.log('end_date', end_date);
    const response = await api.get(
      `/analytics/risk-assessment/risk-breakdown-by-category?start_date=${start_date}&end_date=${end_date}`
    );
    console.log('response', response);
    return response.data;
  }
);

const riskBreakdownByCategorySlice = createSlice({
  name: 'riskBreakdownByCategory',
  initialState: {
    riskBreakdownByCategoryData: null,
    riskBreakdownByCategoryLoading: false,
    riskBreakdownByCategoryError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiskBreakdownByCategory.pending, (state) => {
        state.riskBreakdownByCategoryLoading = true;
        state.riskBreakdownByCategoryError = null;
      })
      .addCase(fetchRiskBreakdownByCategory.fulfilled, (state, action) => {
        state.riskBreakdownByCategoryLoading = false;
        state.riskBreakdownByCategoryData = action.payload;
      })
      .addCase(fetchRiskBreakdownByCategory.rejected, (state, action) => {
        state.riskBreakdownByCategoryLoading = false;
        state.riskBreakdownByCategoryError = action.error.message;
      });
  },
});

export default riskBreakdownByCategorySlice.reducer;
