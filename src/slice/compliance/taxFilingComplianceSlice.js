import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios.config";

// Accept parameters for dynamic end_date and tin
export const fetchTaxFilingCompliance = createAsyncThunk(
  "taxFilingCompliance/fetch",
  async ({ start_date, end_date }) => {
    const response = await api.get(
      `/dashboard/tax-filing-vs-non-filing?start_date=${start_date}&end_date=${end_date}`
    );
    return response.data;
  }
);

const taxFilingComplianceSlice = createSlice({
  name: "taxFilingCompliance",
  initialState: {
    taxFilingComplianceData: null,
    taxFilingComplianceLoading: false,
    taxFilingComplianceError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxFilingCompliance.pending, (state) => {
        state.taxFilingComplianceLoading = true;
        state.taxFilingComplianceError = null;
      })
      .addCase(fetchTaxFilingCompliance.fulfilled, (state, action) => {
        state.taxFilingComplianceLoading = false;
        state.taxFilingComplianceData = action.payload;
      })
      .addCase(fetchTaxFilingCompliance.rejected, (state, action) => {
        state.taxFilingComplianceLoading = false;
        state.taxFilingComplianceError = action.error.message;
      });
  },
});

export default taxFilingComplianceSlice.reducer;
