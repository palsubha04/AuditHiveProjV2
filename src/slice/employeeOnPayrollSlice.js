import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/axios.config';

export const fetchEmployeeOnPayroll = createAsyncThunk(
  'employeeOnPayroll/fetch',
  async ({ start_date, end_date, tin }) => {
    const response = await api.get(
      `dashboard/swt/employees-comparison?start_date=${start_date}&end_date=${end_date}&tin=${tin}`
    );
    return response.data;
  }
);

const employeeOnPayrollSlice = createSlice({
  name: 'employeeOnPayroll',
  initialState: {
    payrollData: null,
    payrollLoading: false,
    payrollError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeOnPayroll.pending, (state) => {
        state.payrollLoading = true;
        state.payrollError = null;
      })
      .addCase(fetchEmployeeOnPayroll.fulfilled, (state, action) => {
        state.payrollLoading = false;
        state.payrollData = action.payload;
      })
      .addCase(fetchEmployeeOnPayroll.rejected, (state, action) => {
        state.payrollLoading = false;
        state.payrollError = action.error.message;
      });
  },
});

export default employeeOnPayrollSlice.reducer;
