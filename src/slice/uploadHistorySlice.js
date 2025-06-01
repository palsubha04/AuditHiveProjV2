import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/axios.config';

export const fetchUploadHistory = createAsyncThunk(
  'uploadHistory/fetch',
  async ({ cursor = null } = {}) => {
    let url = '/audit-history';
    if (cursor) {
      url += `?cursor=${encodeURIComponent(cursor)}`;
    }
    const response = await api.get(url);
    return response.data;
  }
);

const uploadHistorySlice = createSlice({
  name: 'uploadHistory',
  initialState: { data: { results: [], cursor: null, total_data_count: 0 }, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUploadHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUploadHistory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg && action.meta.arg.cursor) {
          // Append results for infinite scroll
          state.data.results = [...state.data.results, ...action.payload.results];
        } else {
          // First page or refresh
          state.data.results = action.payload.results;
        }
        state.data.cursor = action.payload.cursor;
        state.data.total_data_count = action.payload.total_data_count;
      })
      .addCase(fetchUploadHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default uploadHistorySlice.reducer;
