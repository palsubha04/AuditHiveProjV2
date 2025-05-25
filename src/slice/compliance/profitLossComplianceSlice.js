import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios.config";

// Accept parameters for dynamic end_date and tin
export const fetchProfitLossCompliance = createAsyncThunk(
  "profitLossCompliance/fetch",
  async ({ start_date, end_date }) => {
    console.log("start_date", start_date);
    console.log("end_date", end_date);

    const response = await api.get(
      `/analytics/compliance/benchmark/cit_payable_vs_cit_refundable/?start_date=${start_date}&end_date=${end_date}`
    );
    console.log("response", response);
    return response.data;
  }
);

const profitLossComplianceSlice = createSlice({
  name: "profitLossCompliance",
  initialState: {
    profitLossComplianceData: null,
    profitLossComplianceLoading: false,
    profitLossComplianceError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfitLossCompliance.pending, (state) => {
        state.profitLossComplianceLoading = true;
        state.profitLossComplianceError = null;
      })
      .addCase(fetchProfitLossCompliance.fulfilled, (state, action) => {
        state.profitLossComplianceLoading = false;
        state.profitLossComplianceData = action.payload;
      })
      .addCase(fetchProfitLossCompliance.rejected, (state, action) => {
        state.profitLossComplianceLoading = false;
        state.profitLossComplianceError = action.error.message;
      });
  },
});

export default profitLossComplianceSlice.reducer;
