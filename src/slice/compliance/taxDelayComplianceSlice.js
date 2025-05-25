import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios.config";

// Accept parameters for dynamic end_date and tin
export const fetchTaxDelayCompliance = createAsyncThunk(
  "taxDelayCompliance/fetch",
  async ({ start_date, end_date }) => {
    console.log("start_date", start_date);
    console.log("end_date", end_date);

    const response = await api.get(
      `/analytics/compliance/benchmark/tax_delay_vs_non_time_delay?start_date=${start_date}&end_date=${end_date}`
    );
    console.log("response", response);
    return response.data;
  }
);

const taxDelayComplianceSlice = createSlice({
  name: "taxDelayCompliance",
  initialState: {
    taxDelayComplianceData: null,
    taxDelayComplianceLoading: false,
    taxDelayComplianceError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxDelayCompliance.pending, (state) => {
        state.taxDelayComplianceLoading = true;
        state.taxDelayComplianceError = null;
      })
      .addCase(fetchTaxDelayCompliance.fulfilled, (state, action) => {
        state.taxDelayComplianceLoading = false;
        state.taxDelayComplianceData = action.payload;
      })
      .addCase(fetchTaxDelayCompliance.rejected, (state, action) => {
        state.taxDelayComplianceLoading = false;
        state.taxDelayComplianceError = action.error.message;
      });
  },
});

export default taxDelayComplianceSlice.reducer;
