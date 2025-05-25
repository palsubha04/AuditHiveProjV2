import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/axios.config';

export const fetchGstPayableVsRefundable = createAsyncThunk(
  'gstPayableVsRefundable/fetch',
  async ({ start_date, end_date, tin }) => {
    const response = await api.get(
      `dashboard/gst/payable-vs-refundable-summary?start_date=${start_date}&end_date=${end_date}&tin=${tin}`
    );
    return response.data;
  }
);

const gstPayableVsRefundableSlice = createSlice({
  name: 'gstPayableVsRefundable',
  initialState: {
    gstData: null,
    gstLoading: false,
    gstError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGstPayableVsRefundable.pending, (state) => {
        state.gstLoading = true;
        state.gstError = null;
      })
      .addCase(fetchGstPayableVsRefundable.fulfilled, (state, action) => {
        state.gstLoading = false;
        state.gstData = action.payload;
      })
      .addCase(fetchGstPayableVsRefundable.rejected, (state, action) => {
        state.gstLoading = false;
        state.gstError = action.error.message;
      });
  },
});

export default gstPayableVsRefundableSlice.reducer;
