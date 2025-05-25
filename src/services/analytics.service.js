import api from './axios.config';

const getTotalVsFlaggedTaxpayers = async (startDate, endDate) => {
  try {
    const response = await api.get('/analytics/risk-assessment/total-vs-flagged-taxpayers', {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total vs flagged taxpayers:', error);
    throw error;
  }
};

const analyticsService = {
  getTotalVsFlaggedTaxpayers
};

export default analyticsService; 