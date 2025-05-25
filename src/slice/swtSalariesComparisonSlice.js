import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/axios.config';

export const fetchswtSalariesComparison = createAsyncThunk(
  'swtSalariesComparison/fetch',
  async ({ start_date, end_date, tin }) => {
    const response = await api.get(
      `dashboard/swt/salaries-comparison?start_date=${start_date}&end_date=${end_date}&tin=${tin}`
    );
    return response.data;
  }
);

const swtSalariesComparisonSlice = createSlice({
  name: 'swtSalariesComparison',
  initialState: {
    swtSalariesComparisonData: null,
    swtSalariesComparisonLoading: false,
    swtSalariesComparisonError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchswtSalariesComparison.pending, (state) => {
        state.swtSalariesComparisonLoading = true;
        state.swtSalariesComparisonError = null;
      })
      .addCase(fetchswtSalariesComparison.fulfilled, (state, action) => {
        state.swtSalariesComparisonLoading = false;
        state.swtSalariesComparisonData = action.payload;
      })
      .addCase(fetchswtSalariesComparison.rejected, (state, action) => {
        state.swtSalariesComparisonLoading = false;
        state.swtSalariesComparisonError = action.error.message;
      });
  },
});

export default swtSalariesComparisonSlice.reducer;
