import { useState, useEffect } from 'react';
import { getStatsApi, getChartsApi } from '../api/dashboardApi';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, chartsRes] = await Promise.all([
          getStatsApi(),
          getChartsApi(),
        ]);
        setStats(statsRes.data.data);
        setCharts(chartsRes.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { stats, charts, loading, error };
};
