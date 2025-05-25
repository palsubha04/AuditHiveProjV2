// import api from './axios.config';

// const gstService = {
//   getPayableVsRefundable: async (startDate, endDate) => {
//     try {
//       const response = await api.get('/dashboard/gst/payable-vs-refundable-summary', {
//         params: {
//           start_date: startDate,
//           end_date: endDate
//         }
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   getSalesComparison: async (startDate, endDate) => {
//     try {
//       const response = await api.get('/dashboard/gst/sales-comparison', {
//         params: {
//           start_date: startDate,
//           end_date: endDate
//         }
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   getSegmentationSummary: async (startDate, endDate) => {
//     try {
//       const response = await api.get('/dashboard/segmentation-summary', {
//         params: {
//           tax_type: 'gst',
//           start_date: startDate,
//           end_date: endDate
//         }
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   getTaxRecords: async (startDate, endDate, page = 1) => {
//     try {
//       const response = await api.get('/dashboard/tax-records', {
//         params: {
//           tax_type: 'gst',
//           start_date: startDate,
//           end_date: endDate,
//           page
//         }
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   getTaxRecordsByTIN: async (tin) => {
//     try {
//       const response = await api.get(`/dashboard/${tin}`, {
//         params: {
//           tax_type: 'gst'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   getSummary: async (startDate, endDate) => {
//     try {
//       const response = await api.get('/dashboard/gst/summery', {
//         params: {
//           start_date: startDate,
//           end_date: endDate
//         }
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   async getTaxRecordsSummary(startDate, endDate) {
//     try {
//       const response = await api.get('/dashboard/gst/summary', {
//         params: {
//           start_date: startDate,
//           end_date: endDate
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching tax records summary:', error);
//       throw error;
//     }
//   },

//   async getSegmentationDistribution(startDate, endDate) {
//     try {
//       const response = await api.get('/dashboard/segmentation-summary', {
//         params: {
//           tax_type: 'gst',
//           start_date: startDate,
//           end_date: endDate
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching segmentation distribution:', error);
//       throw error;
//     }
//   }
// };

// export default gstService; 
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

  getTaxRecords: async (startDate, endDate, page = 1) => {
    try {
      const response = await api.get('/dashboard/gst/table', {
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
      const response = await api.get(`/dashboard/gst/table`, {
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
      console.error('Error fetching tax records summary:', error);
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
      console.error('Error fetching segmentation distribution:', error);
      throw error;
    }
  }
};

export default gstService; 