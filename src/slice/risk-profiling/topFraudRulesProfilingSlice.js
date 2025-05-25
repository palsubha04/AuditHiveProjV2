import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios.config";

// Accept parameters for dynamic end_date and tin
export const fetchTopFraudRulesProfiling = createAsyncThunk(
  "fetchTopFraudRulesProfiling/fetch",
  async ({ start_date, end_date, taxType, segmentation }) => {
    
    const response = await api.get(
      `/analytics/compliance/table?tax_type=${taxType}&segmentation=${segmentation}&start_date=${start_date}&end_date=${end_date}`
    );
    console.log("response", response);
    return response.data;
  }
);

const topFraudRulesProfilingSlice = createSlice({
  name: "topFraudRulesProfiling",
  initialState: {
    topFraudRulesProfilingData: null,
    topFraudRulesProfilingLoading: false,
    topFraudRulesProfilingError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopFraudRulesProfiling.pending, (state) => {
        state.topFraudRulesProfilingLoading = true;
        state.topFraudRulesProfilingError = null;
      })
      .addCase(fetchTopFraudRulesProfiling.fulfilled, (state, action) => {
        state.topFraudRulesProfilingLoading = false;
        state.topFraudRulesProfilingData = action.payload;
      })
      .addCase(fetchTopFraudRulesProfiling.rejected, (state, action) => {
        state.topFraudRulesProfilingLoading = false;
        state.topFraudRulesProfilingError = action.error.message;
      });
  },
});

export default topFraudRulesProfilingSlice.reducer;
