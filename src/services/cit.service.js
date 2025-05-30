import api from './axios.config';

const citService = {
  getPayableVsRefundable: async (startDate, endDate) => {
    try {
      const response = await api.get('/dashboard/cit/payable-vs-refundable-summary', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSalesComparison: async (startDate, endDate) => {
    try {
      const response = await api.get('/dashboard/cit/sales-comparison', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSegmentationSummary: async (startDate, endDate) => {
    try {
      const response = await api.get('/dashboard/segmentation-summary', {
        params: {
          tax_type: 'cit',
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTaxRecords: async (startDate, endDate, page = 1) => {
    try {
      const response = await api.get('/dashboard/cit/table', {
        params: {
          start_date: startDate,
          end_date: endDate,
          page
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTaxRecordsByTIN: async (tin, startDate, endDate, page = 1) => {
    try {
      const response = await api.get(`/dashboard/cit/table`, {
        params: {
          tin: tin,
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getNetProfitTaxPayers: async (startDate, endDate, page = 1) => {
    try {
      const response = await api.get('/dashboard/cit/top-50-profit-taxpayers', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getNetProfitTaxPayersByTIN: async (tin, startDate, endDate, page = 1) => {
    try {
      const response = await api.get(`/dashboard/cit/table`, {
        params: {
          tin: tin,
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getNetLossTaxPayers: async (startDate, endDate) => {
    try {
      const response = await api.get('/dashboard/cit/top-50-loss-taxpayers', {
        params: {
          start_date: startDate,
          end_date: endDate,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getNetLossTaxPayersByTIN: async (tin, startDate, endDate, page = 1) => {
    try {
      const response = await api.get(`/dashboard/cit/table`, {
        params: {
          tin: tin,
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getCostSalesComparison: async (startDate, endDate) => {
    try {
      const response = await api.get('/dashboard/cit/gross-sales-vs-cash-credit', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getPngvsForeignData(startDate, endDate) {
    try {
      const response = await api.get("/dashboard/cit/png-vs-foreign", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
},

  

  getSummary: async (startDate, endDate) => {
    try {
      const response = await api.get('/dashboard/cit/summery', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getTaxRecordsSummary(startDate, endDate) {
    try {
      const response = await api.get('/dashboard/cit/summary', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getSegmentationDistribution(startDate, endDate) {
    try {
      const response = await api.get('/dashboard/segmentation-summary', {
        params: {
          tax_type: 'cit',
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getTotalAmountByExpenseType(startDate, endDate) {
    try {
      const response = await api.get('/dashboard/cit/total-operating-expenses', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getTotalAmountByIncomeType(startDate, endDate) {
    try {
      const response = await api.get('/dashboard/cit/income-summary', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },


};

export default citService; 