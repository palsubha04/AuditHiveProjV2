import api from './axios.config';

const swtService = {
  getPayableVsRefundable: async (startDate, endDate) => {
    try {
      const response = await api.get('/dashboard/swt/payable-vs-refundable-summary', {
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
      const response = await api.get('/dashboard/swt/sales-comparison', {
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
          tax_type: 'swt',
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
      const response = await api.get('/dashboard/swt/table', {
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
      const response = await api.get(`/dashboard/swt/table`, {
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

  getSummary: async (startDate, endDate) => {
    try {
      const response = await api.get('/dashboard/swt/summery', {
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
      const response = await api.get('/dashboard/swt/summary', {
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
          tax_type: 'swt',
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEmployeesComparison: async (startDate, endDate) => {
    try {
      const response = await api.get('/dashboard/swt/employees-comparison', {
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

  getSalariesComparison: async (startDate, endDate) => {
    try {
      const response = await api.get('/dashboard/swt/salaries-comparison', {
        params: {
          start_date: startDate,
          end_date: endDate,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default swtService; 