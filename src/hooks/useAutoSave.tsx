import React, { useEffect, useRef } from 'react';
import { useDesign } from '../contexts/DesignContext';
export function useAutoSave(intervalMs = 60000) {
  const {
    state,
    saveDesign
  } = useDesign();
  const savedStateRef = useRef(state);
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Only save if the state has changed since last save
      if (JSON.stringify(state) !== JSON.stringify(savedStateRef.current)) {
        saveDesign();
        savedStateRef.current = state;
        console.log('Auto-saved design');
      }
    }, intervalMs);
    return () => clearInterval(intervalId);
  }, [state, saveDesign, intervalMs]);
  return null;
}