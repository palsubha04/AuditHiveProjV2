import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/axios.config';

// Accept parameters for dynamic end_date and tin
export const fetchSalesComparison = createAsyncThunk(
  'salesComparison/fetch',
  async ({ start_date, end_date, tin }) => {
    const response = await api.get(
      `/dashboard/gst/sales-comparison?start_date=${start_date}&end_date=${end_date}&tin=${tin}`
    );
    return response.data;
  }
);

const salesComparisonSlice = createSlice({
  name: 'salesComparison',
  initialState: {
    monthlySalesData: null,
    monthlySalesLoading: false,
    monthlySalesError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesComparison.pending, (state) => {
        state.monthlySalesLoading = true;
        state.monthlySalesError = null;
      })
      .addCase(fetchSalesComparison.fulfilled, (state, action) => {
        state.monthlySalesLoading = false;
        state.monthlySalesData = action.payload;
      })
      .addCase(fetchSalesComparison.rejected, (state, action) => {
        state.monthlySalesLoading = false;
        state.monthlySalesError = action.error.message;
      });
  },
});

export default salesComparisonSlice.reducer;
