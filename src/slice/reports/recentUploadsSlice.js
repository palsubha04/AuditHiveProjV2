import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/axios.config';

// Accept parameters for dynamic end_date and tin
export const fetchRecentUploads = createAsyncThunk(
  'recentUploads/fetch',
  async ({ tax_type, cursor }, { rejectWithValue }) => {
    try {
      const url = cursor
        ? `/recent-upload?tax_type=${tax_type}&cursor=${cursor}`
        : `/recent-upload?tax_type=${tax_type}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const recentUploadsSlice = createSlice({
  name: 'recentUploads',
  initialState: {
    recentUploadsData: null,
    recentUploadsLoading: false,
    recentUploadsError: null,
    cursor: null,
    records: [],
    hasMore: true,
  },
  reducers: {
    resetRecentUploads: (state) => {
      state.recentUploadsData = null;
      state.cursor = null;
      state.records = [];
      state.hasMore = true;
      state.recentUploadsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentUploads.pending, (state) => {
        state.recentUploadsLoading = true;
        state.recentUploadsError = null;
      })
      .addCase(fetchRecentUploads.fulfilled, (state, action) => {
        state.recentUploadsLoading = false;
        state.recentUploadsData = action.payload;
        state.cursor = action.payload.cursor;
        if (action.meta.arg.cursor) {
          // Append for next pages
          state.records = [...state.records, ...(action.payload.records || [])];
        } else {
          // First page
          state.records = action.payload.records || [];
        }
        state.hasMore = !!action.payload.cursor;
      })
      .addCase(fetchRecentUploads.rejected, (state, action) => {
        state.recentUploadsLoading = false;
        state.recentUploadsError = action.payload || action.error.message;
      });
  },
});

export const { resetRecentUploads } = recentUploadsSlice.actions;
export default recentUploadsSlice.reducer;
