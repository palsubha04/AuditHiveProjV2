import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios.config";

// Accept parameters for dynamic end_date and tin
export const fetchSwtBenchmarkEmployeesProfiling = createAsyncThunk(
  "swtBenchmarkEmployeesProfiling/fetch",
  async ({ start_date, end_date, tin }) => {
    const response = await api.get(
      `/analytics/compliance/benchmark/employees_on_payroll_vs_swt_employees/${tin}?start_date=${start_date}&end_date=${end_date}`
    );
    return response.data;
  }
);

const swtBenchmarkEmployeesProfilingSlice = createSlice({
  name: "swtBenchmarkEmployeesProfiling",
  initialState: {
    swtBenchmarkEmployeesProfilingData: null,
    swtBenchmarkEmployeesProfilingLoading: false,
    swtBenchmarkEmployeesProfilingError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSwtBenchmarkEmployeesProfiling.pending, (state) => {
        state.swtBenchmarkEmployeesProfilingLoading = true;
        state.swtBenchmarkEmployeesProfilingError = null;
      })
      .addCase(fetchSwtBenchmarkEmployeesProfiling.fulfilled, (state, action) => {
        state.swtBenchmarkEmployeesProfilingLoading = false;
        state.swtBenchmarkEmployeesProfilingData = action.payload;
      })
      .addCase(fetchSwtBenchmarkEmployeesProfiling.rejected, (state, action) => {
        state.swtBenchmarkEmployeesProfilingLoading = false;
        state.swtBenchmarkEmployeesProfilingError = action.error.message;
      });
  },
});

export default swtBenchmarkEmployeesProfilingSlice.reducer;
