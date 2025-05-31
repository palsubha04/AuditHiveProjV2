import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/axios.config';

// Accept parameters for dynamic end_date and tin
export const fetchRecentUploads = createAsyncThunk(
  'recentUploads/fetch',
  async ({ tax_type }) => {
    // console.log('tax_type: ', tax_type);
    const response = await api.get(`/recent-upload?tax_type=${tax_type}`);
    return response.data;
  }
);

const recentUploadsSlice = createSlice({
  name: 'recentUploads',
  initialState: {
    recentUploadsData: null,
    recentUploadsLoading: false,
    recentUploadsError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentUploads.pending, (state) => {
        state.recentUploadsLoading = true;
        state.recentUploadsError = null;
      })
      .addCase(fetchRecentUploads.fulfilled, (state, action) => {
        state.recentUploadsLoading = false;
        state.recentUploadsData = action.payload;
      })
      .addCase(fetchRecentUploads.rejected, (state, action) => {
        state.recentUploadsLoading = false;
        state.recentUploadsError = action.error.message;
      });
  },
});

export default recentUploadsSlice.reducer;
