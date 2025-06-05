import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/axios.config';
import * as XLSX from 'xlsx';


export const fetchTaxpayerReport = createAsyncThunk(
  'taxpayerDetails/fetch',
  async ({ start_date, end_date, tin }) => {
    const response = await api.get(
      `/consolidated-report?tin=${tin}&start_date=${start_date}&end_date=${end_date}&export_format=csv`,
      {
        responseType: 'arraybuffer', // ensure binary data is returned
      }
    );
    const workbook = XLSX.read(response.data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    console.log("sheet", sheet);

    // Convert the sheet to JSON
    const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    return json;
   
  }
);

const taxpayerReportSlice = createSlice({
  name: 'taxpayerReport',
  initialState: {
    taxpayerReportData: null,
    taxpayerReportLoading: false,
    taxpayerReportError: null,
  },
  reducers: {
    resetTaxpayerReport: (state) => {
      state.taxpayerReportData = null;
      state.taxpayerReportLoading = false;
      state.taxpayerReportError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxpayerReport.pending, (state) => {
        state.taxpayerReportLoading = true;
        state.taxpayerReportError = null;
      })
      .addCase(fetchTaxpayerReport.fulfilled, (state, action) => {
        state.taxpayerReportLoading = false;
        state.taxpayerReportData = action.payload;
      })
      .addCase(fetchTaxpayerReport.rejected, (state, action) => {
        state.taxpayerReportLoading = false;
        state.taxpayerReportError = action.error.message;
      });
  },
});

export const { resetTaxpayerReport } = taxpayerReportSlice.actions;
export default taxpayerReportSlice.reducer;
