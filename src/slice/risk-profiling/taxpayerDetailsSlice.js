import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios.config";

// Accept parameters for dynamic end_date and tin
export const fetchTaxpayerDetails = createAsyncThunk(
  "taxpayerDetails/fetch",
  async ({ tin }) => {
    const response = await api.get(
      `analytics/tins/${tin}`
    );
    return response.data;
  }
);

const taxpayerDetailsSlice = createSlice({
  name: "taxpayerDetails",
  initialState: {
    taxpayerDetailsData: null,
    taxpayerDetailsLoading: false,
    taxpayerDetailsError: null,
  },
  reducers: {
     // Add the reset reducer here
     resetTaxperDetails: (state) => {
        state.taxpayerDetailsData = null;
        state.taxpayerDetailsLoading = false;
        state.taxpayerDetailsError = null;
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxpayerDetails.pending, (state) => {
        state.taxpayerDetailsLoading = true;
        state.taxpayerDetailsError = null;
      })
      .addCase(fetchTaxpayerDetails.fulfilled, (state, action) => {
        state.taxpayerDetailsLoading = false;
        state.taxpayerDetailsData = action.payload;
      })
      .addCase(fetchTaxpayerDetails.rejected, (state, action) => {
        state.taxpayerDetailsLoading = false;
        state.taxpayerDetailsError = action.error.message;
      });
  },
});

export const { resetTaxperDetails } = taxpayerDetailsSlice.actions;
export default taxpayerDetailsSlice.reducer;
