import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/axios.config';

export const fetchtaxPayersDetails = createAsyncThunk(
  'taxPayersDetails/fetch',
  async ({ start_date, end_date, tin }) => {
    const response = await api.get(
      `analytics/compliance?start_date=${start_date}&end_date=${end_date}&tin=${tin}`
    );
    return response.data;
  }
);

const taxPayersDetailsSlice = createSlice({
  name: 'taxPayersDetails',
  initialState: {
    taxPayersData: null,
    taxPayersLoading: false,
    taxPayersError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchtaxPayersDetails.pending, (state) => {
        state.taxPayersLoading = true;
        state.taxPayersError = null;
      })
      .addCase(fetchtaxPayersDetails.fulfilled, (state, action) => {
        state.taxPayersLoading = false;
        state.taxPayersData = action.payload;
      })
      .addCase(fetchtaxPayersDetails.rejected, (state, action) => {
        state.taxPayersLoading = false;
        state.taxPayersError = action.error.message;
      });
  },
});

export default taxPayersDetailsSlice.reducer;
