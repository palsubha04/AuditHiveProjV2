import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios.config";

// Accept parameters for dynamic end_date and tin
export const fetchDelayedFiling = createAsyncThunk(
  "delayedFiling/fetch",
  async ({ start_date, end_date, tin }) => {
    const response = await api.get(
      `analytics/compliance/benchmark/monthwise_delay_status/${tin}?start_date=${start_date}&end_date=${end_date}`
    );
    return response.data;
  }
);

const delayedFilingSlice = createSlice({
  name: "delayedFiling",
  initialState: {
    delayedFilingData: null,
    delayedFilingLoading: false,
    delayedFilingError: null,
  },
  reducers: {
    // Add the reset reducer here
    resetDelayedFiling: (state) => {
      state.delayedFilingData = null;
      state.delayedFilingLoading = false;
      state.delayedFilingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDelayedFiling.pending, (state) => {
        state.delayedFilingLoading = true;
        state.delayedFilingError = null;
      })
      .addCase(fetchDelayedFiling.fulfilled, (state, action) => {
        state.delayedFilingLoading = false;
        state.delayedFilingData = action.payload;
      })
      .addCase(fetchDelayedFiling.rejected, (state, action) => {
        state.delayedFilingLoading = false;
        state.delayedFilingError = action.error.message;
      });
  },
});

// Export the new action creator
export const { resetDelayedFiling } = delayedFilingSlice.actions;

export default delayedFilingSlice.reducer;
