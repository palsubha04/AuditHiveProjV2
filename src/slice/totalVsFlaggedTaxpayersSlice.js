
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/axios.config';

// Accept parameters for dynamic end_date and tin
export const fetchTotalVsFlaggedTaxpayers = createAsyncThunk(
  'totalVsFlaggedTaxpayers/fetch',
  async ({ start_date, end_date }) => {
    const response = await api.get(
      `/analytics/risk-assessment/total-vs-flagged-taxpayers?start_date=${start_date}&end_date=${end_date}`
    );
    return response.data;
  }
);

const totalVsFlaggedTaxpayersSlice = createSlice({
  name: 'totalVsFlaggedTaxpayers',
  initialState: {
    totalVsFlaggedTaxpayersData: null,
    totalVsFlaggedTaxpayersLoading: false,
    totalVsFlaggedTaxpayersError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalVsFlaggedTaxpayers.pending, (state) => {
        state.totalVsFlaggedTaxpayersLoading = true;
        state.totalVsFlaggedTaxpayersError = null;
      })
      .addCase(fetchTotalVsFlaggedTaxpayers.fulfilled, (state, action) => {
        state.totalVsFlaggedTaxpayersLoading = false;
        state.totalVsFlaggedTaxpayersData = action.payload;
      })
      .addCase(fetchTotalVsFlaggedTaxpayers.rejected, (state, action) => {
        state.totalVsFlaggedTaxpayersLoading = false;
        state.totalVsFlaggedTaxpayersError = action.error.message;
      });
  },
});

export default totalVsFlaggedTaxpayersSlice.reducer;
