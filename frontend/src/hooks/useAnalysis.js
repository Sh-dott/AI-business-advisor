// useAnalysis Hook - Manage analysis state and operations
import { useState, useCallback } from 'react';
import api from '../services/api';

export const useAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [histories, setHistories] = useState([]);

  const performAnalysis = useCallback(async (description, businessType, apiProvider = 'claude') => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.performInitialAnalysis(description, businessType, apiProvider);
      setAnalysis({
        id: result.analysisId,
        initialDescription: description,
        diagnosis: result.diagnosis,
        rawDiagnosis: result.rawDiagnosis,
        chatHistory: [],
        recommendations: [],
        apiProvider: result.provider,
        status: 'analyzing'
      });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refineAnalysis = useCallback(async (analysisId, message, apiProvider) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.refineAnalysis(analysisId, message, apiProvider);

      // Update chat history
      setAnalysis(prev => ({
        ...prev,
        chatHistory: result.chatHistory || [
          ...prev.chatHistory,
          { role: 'user', content: message },
          { role: 'assistant', content: result.response }
        ]
      }));

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAnalysis = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getAnalysis(id);
      setAnalysis(result.analysis);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHistories = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getAnalyses(limit, 0);
      setHistories(result.analyses);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAnalysis = useCallback(async (id) => {
    setError(null);
    try {
      await api.deleteAnalysis(id);
      // Remove from histories
      setHistories(prev => prev.filter(h => h._id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analysis,
    loading,
    error,
    histories,
    performAnalysis,
    refineAnalysis,
    loadAnalysis,
    loadHistories,
    deleteAnalysis,
    resetAnalysis
  };
};

export default useAnalysis;
