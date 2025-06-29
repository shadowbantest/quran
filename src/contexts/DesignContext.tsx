import React, { useCallback, useEffect, useState, createContext, useContext, useReducer } from 'react';
// Define the types for our context
type DesignState = {
  // Text settings
  arabicText: string;
  arabicFont: string;
  arabicColor: string;
  arabicAlignment: string;
  arabicBold: boolean;
  arabicItalic: boolean;
  arabicUnderline: boolean;
  arabicSize: number;
  arabicLineHeight: number;
  arabicLetterSpacing: number;
  arabicTextShadow: boolean;
  arabicTextShadowColor: string;
  arabicTextShadowBlur: number;
  arabicTextShadowOffset: number;
  arabicTextBackground: boolean;
  arabicTextBackgroundColor: string;
  arabicTextBackgroundPadding: number;
  arabicTextOutline: boolean;
  arabicTextOutlineColor: string;
  arabicTextOutlineWidth: number;
  arabicTextRotation: number;
  arabicPosition: {
    x: number;
    y: number;
  };
  // English text settings
  englishText: string;
  englishFont: string;
  englishColor: string;
  englishAlignment: string;
  englishBold: boolean;
  englishItalic: boolean;
  englishUnderline: boolean;
  englishSize: number;
  englishLineHeight: number;
  englishLetterSpacing: number;
  englishTextShadow: boolean;
  englishTextShadowColor: string;
  englishTextShadowBlur: number;
  englishTextShadowOffset: number;
  englishTextBackground: boolean;
  englishTextBackgroundColor: string;
  englishTextBackgroundPadding: number;
  englishTextOutline: boolean;
  englishTextOutlineColor: string;
  englishTextOutlineWidth: number;
  englishTextRotation: number;
  englishPosition: {
    x: number;
    y: number;
  };
  // Reference settings
  showReference: boolean;
  referenceText: string;
  referenceFont: string;
  referenceColor: string;
  referenceAlignment: string;
  referenceBold: boolean;
  referenceItalic: boolean;
  referenceUnderline: boolean;
  referenceSize: number;
  referenceLineHeight: number;
  referenceLetterSpacing: number;
  referencePosition: {
    x: number;
    y: number;
  };
  referenceTextShadow: boolean;
  referenceTextBackground: boolean;
  referenceTextBackgroundColor: string;
  referenceTextBackgroundPadding: number;
  // Watermark settings
  showWatermark: boolean;
  watermarkText: string;
  watermarkOpacity: number;
  watermarkSize: number;
  watermarkColor: string;
  watermarkFont: string;
  watermarkPosition: {
    x: number;
    y: number;
  };
  watermarkRotation: number;
  // Background settings
  backgroundColor: string;
  backgroundImage: string;
  backgroundPosition: {
    x: number;
    y: number;
  };
  backgroundLocked: boolean;
  backgroundOpacity: number;
  brightness: number;
  contrast: number;
  blur: number;
  backgroundOverlay: boolean;
  backgroundOverlayColor: string;
  backgroundPattern: string;
  backgroundGradient: boolean;
  backgroundGradientColors: string[];
  backgroundGradientDirection: string;
  // Canvas settings
  canvasWidth: number;
  canvasHeight: number;
  canvasPadding: number;
  canvasRatio: string;
};
type DesignAction = {
  type: string;
  payload: any;
};
type DesignContextType = {
  state: DesignState;
  dispatch: React.Dispatch<DesignAction>;
  history: DesignState[];
  historyIndex: number;
  handleUndo: () => void;
  handleRedo: () => void;
  saveToHistory: () => void;
  resetToDefaults: () => void;
  saveDesign: () => void;
  loadDesign: () => void;
};
// Create the context
const DesignContext = createContext<DesignContextType | undefined>(undefined);
// Default state values
const defaultState: DesignState = {
  // Arabic text settings
  arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  arabicFont: 'Amiri',
  arabicColor: '#000000',
  arabicAlignment: 'center',
  arabicBold: false,
  arabicItalic: false,
  arabicUnderline: false,
  arabicSize: 36,
  arabicLineHeight: 1.5,
  arabicLetterSpacing: 0,
  arabicTextShadow: false,
  arabicTextShadowColor: '#000000',
  arabicTextShadowBlur: 4,
  arabicTextShadowOffset: 2,
  arabicTextBackground: false,
  arabicTextBackgroundColor: 'rgba(255,255,255,0.5)',
  arabicTextBackgroundPadding: 10,
  arabicTextOutline: false,
  arabicTextOutlineColor: '#ffffff',
  arabicTextOutlineWidth: 1,
  arabicTextRotation: 0,
  arabicPosition: {
    x: 540,
    y: 400
  },
  // English text settings
  englishText: 'In the name of Allah, the Most Gracious, the Most Merciful',
  englishFont: 'Playfair Display',
  englishColor: '#555555',
  englishAlignment: 'center',
  englishBold: false,
  englishItalic: false,
  englishUnderline: false,
  englishSize: 24,
  englishLineHeight: 1.5,
  englishLetterSpacing: 0,
  englishTextShadow: false,
  englishTextShadowColor: '#000000',
  englishTextShadowBlur: 4,
  englishTextShadowOffset: 2,
  englishTextBackground: false,
  englishTextBackgroundColor: 'rgba(255,255,255,0.5)',
  englishTextBackgroundPadding: 10,
  englishTextOutline: false,
  englishTextOutlineColor: '#ffffff',
  englishTextOutlineWidth: 1,
  englishTextRotation: 0,
  englishPosition: {
    x: 540,
    y: 500
  },
  // Reference settings
  showReference: true,
  referenceText: 'Quran 1:1',
  referenceFont: 'Inter',
  referenceColor: '#777777',
  referenceAlignment: 'center',
  referenceBold: false,
  referenceItalic: true,
  referenceUnderline: false,
  referenceSize: 16,
  referenceLineHeight: 1.5,
  referenceLetterSpacing: 0,
  referencePosition: {
    x: 540,
    y: 580
  },
  referenceTextShadow: false,
  referenceTextBackground: false,
  referenceTextBackgroundColor: 'rgba(255,255,255,0.5)',
  referenceTextBackgroundPadding: 8,
  // Watermark settings
  showWatermark: true,
  watermarkText: '@IslamicQuotes',
  watermarkOpacity: 50,
  watermarkSize: 16,
  watermarkColor: '#000000',
  watermarkFont: 'Inter',
  watermarkPosition: {
    x: 540,
    y: 950
  },
  watermarkRotation: 0,
  // Background settings
  backgroundColor: '#ffffff',
  backgroundImage: '',
  backgroundPosition: {
    x: 0,
    y: 0
  },
  backgroundLocked: false,
  backgroundOpacity: 100,
  brightness: 100,
  contrast: 100,
  blur: 0,
  backgroundOverlay: false,
  backgroundOverlayColor: 'rgba(0,0,0,0.3)',
  backgroundPattern: '',
  backgroundGradient: false,
  backgroundGradientColors: ['#ffffff', '#f0f0f0'],
  backgroundGradientDirection: 'to bottom',
  // Canvas settings
  canvasWidth: 1080,
  canvasHeight: 1080,
  canvasPadding: 40,
  canvasRatio: 'square'
};
// Reducer for handling state updates
function designReducer(state: DesignState, action: DesignAction): DesignState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.payload.field]: action.payload.value
      };
    case 'UPDATE_POSITION':
      return {
        ...state,
        [action.payload.field]: {
          x: action.payload.x,
          y: action.payload.y
        }
      };
    case 'RESTORE_STATE':
      return action.payload;
    case 'RESET_TO_DEFAULTS':
      return defaultState;
    default:
      return state;
  }
}
// Provider component
export const DesignProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [state, dispatch] = useReducer(designReducer, defaultState);
  const [history, setHistory] = useState<DesignState[]>([defaultState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  // Save current state to history
  const saveToHistory = useCallback(() => {
    // If we're not at the end of history, truncate it
    if (historyIndex < history.length - 1) {
      const newHistory = history.slice(0, historyIndex + 1);
      setHistory([...newHistory, state]);
    } else {
      // Limit history to 30 steps
      const newHistory = history.length >= 30 ? history.slice(1) : history;
      setHistory([...newHistory, state]);
    }
    setHistoryIndex(Math.min(history.length, 29));
  }, [history, historyIndex, state]);
  // Undo action
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      dispatch({
        type: 'RESTORE_STATE',
        payload: previousState
      });
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);
  // Redo action
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      dispatch({
        type: 'RESTORE_STATE',
        payload: nextState
      });
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);
  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    dispatch({
      type: 'RESET_TO_DEFAULTS',
      payload: null
    });
    saveToHistory();
  }, [saveToHistory]);
  // Save design to localStorage
  const saveDesign = useCallback(() => {
    localStorage.setItem('islamicQuoteState', JSON.stringify(state));
  }, [state]);
  // Load design from localStorage
  const loadDesign = useCallback(() => {
    const savedState = localStorage.getItem('islamicQuoteState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({
          type: 'RESTORE_STATE',
          payload: parsedState
        });
        saveToHistory();
      } catch (error) {
        console.error('Error loading saved design:', error);
      }
    }
  }, [saveToHistory]);
  // Initialize history on first render
  useEffect(() => {
    saveToHistory();
  }, []);
  const value = {
    state,
    dispatch,
    history,
    historyIndex,
    handleUndo,
    handleRedo,
    saveToHistory,
    resetToDefaults,
    saveDesign,
    loadDesign
  };
  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>;
};
// Custom hook for using the design context
export const useDesign = () => {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
};