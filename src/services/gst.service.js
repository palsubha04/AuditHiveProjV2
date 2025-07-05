import api from './axios.config';

const gstService = {
  getPayableVsRefundable: async (startDate, endDate) => {
    try {
      const response = await api.get('/dashboard/gst/payable-vs-refundable-summary', {
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
      const response = await api.get('/dashboard/gst/sales-comparison', {
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
          tax_type: 'gst',
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTaxRecords: async (startDate, endDate, page = 1, activeSwitch) => {
    try {
      if(activeSwitch === 'all') {
        const response = await api.get('/dashboard/gst/table', {
          params: {
            start_date: startDate,
            end_date: endDate,
            bank: true,
            custom: true,
            page
          }
        });
        return response.data;
      }
      else if(activeSwitch === 'banks') {
        const response = await api.get('/dashboard/gst/table', {
          params: {
            start_date: startDate,
            end_date: endDate,
            bank: true,
            page
          }
        });
        return response.data;
      }
      else if(activeSwitch === 'customs') {
        const response = await api.get('/dashboard/gst/table', {
          params: {
            start_date: startDate,
            end_date: endDate,
            custom: true,
            page
          }
        });
        return response.data;
      }
      else{
        const response = await api.get('/dashboard/gst/table', {
          params: {
            start_date: startDate,
            end_date: endDate,
            page
          }
        });
        return response.data;
      }
      
      
    } catch (error) {
      throw error;
    }
  },

  getPieTaxRecords: async (startDate, endDate) => {
    try {
        const response = await api.get('/dashboard/gst/table', {
          params: {
            start_date: startDate,
            end_date: endDate,
            bank: true,
            custom: true,
            count: true,
          }
        });

        return response.data;
      }
      catch (error) {
        throw error;
      }
  },

  getTaxRecordsByTIN: async (tin, startDate, endDate, activeSwitch) => {
    try {
      if(activeSwitch === 'all') {
        const response = await api.get(`/dashboard/gst/table`, {
          params: {
            start_date: startDate,
            end_date: endDate,
            bank: true,
            custom: true,
            tin: tin,
          }
        });
        return response.data;
      }
      else if(activeSwitch === 'banks') {
        const response = await api.get(`/dashboard/gst/table`, {
          params: {
            start_date: startDate,
            end_date: endDate,
            bank: true,
            tin: tin,
          }
        });
        return response.data;
      }
      else if(activeSwitch === 'customs') {
        const response = await api.get(`/dashboard/gst/table`, {
          params: {
            start_date: startDate,
            end_date: endDate,
            custom: true,
            tin: tin,
          }
        });
        return response.data;
      }
      else{
        const response = await api.get(`/dashboard/gst/table`, {
          params: {
            start_date: startDate,
            end_date: endDate,
            tin: tin
          }
        });
        return response.data;
      }
      
    } catch (error) {
      throw error;
    }
  },

  getSummary: async (startDate, endDate) => {
    try {
      const response = await api.get('/dashboard/gst/summery', {
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
      const response = await api.get('/dashboard/gst/summary', {
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
          tax_type: 'gst',
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default gstService; 