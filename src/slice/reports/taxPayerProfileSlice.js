import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/axios.config';

// Accept parameters for dynamic end_date and tin
export const fetchTaxPayerProfile = createAsyncThunk(
  'taxPayerProfile/fetch',
  async ({ tax_type, start_date, end_date, cursor }, { rejectWithValue }) => {
    try {
      const url = cursor
        ? `/reports/generate-fraud-records?tax_type=${tax_type}&start_date=${start_date}&end_date=${end_date}&cursor=${cursor}`
        : `/reports/generate-fraud-records?tax_type=${tax_type}&start_date=${start_date}&end_date=${end_date}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const taxPayerProfileSlice = createSlice({
  name: 'taxPayerProfile',
  initialState: {
    taxPayerProfileData: null,
    taxPayerProfileLoading: false,
    taxPayerProfileError: null,
    cursor: null,
    results: [],
    hasMore: true,
  },
  reducers: {
    resetTaxPayerProfile: (state) => {
      state.taxPayerProfileData = null;
      state.cursor = null;
      state.results = [];
      state.hasMore = true;
      state.taxPayerProfileError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxPayerProfile.pending, (state) => {
        state.taxPayerProfileLoading = true;
        state.taxPayerProfileError = null;
      })
      .addCase(fetchTaxPayerProfile.fulfilled, (state, action) => {
        state.taxPayerProfileLoading = false;
        state.taxPayerProfileData = action.payload;
        state.cursor = action.payload.cursor;
        if (action.meta.arg.cursor) {
          // Append for next pages
          state.results = [...state.results, ...(action.payload.results || [])];
        } else {
          // First page
          state.results = action.payload.results || [];
        }
        state.hasMore = !!action.payload.cursor;
      })
      .addCase(fetchTaxPayerProfile.rejected, (state, action) => {
        state.taxPayerProfileLoading = false;
        state.taxPayerProfileError = action.payload || action.error.message;
      });
  },
});

export const { resetTaxPayerProfile } = taxPayerProfileSlice.actions;
export default taxPayerProfileSlice.reducer;
