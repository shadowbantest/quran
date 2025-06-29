import React, { useEffect, useState, useRef, Fragment, createElement } from 'react';
import { Download, Share, Save, Upload, RefreshCw, MenuIcon, X, Grid, Moon, Sun, Move, ImageIcon, Type, Palette, Settings, Layers, CornerUpLeft, CornerUpRight, Lock, Unlock, FileText, Eye, EyeOff, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Trash2, Plus, Copy, RotateCcw, RotateCw, Maximize, Minimize, Droplets, Sparkles, Check, ArrowUpDown, History, Sliders } from 'lucide-react';
// Import new components and hooks
import { DesignProvider, useDesign } from './contexts/DesignContext';
import { ToastProvider, useToast } from './components/ui/Toast';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAutoSave } from './hooks/useAutoSave';
import Canvas from './components/Canvas';
// Main App component wrapped with providers
export function App() {
  return <ToastProvider>
      <DesignProvider>
        <AppContent />
      </DesignProvider>
    </ToastProvider>;
}
// Separate the app content to use hooks inside provider context
function AppContent() {
  // Use our new hooks
  useKeyboardShortcuts();
  useAutoSave(60000); // Auto-save every minute
  const {
    state,
    dispatch,
    handleUndo,
    handleRedo,
    saveToHistory,
    resetToDefaults,
    saveDesign,
    loadDesign
  } = useDesign();
  const {
    toast
  } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('arabic');
  const [showGrid, setShowGrid] = useState(false);
  const [showCanvasSettings, setShowCanvasSettings] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showExportSettings, setShowExportSettings] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');
  const [exportQuality, setExportQuality] = useState(1);
  const [exportFileName, setExportFileName] = useState('islamic-quote');
  const [showCanvasSizeControls, setShowCanvasSizeControls] = useState(false);
  const previewRef = useRef(null);
  const canvasRef = useRef(null);
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  // Toggle background lock
  const toggleBackgroundLock = () => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'backgroundLocked',
        value: !state.backgroundLocked
      }
    });
  };
  // Toggle reference visibility
  const toggleReferenceVisibility = () => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'showReference',
        value: !state.showReference
      }
    });
  };
  // Toggle watermark visibility
  const toggleWatermarkVisibility = () => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'showWatermark',
        value: !state.showWatermark
      }
    });
  };
  // Handle image upload
  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        dispatch({
          type: 'UPDATE_FIELD',
          payload: {
            field: 'backgroundImage',
            value: e.target.result
          }
        });
        // Reset background position when new image is uploaded
        dispatch({
          type: 'UPDATE_POSITION',
          payload: {
            field: 'backgroundPosition',
            x: 0,
            y: 0
          }
        });
        saveToHistory();
        toast({
          title: 'Image uploaded',
          description: 'Background image has been updated'
        });
      };
      reader.readAsDataURL(file);
    }
  };
  // Handle download
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    // Set canvas dimensions
    canvas.width = state.canvasWidth;
    canvas.height = state.canvasHeight;
    // Draw background color
    context.fillStyle = state.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    // Draw background image if exists
    if (state.backgroundImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = state.backgroundImage;
      img.onload = () => {
        // Calculate position to center the image
        const x = state.backgroundPosition.x;
        const y = state.backgroundPosition.y;
        // Apply filters
        context.filter = `brightness(${state.brightness}%) contrast(${state.contrast}%) blur(${state.blur}px)`;
        // Draw the image
        context.globalAlpha = state.backgroundOpacity / 100;
        context.drawImage(img, x, y, img.width, img.height);
        context.globalAlpha = 1;
        context.filter = 'none';
        // Draw overlay if enabled
        if (state.backgroundOverlay) {
          context.fillStyle = state.backgroundOverlayColor;
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        // Draw text elements
        drawTextToCanvas();
        // Convert to image and trigger download
        const imgData = canvas.toDataURL(`image/${exportFormat}`, exportQuality);
        const link = document.createElement('a');
        link.download = `${exportFileName}.${exportFormat}`;
        link.href = imgData;
        link.click();
        toast({
          title: 'Download started',
          description: `Your design is being downloaded as ${exportFileName}.${exportFormat}`
        });
      };
    } else {
      // If no background image, draw text directly
      drawTextToCanvas();
      // Convert to image and trigger download
      const imgData = canvas.toDataURL(`image/${exportFormat}`, exportQuality);
      const link = document.createElement('a');
      link.download = `${exportFileName}.${exportFormat}`;
      link.href = imgData;
      link.click();
      toast({
        title: 'Download started',
        description: `Your design is being downloaded as ${exportFileName}.${exportFormat}`
      });
    }
  };
  // Draw text elements to canvas
  const drawTextToCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    // Draw Arabic text
    if (state.arabicText) {
      context.save();
      context.translate(state.arabicPosition.x, state.arabicPosition.y);
      context.rotate(state.arabicTextRotation * Math.PI / 180);
      // Set text background if enabled
      if (state.arabicTextBackground) {
        const textWidth = context.measureText(state.arabicText).width;
        const padding = state.arabicTextBackgroundPadding;
        const height = state.arabicSize * state.arabicLineHeight;
        context.fillStyle = state.arabicTextBackgroundColor;
        context.fillRect(-textWidth / 2 - padding, -height / 2 - padding, textWidth + padding * 2, height + padding * 2);
      }
      // Set text style
      context.font = `${state.arabicBold ? 'bold' : ''} ${state.arabicItalic ? 'italic' : ''} ${state.arabicSize}px ${state.arabicFont}, Arial`;
      context.fillStyle = state.arabicColor;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.direction = 'rtl';
      // Draw text shadow if enabled
      if (state.arabicTextShadow) {
        context.shadowColor = state.arabicTextShadowColor;
        context.shadowBlur = state.arabicTextShadowBlur;
        context.shadowOffsetX = state.arabicTextShadowOffset;
        context.shadowOffsetY = state.arabicTextShadowOffset;
      }
      // Draw text outline if enabled
      if (state.arabicTextOutline) {
        context.strokeStyle = state.arabicTextOutlineColor;
        context.lineWidth = state.arabicTextOutlineWidth;
        context.strokeText(state.arabicText, 0, 0);
      }
      // Draw the text
      context.fillText(state.arabicText, 0, 0);
      context.restore();
    }
    // Draw English text
    if (state.englishText) {
      context.save();
      context.translate(state.englishPosition.x, state.englishPosition.y);
      context.rotate(state.englishTextRotation * Math.PI / 180);
      // Set text background if enabled
      if (state.englishTextBackground) {
        const textWidth = context.measureText(state.englishText).width;
        const padding = state.englishTextBackgroundPadding;
        const height = state.englishSize * state.englishLineHeight;
        context.fillStyle = state.englishTextBackgroundColor;
        context.fillRect(-textWidth / 2 - padding, -height / 2 - padding, textWidth + padding * 2, height + padding * 2);
      }
      // Set text style
      context.font = `${state.englishBold ? 'bold' : ''} ${state.englishItalic ? 'italic' : ''} ${state.englishSize}px ${state.englishFont}, Arial`;
      context.fillStyle = state.englishColor;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      // Draw text shadow if enabled
      if (state.englishTextShadow) {
        context.shadowColor = state.englishTextShadowColor;
        context.shadowBlur = state.englishTextShadowBlur;
        context.shadowOffsetX = state.englishTextShadowOffset;
        context.shadowOffsetY = state.englishTextShadowOffset;
      }
      // Draw text outline if enabled
      if (state.englishTextOutline) {
        context.strokeStyle = state.englishTextOutlineColor;
        context.lineWidth = state.englishTextOutlineWidth;
        context.strokeText(state.englishText, 0, 0);
      }
      // Draw the text
      context.fillText(state.englishText, 0, 0);
      context.restore();
    }
    // Draw reference text
    if (state.showReference && state.referenceText) {
      context.save();
      context.translate(state.referencePosition.x, state.referencePosition.y);
      // Set text background if enabled
      if (state.referenceTextBackground) {
        const textWidth = context.measureText(state.referenceText).width;
        const padding = state.referenceTextBackgroundPadding;
        const height = state.referenceSize * state.referenceLineHeight;
        context.fillStyle = state.referenceTextBackgroundColor;
        context.fillRect(-textWidth / 2 - padding, -height / 2 - padding, textWidth + padding * 2, height + padding * 2);
      }
      // Set text style
      context.font = `${state.referenceBold ? 'bold' : ''} ${state.referenceItalic ? 'italic' : ''} ${state.referenceSize}px ${state.referenceFont}, Arial`;
      context.fillStyle = state.referenceColor;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      // Draw text shadow if enabled
      if (state.referenceTextShadow) {
        context.shadowColor = 'rgba(0,0,0,0.5)';
        context.shadowBlur = 4;
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
      }
      // Draw the text
      context.fillText(state.referenceText, 0, 0);
      context.restore();
    }
    // Draw watermark
    if (state.showWatermark && state.watermarkText) {
      context.save();
      context.translate(state.watermarkPosition.x, state.watermarkPosition.y);
      context.rotate(state.watermarkRotation * Math.PI / 180);
      // Set text style
      context.font = `${state.watermarkSize}px ${state.watermarkFont}, Arial`;
      context.fillStyle = state.watermarkColor;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.globalAlpha = state.watermarkOpacity / 100;
      // Draw the text
      context.fillText(state.watermarkText, 0, 0);
      context.restore();
    }
  };
  const handleShare = () => {
    toast({
      title: 'Coming soon',
      description: 'Sharing functionality will be available in a future update',
      type: 'info'
    });
  };
  const handleSave = () => {
    saveDesign();
    toast({
      title: 'Design saved',
      description: 'Your design has been saved locally'
    });
  };
  const handleLoad = () => {
    loadDesign();
    toast({
      title: 'Design loaded',
      description: 'Your saved design has been loaded'
    });
  };
  const handleReset = () => {
    resetToDefaults();
    toast({
      title: 'Design reset',
      description: 'All settings have been reset to default values'
    });
  };
  // Apply template settings
  const applyTemplate = template => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'backgroundColor',
        value: template.settings.backgroundColor
      }
    });
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'arabicFont',
        value: template.settings.arabicFont
      }
    });
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'arabicColor',
        value: template.settings.arabicColor
      }
    });
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'englishFont',
        value: template.settings.englishFont
      }
    });
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'englishColor',
        value: template.settings.englishColor
      }
    });
    saveToHistory();
    toast({
      title: 'Template applied',
      description: `The ${template.name} template has been applied`
    });
  };
  // Handle canvas ratio change
  const handleCanvasRatioChange = ratio => {
    dispatch({
      type: 'UPDATE_FIELD',
      payload: {
        field: 'canvasRatio',
        value: ratio
      }
    });
    switch (ratio) {
      case 'square':
        dispatch({
          type: 'UPDATE_FIELD',
          payload: {
            field: 'canvasWidth',
            value: 1080
          }
        });
        dispatch({
          type: 'UPDATE_FIELD',
          payload: {
            field: 'canvasHeight',
            value: 1080
          }
        });
        break;
      case 'portrait':
        dispatch({
          type: 'UPDATE_FIELD',
          payload: {
            field: 'canvasWidth',
            value: 1080
          }
        });
        dispatch({
          type: 'UPDATE_FIELD',
          payload: {
            field: 'canvasHeight',
            value: 1350
          }
        });
        break;
      case 'landscape':
        dispatch({
          type: 'UPDATE_FIELD',
          payload: {
            field: 'canvasWidth',
            value: 1350
          }
        });
        dispatch({
          type: 'UPDATE_FIELD',
          payload: {
            field: 'canvasHeight',
            value: 1080
          }
        });
        break;
      case 'story':
        dispatch({
          type: 'UPDATE_FIELD',
          payload: {
            field: 'canvasWidth',
            value: 1080
          }
        });
        dispatch({
          type: 'UPDATE_FIELD',
          payload: {
            field: 'canvasHeight',
            value: 1920
          }
        });
        break;
      case 'widescreen':
        dispatch({
          type: 'UPDATE_FIELD',
          payload: {
            field: 'canvasWidth',
            value: 1920
          }
        });
        dispatch({
          type: 'UPDATE_FIELD',
          payload: {
            field: 'canvasHeight',
            value: 1080
          }
        });
        break;
      default:
        dispatch({
          type: 'UPDATE_FIELD',
          payload: {
            field: 'canvasWidth',
            value: 1080
          }
        });
        dispatch({
          type: 'UPDATE_FIELD',
          payload: {
            field: 'canvasHeight',
            value: 1080
          }
        });
    }
    toast({
      title: 'Canvas size updated',
      description: `Canvas ratio changed to ${ratio}`
    });
  };
  // Load fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Scheherazade+New:wght@400;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@400;500;600;700&family=Reem+Kufi:wght@400;500;600;700&family=Lateef&family=Aref+Ruqaa:wght@400;700&family=Mirza:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=Merriweather:ital,wght@0,400;0,700;1,400;1,700&family=Roboto+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+Pro:ital,wght@0,400;0,700;1,400;1,700&family=EB+Garamond:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:wght@400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  // Tab sections for sidebar with icons
  const tabItems = [{
    id: 'arabic',
    label: 'Arabic',
    icon: <Type size={18} />
  }, {
    id: 'english',
    label: 'English',
    icon: <Type size={18} />
  }, {
    id: 'reference',
    label: 'Reference',
    icon: <FileText size={18} />
  }, {
    id: 'watermark',
    label: 'Watermark',
    icon: <Layers size={18} />
  }, {
    id: 'background',
    label: 'Background',
    icon: <ImageIcon size={18} />
  }, {
    id: 'templates',
    label: 'Templates',
    icon: <Palette size={18} />
  }, {
    id: 'export',
    label: 'Export',
    icon: <Download size={18} />
  }];
  // Available fonts
  const arabicFonts = [{
    value: 'Amiri',
    label: 'Amiri'
  }, {
    value: 'Scheherazade New',
    label: 'Scheherazade New'
  }, {
    value: 'Noto Naskh Arabic',
    label: 'Noto Naskh Arabic'
  }, {
    value: 'Noto Kufi Arabic',
    label: 'Noto Kufi Arabic'
  }, {
    value: 'Reem Kufi',
    label: 'Reem Kufi'
  }, {
    value: 'Lateef',
    label: 'Lateef'
  }, {
    value: 'Aref Ruqaa',
    label: 'Aref Ruqaa'
  }, {
    value: 'Mirza',
    label: 'Mirza'
  }];
  const englishFonts = [{
    value: 'Inter',
    label: 'Inter'
  }, {
    value: 'Playfair Display',
    label: 'Playfair Display'
  }, {
    value: 'Lora',
    label: 'Lora'
  }, {
    value: 'Merriweather',
    label: 'Merriweather'
  }, {
    value: 'Roboto Serif',
    label: 'Roboto Serif'
  }, {
    value: 'Source Serif Pro',
    label: 'Source Serif Pro'
  }, {
    value: 'EB Garamond',
    label: 'EB Garamond'
  }, {
    value: 'Cormorant Garamond',
    label: 'Cormorant Garamond'
  }, {
    value: 'Montserrat',
    label: 'Montserrat'
  }, {
    value: 'Oswald',
    label: 'Oswald'
  }];
  // Preset themes
  const presetThemes = [{
    name: 'Light',
    color: '#ffffff'
  }, {
    name: 'Cream',
    color: '#f8f5e6'
  }, {
    name: 'Soft Blue',
    color: '#e6f0f8'
  }, {
    name: 'Soft Green',
    color: '#e6f8e8'
  }, {
    name: 'Soft Pink',
    color: '#f8e6e6'
  }, {
    name: 'Gray',
    color: '#f0f0f0'
  }, {
    name: 'Dark',
    color: '#333333'
  }];
  // Templates
  const templates = [{
    name: 'Classic',
    settings: {
      backgroundColor: '#ffffff',
      arabicFont: 'Amiri',
      arabicColor: '#000000',
      englishFont: 'Playfair Display',
      englishColor: '#555555'
    }
  }, {
    name: 'Modern',
    settings: {
      backgroundColor: '#f8f8f8',
      arabicFont: 'Noto Kufi Arabic',
      arabicColor: '#333333',
      englishFont: 'Montserrat',
      englishColor: '#666666'
    }
  }, {
    name: 'Elegant',
    settings: {
      backgroundColor: '#f8f5e6',
      arabicFont: 'Scheherazade New',
      arabicColor: '#5d4037',
      englishFont: 'EB Garamond',
      englishColor: '#795548'
    }
  }, {
    name: 'Minimalist',
    settings: {
      backgroundColor: '#ffffff',
      arabicFont: 'Reem Kufi',
      arabicColor: '#212121',
      englishFont: 'Inter',
      englishColor: '#757575'
    }
  }, {
    name: 'Dark',
    settings: {
      backgroundColor: '#212121',
      arabicFont: 'Amiri',
      arabicColor: '#ffffff',
      englishFont: 'Lora',
      englishColor: '#e0e0e0'
    }
  }];
  // Format multiline text for display
  const formatMultilineText = (text, element) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => <Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </Fragment>);
  };
  // Tab sections for sidebar
  const renderTabContent = () => {
    switch (activeTab) {
      case 'arabic':
        return <div className="space-y-5">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Arabic Text
              </label>
              <textarea value={state.arabicText} onChange={e => {
              dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                  field: 'arabicText',
                  value: e.target.value
                }
              });
            }} onBlur={() => saveToHistory()} className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} rows={4} dir="rtl"></textarea>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Font
              </label>
              <select value={state.arabicFont} onChange={e => {
              dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                  field: 'arabicFont',
                  value: e.target.value
                }
              });
              saveToHistory();
            }} className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}>
                {arabicFonts.map(font => <option key={font.value} value={font.value}>
                    {font.label}
                  </option>)}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Color
              </label>
              <div className="flex items-center">
                <input type="color" value={state.arabicColor} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'arabicColor',
                    value: e.target.value
                  }
                });
              }} onBlur={() => saveToHistory()} className="w-12 h-10 rounded border p-1" />
                <input type="text" value={state.arabicColor} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'arabicColor',
                    value: e.target.value
                  }
                });
              }} onBlur={() => saveToHistory()} className={`ml-2 flex-1 p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Alignment
              </label>
              <div className="flex space-x-2">
                <button onClick={() => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'arabicAlignment',
                    value: 'left'
                  }
                });
                saveToHistory();
              }} className={`flex-1 p-3 flex justify-center items-center rounded-lg ${state.arabicAlignment === 'left' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                  <AlignLeft size={20} />
                </button>
                <button onClick={() => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'arabicAlignment',
                    value: 'center'
                  }
                });
                saveToHistory();
              }} className={`flex-1 p-3 flex justify-center items-center rounded-lg ${state.arabicAlignment === 'center' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                  <AlignCenter size={20} />
                </button>
                <button onClick={() => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'arabicAlignment',
                    value: 'right'
                  }
                });
                saveToHistory();
              }} className={`flex-1 p-3 flex justify-center items-center rounded-lg ${state.arabicAlignment === 'right' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                  <AlignRight size={20} />
                </button>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Style
              </label>
              <div className="flex space-x-2">
                <button onClick={() => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'arabicBold',
                    value: !state.arabicBold
                  }
                });
                saveToHistory();
              }} className={`flex-1 p-3 flex justify-center items-center rounded-lg ${state.arabicBold ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                  <Bold size={20} />
                </button>
                <button onClick={() => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'arabicItalic',
                    value: !state.arabicItalic
                  }
                });
                saveToHistory();
              }} className={`flex-1 p-3 flex justify-center items-center rounded-lg ${state.arabicItalic ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                  <Italic size={20} />
                </button>
                <button onClick={() => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'arabicUnderline',
                    value: !state.arabicUnderline
                  }
                });
                saveToHistory();
              }} className={`flex-1 p-3 flex justify-center items-center rounded-lg ${state.arabicUnderline ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                  <Underline size={20} />
                </button>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Size: {state.arabicSize}px
              </label>
              <input type="range" min="10" max="100" value={state.arabicSize} onChange={e => {
              dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                  field: 'arabicSize',
                  value: parseInt(e.target.value)
                }
              });
            }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Line Height: {state.arabicLineHeight}
              </label>
              <input type="range" min="0.8" max="3" step="0.1" value={state.arabicLineHeight} onChange={e => {
              dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                  field: 'arabicLineHeight',
                  value: parseFloat(e.target.value)
                }
              });
            }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Letter Spacing: {state.arabicLetterSpacing}px
              </label>
              <input type="range" min="-5" max="20" value={state.arabicLetterSpacing} onChange={e => {
              dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                  field: 'arabicLetterSpacing',
                  value: parseInt(e.target.value)
                }
              });
            }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Rotation: {state.arabicTextRotation}°
              </label>
              <input type="range" min="-180" max="180" value={state.arabicTextRotation} onChange={e => {
              dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                  field: 'arabicTextRotation',
                  value: parseInt(e.target.value)
                }
              });
            }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button onClick={() => setShowAdvancedSettings(!showAdvancedSettings)} className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                <span className="font-medium">Advanced Settings</span>
                <span className={`transform transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`}>
                  <ArrowUpDown size={16} />
                </span>
              </button>
              {showAdvancedSettings && <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Text Shadow
                      </label>
                      <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.arabicTextShadow ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={() => {
                    dispatch({
                      type: 'UPDATE_FIELD',
                      payload: {
                        field: 'arabicTextShadow',
                        value: !state.arabicTextShadow
                      }
                    });
                    saveToHistory();
                  }}>
                        <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.arabicTextShadow ? 'translate-x-6' : 'translate-x-0'}`}></span>
                      </button>
                    </div>
                    {state.arabicTextShadow && <div className="mt-3 space-y-3">
                        <div>
                          <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Shadow Color
                          </label>
                          <div className="flex items-center">
                            <input type="color" value={state.arabicTextShadowColor} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'arabicTextShadowColor',
                            value: e.target.value
                          }
                        });
                      }} onBlur={() => saveToHistory()} className="w-10 h-8 rounded border p-1" />
                            <input type="text" value={state.arabicTextShadowColor} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'arabicTextShadowColor',
                            value: e.target.value
                          }
                        });
                      }} onBlur={() => saveToHistory()} className={`ml-2 flex-1 p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Blur: {state.arabicTextShadowBlur}px
                          </label>
                          <input type="range" min="0" max="20" value={state.arabicTextShadowBlur} onChange={e => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'arabicTextShadowBlur',
                          value: parseInt(e.target.value)
                        }
                      });
                    }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Offset: {state.arabicTextShadowOffset}px
                          </label>
                          <input type="range" min="0" max="20" value={state.arabicTextShadowOffset} onChange={e => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'arabicTextShadowOffset',
                          value: parseInt(e.target.value)
                        }
                      });
                    }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                        </div>
                      </div>}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Text Background
                      </label>
                      <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.arabicTextBackground ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={() => {
                    dispatch({
                      type: 'UPDATE_FIELD',
                      payload: {
                        field: 'arabicTextBackground',
                        value: !state.arabicTextBackground
                      }
                    });
                    saveToHistory();
                  }}>
                        <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.arabicTextBackground ? 'translate-x-6' : 'translate-x-0'}`}></span>
                      </button>
                    </div>
                    {state.arabicTextBackground && <div className="mt-3 space-y-3">
                        <div>
                          <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Background Color
                          </label>
                          <div className="flex items-center">
                            <input type="color" value={state.arabicTextBackgroundColor.startsWith('rgba') ? '#ffffff' : state.arabicTextBackgroundColor} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'arabicTextBackgroundColor',
                            value: e.target.value
                          }
                        });
                      }} onBlur={() => saveToHistory()} className="w-10 h-8 rounded border p-1" />
                            <input type="text" value={state.arabicTextBackgroundColor} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'arabicTextBackgroundColor',
                            value: e.target.value
                          }
                        });
                      }} onBlur={() => saveToHistory()} placeholder="rgba(255,255,255,0.5)" className={`ml-2 flex-1 p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Padding: {state.arabicTextBackgroundPadding}px
                          </label>
                          <input type="range" min="0" max="50" value={state.arabicTextBackgroundPadding} onChange={e => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'arabicTextBackgroundPadding',
                          value: parseInt(e.target.value)
                        }
                      });
                    }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                        </div>
                      </div>}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Text Outline
                      </label>
                      <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.arabicTextOutline ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={() => {
                    dispatch({
                      type: 'UPDATE_FIELD',
                      payload: {
                        field: 'arabicTextOutline',
                        value: !state.arabicTextOutline
                      }
                    });
                    saveToHistory();
                  }}>
                        <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.arabicTextOutline ? 'translate-x-6' : 'translate-x-0'}`}></span>
                      </button>
                    </div>
                    {state.arabicTextOutline && <div className="mt-3 space-y-3">
                        <div>
                          <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Outline Color
                          </label>
                          <div className="flex items-center">
                            <input type="color" value={state.arabicTextOutlineColor} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'arabicTextOutlineColor',
                            value: e.target.value
                          }
                        });
                      }} onBlur={() => saveToHistory()} className="w-10 h-8 rounded border p-1" />
                            <input type="text" value={state.arabicTextOutlineColor} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'arabicTextOutlineColor',
                            value: e.target.value
                          }
                        });
                      }} onBlur={() => saveToHistory()} className={`ml-2 flex-1 p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Width: {state.arabicTextOutlineWidth}px
                          </label>
                          <input type="range" min="1" max="10" value={state.arabicTextOutlineWidth} onChange={e => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'arabicTextOutlineWidth',
                          value: parseInt(e.target.value)
                        }
                      });
                    }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                        </div>
                      </div>}
                  </div>
                </div>}
            </div>
          </div>;
      case 'english':
        return <div className="space-y-5">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                English Text
              </label>
              <textarea value={state.englishText} onChange={e => {
              dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                  field: 'englishText',
                  value: e.target.value
                }
              });
            }} onBlur={() => saveToHistory()} className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} rows={4}></textarea>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Font
              </label>
              <select value={state.englishFont} onChange={e => {
              dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                  field: 'englishFont',
                  value: e.target.value
                }
              });
              saveToHistory();
            }} className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}>
                {englishFonts.map(font => <option key={font.value} value={font.value}>
                    {font.label}
                  </option>)}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Color
              </label>
              <div className="flex items-center">
                <input type="color" value={state.englishColor} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'englishColor',
                    value: e.target.value
                  }
                });
              }} onBlur={() => saveToHistory()} className="w-12 h-10 rounded border p-1" />
                <input type="text" value={state.englishColor} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'englishColor',
                    value: e.target.value
                  }
                });
              }} onBlur={() => saveToHistory()} className={`ml-2 flex-1 p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Alignment
              </label>
              <div className="flex space-x-2">
                <button onClick={() => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'englishAlignment',
                    value: 'left'
                  }
                });
                saveToHistory();
              }} className={`flex-1 p-3 flex justify-center items-center rounded-lg ${state.englishAlignment === 'left' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                  <AlignLeft size={20} />
                </button>
                <button onClick={() => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'englishAlignment',
                    value: 'center'
                  }
                });
                saveToHistory();
              }} className={`flex-1 p-3 flex justify-center items-center rounded-lg ${state.englishAlignment === 'center' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                  <AlignCenter size={20} />
                </button>
                <button onClick={() => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'englishAlignment',
                    value: 'right'
                  }
                });
                saveToHistory();
              }} className={`flex-1 p-3 flex justify-center items-center rounded-lg ${state.englishAlignment === 'right' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                  <AlignRight size={20} />
                </button>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Style
              </label>
              <div className="flex space-x-2">
                <button onClick={() => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'englishBold',
                    value: !state.englishBold
                  }
                });
                saveToHistory();
              }} className={`flex-1 p-3 flex justify-center items-center rounded-lg ${state.englishBold ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                  <Bold size={20} />
                </button>
                <button onClick={() => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'englishItalic',
                    value: !state.englishItalic
                  }
                });
                saveToHistory();
              }} className={`flex-1 p-3 flex justify-center items-center rounded-lg ${state.englishItalic ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                  <Italic size={20} />
                </button>
                <button onClick={() => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'englishUnderline',
                    value: !state.englishUnderline
                  }
                });
                saveToHistory();
              }} className={`flex-1 p-3 flex justify-center items-center rounded-lg ${state.englishUnderline ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                  <Underline size={20} />
                </button>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Size: {state.englishSize}px
              </label>
              <input type="range" min="10" max="100" value={state.englishSize} onChange={e => {
              dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                  field: 'englishSize',
                  value: parseInt(e.target.value)
                }
              });
            }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Line Height: {state.englishLineHeight}
              </label>
              <input type="range" min="0.8" max="3" step="0.1" value={state.englishLineHeight} onChange={e => {
              dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                  field: 'englishLineHeight',
                  value: parseFloat(e.target.value)
                }
              });
            }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Letter Spacing: {state.englishLetterSpacing}px
              </label>
              <input type="range" min="-5" max="20" value={state.englishLetterSpacing} onChange={e => {
              dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                  field: 'englishLetterSpacing',
                  value: parseInt(e.target.value)
                }
              });
            }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Rotation: {state.englishTextRotation}°
              </label>
              <input type="range" min="-180" max="180" value={state.englishTextRotation} onChange={e => {
              dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                  field: 'englishTextRotation',
                  value: parseInt(e.target.value)
                }
              });
            }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button onClick={() => setShowAdvancedSettings(!showAdvancedSettings)} className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                <span className="font-medium">Advanced Settings</span>
                <span className={`transform transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`}>
                  <ArrowUpDown size={16} />
                </span>
              </button>
              {showAdvancedSettings && <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Text Shadow
                      </label>
                      <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.englishTextShadow ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={() => {
                    dispatch({
                      type: 'UPDATE_FIELD',
                      payload: {
                        field: 'englishTextShadow',
                        value: !state.englishTextShadow
                      }
                    });
                    saveToHistory();
                  }}>
                        <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.englishTextShadow ? 'translate-x-6' : 'translate-x-0'}`}></span>
                      </button>
                    </div>
                    {state.englishTextShadow && <div className="mt-3 space-y-3">
                        <div>
                          <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Shadow Color
                          </label>
                          <div className="flex items-center">
                            <input type="color" value={state.englishTextShadowColor} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'englishTextShadowColor',
                            value: e.target.value
                          }
                        });
                      }} onBlur={() => saveToHistory()} className="w-10 h-8 rounded border p-1" />
                            <input type="text" value={state.englishTextShadowColor} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'englishTextShadowColor',
                            value: e.target.value
                          }
                        });
                      }} onBlur={() => saveToHistory()} className={`ml-2 flex-1 p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Blur: {state.englishTextShadowBlur}px
                          </label>
                          <input type="range" min="0" max="20" value={state.englishTextShadowBlur} onChange={e => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'englishTextShadowBlur',
                          value: parseInt(e.target.value)
                        }
                      });
                    }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Offset: {state.englishTextShadowOffset}px
                          </label>
                          <input type="range" min="0" max="20" value={state.englishTextShadowOffset} onChange={e => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'englishTextShadowOffset',
                          value: parseInt(e.target.value)
                        }
                      });
                    }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                        </div>
                      </div>}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Text Background
                      </label>
                      <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.englishTextBackground ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={() => {
                    dispatch({
                      type: 'UPDATE_FIELD',
                      payload: {
                        field: 'englishTextBackground',
                        value: !state.englishTextBackground
                      }
                    });
                    saveToHistory();
                  }}>
                        <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.englishTextBackground ? 'translate-x-6' : 'translate-x-0'}`}></span>
                      </button>
                    </div>
                    {state.englishTextBackground && <div className="mt-3 space-y-3">
                        <div>
                          <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Background Color
                          </label>
                          <div className="flex items-center">
                            <input type="color" value={state.englishTextBackgroundColor.startsWith('rgba') ? '#ffffff' : state.englishTextBackgroundColor} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'englishTextBackgroundColor',
                            value: e.target.value
                          }
                        });
                      }} onBlur={() => saveToHistory()} className="w-10 h-8 rounded border p-1" />
                            <input type="text" value={state.englishTextBackgroundColor} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'englishTextBackgroundColor',
                            value: e.target.value
                          }
                        });
                      }} onBlur={() => saveToHistory()} placeholder="rgba(255,255,255,0.5)" className={`ml-2 flex-1 p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Padding: {state.englishTextBackgroundPadding}px
                          </label>
                          <input type="range" min="0" max="50" value={state.englishTextBackgroundPadding} onChange={e => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'englishTextBackgroundPadding',
                          value: parseInt(e.target.value)
                        }
                      });
                    }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                        </div>
                      </div>}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Text Outline
                      </label>
                      <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.englishTextOutline ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={() => {
                    dispatch({
                      type: 'UPDATE_FIELD',
                      payload: {
                        field: 'englishTextOutline',
                        value: !state.englishTextOutline
                      }
                    });
                    saveToHistory();
                  }}>
                        <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.englishTextOutline ? 'translate-x-6' : 'translate-x-0'}`}></span>
                      </button>
                    </div>
                    {state.englishTextOutline && <div className="mt-3 space-y-3">
                        <div>
                          <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Outline Color
                          </label>
                          <div className="flex items-center">
                            <input type="color" value={state.englishTextOutlineColor} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'englishTextOutlineColor',
                            value: e.target.value
                          }
                        });
                      }} onBlur={() => saveToHistory()} className="w-10 h-8 rounded border p-1" />
                            <input type="text" value={state.englishTextOutlineColor} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'englishTextOutlineColor',
                            value: e.target.value
                          }
                        });
                      }} onBlur={() => saveToHistory()} className={`ml-2 flex-1 p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Width: {state.englishTextOutlineWidth}px
                          </label>
                          <input type="range" min="1" max="10" value={state.englishTextOutlineWidth} onChange={e => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'englishTextOutlineWidth',
                          value: parseInt(e.target.value)
                        }
                      });
                    }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                        </div>
                      </div>}
                  </div>
                </div>}
            </div>
          </div>;
      case 'reference':
        return <div className="space-y-5">
            <div className="flex items-center justify-between">
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Show Reference
              </label>
              <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.showReference ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={toggleReferenceVisibility}>
                <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.showReference ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>
            {state.showReference && <>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Reference Text
                  </label>
                  <input type="text" value={state.referenceText} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'referenceText',
                    value: e.target.value
                  }
                });
              }} onBlur={() => saveToHistory()} className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Font
                  </label>
                  <select value={state.referenceFont} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'referenceFont',
                    value: e.target.value
                  }
                });
                saveToHistory();
              }} className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}>
                    {arabicFonts.map(font => <option key={font.value} value={font.value}>
                        {font.label}
                      </option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Color
                  </label>
                  <div className="flex items-center">
                    <input type="color" value={state.referenceColor} onChange={e => {
                  dispatch({
                    type: 'UPDATE_FIELD',
                    payload: {
                      field: 'referenceColor',
                      value: e.target.value
                    }
                  });
                }} onBlur={() => saveToHistory()} className="w-12 h-10 rounded border p-1" />
                    <input type="text" value={state.referenceColor} onChange={e => {
                  dispatch({
                    type: 'UPDATE_FIELD',
                    payload: {
                      field: 'referenceColor',
                      value: e.target.value
                    }
                  });
                }} onBlur={() => saveToHistory()} className={`ml-2 flex-1 p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Size: {state.referenceSize}px
                  </label>
                  <input type="range" min="10" max="100" value={state.referenceSize} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'referenceSize',
                    value: parseInt(e.target.value)
                  }
                });
              }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Line Height: {state.referenceLineHeight}
                  </label>
                  <input type="range" min="0.8" max="3" step="0.1" value={state.referenceLineHeight} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'referenceLineHeight',
                    value: parseFloat(e.target.value)
                  }
                });
              }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Letter Spacing: {state.referenceLetterSpacing}px
                  </label>
                  <input type="range" min="-5" max="20" value={state.referenceLetterSpacing} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'referenceLetterSpacing',
                    value: parseInt(e.target.value)
                  }
                });
              }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Rotation: {state.referenceTextRotation}°
                  </label>
                  <input type="range" min="-180" max="180" value={state.referenceTextRotation} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'referenceTextRotation',
                    value: parseInt(e.target.value)
                  }
                });
              }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => setShowAdvancedSettings(!showAdvancedSettings)} className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                    <span className="font-medium">Advanced Settings</span>
                    <span className={`transform transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`}>
                      <ArrowUpDown size={16} />
                    </span>
                  </button>
                  {showAdvancedSettings && <div className="mt-4 space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Text Shadow
                          </label>
                          <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.referenceTextShadow ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={() => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'referenceTextShadow',
                          value: !state.referenceTextShadow
                        }
                      });
                      saveToHistory();
                    }}>
                            <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.referenceTextShadow ? 'translate-x-6' : 'translate-x-0'}`}></span>
                          </button>
                        </div>
                        {state.referenceTextShadow && <div className="mt-3 space-y-3">
                            <div>
                              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Shadow Color
                              </label>
                              <div className="flex items-center">
                                <input type="color" value={state.referenceTextShadowColor} onChange={e => {
                          dispatch({
                            type: 'UPDATE_FIELD',
                            payload: {
                              field: 'referenceTextShadowColor',
                              value: e.target.value
                            }
                          });
                        }} onBlur={() => saveToHistory()} className="w-10 h-8 rounded border p-1" />
                                <input type="text" value={state.referenceTextShadowColor} onChange={e => {
                          dispatch({
                            type: 'UPDATE_FIELD',
                            payload: {
                              field: 'referenceTextShadowColor',
                              value: e.target.value
                            }
                          });
                        }} onBlur={() => saveToHistory()} className={`ml-2 flex-1 p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                              </div>
                            </div>
                            <div>
                              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Blur: {state.referenceTextShadowBlur}px
                              </label>
                              <input type="range" min="0" max="20" value={state.referenceTextShadowBlur} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'referenceTextShadowBlur',
                            value: parseInt(e.target.value)
                          }
                        });
                      }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                            </div>
                            <div>
                              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Offset: {state.referenceTextShadowOffset}px
                              </label>
                              <input type="range" min="0" max="20" value={state.referenceTextShadowOffset} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'referenceTextShadowOffset',
                            value: parseInt(e.target.value)
                          }
                        });
                      }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                            </div>
                          </div>}
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Text Background
                          </label>
                          <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.referenceTextBackground ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={() => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'referenceTextBackground',
                          value: !state.referenceTextBackground
                        }
                      });
                      saveToHistory();
                    }}>
                            <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.referenceTextBackground ? 'translate-x-6' : 'translate-x-0'}`}></span>
                          </button>
                        </div>
                        {state.referenceTextBackground && <div className="mt-3 space-y-3">
                            <div>
                              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Background Color
                              </label>
                              <div className="flex items-center">
                                <input type="color" value={state.referenceTextBackgroundColor.startsWith('rgba') ? '#ffffff' : state.referenceTextBackgroundColor} onChange={e => {
                          dispatch({
                            type: 'UPDATE_FIELD',
                            payload: {
                              field: 'referenceTextBackgroundColor',
                              value: e.target.value
                            }
                          });
                        }} onBlur={() => saveToHistory()} className="w-10 h-8 rounded border p-1" />
                                <input type="text" value={state.referenceTextBackgroundColor} onChange={e => {
                          dispatch({
                            type: 'UPDATE_FIELD',
                            payload: {
                              field: 'referenceTextBackgroundColor',
                              value: e.target.value
                            }
                          });
                        }} onBlur={() => saveToHistory()} placeholder="rgba(255,255,255,0.5)" className={`ml-2 flex-1 p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                              </div>
                            </div>
                            <div>
                              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Padding: {state.referenceTextBackgroundPadding}
                                px
                              </label>
                              <input type="range" min="0" max="50" value={state.referenceTextBackgroundPadding} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'referenceTextBackgroundPadding',
                            value: parseInt(e.target.value)
                          }
                        });
                      }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                            </div>
                          </div>}
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Text Outline
                          </label>
                          <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.referenceTextOutline ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={() => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'referenceTextOutline',
                          value: !state.referenceTextOutline
                        }
                      });
                      saveToHistory();
                    }}>
                            <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.referenceTextOutline ? 'translate-x-6' : 'translate-x-0'}`}></span>
                          </button>
                        </div>
                        {state.referenceTextOutline && <div className="mt-3 space-y-3">
                            <div>
                              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Outline Color
                              </label>
                              <div className="flex items-center">
                                <input type="color" value={state.referenceTextOutlineColor} onChange={e => {
                          dispatch({
                            type: 'UPDATE_FIELD',
                            payload: {
                              field: 'referenceTextOutlineColor',
                              value: e.target.value
                            }
                          });
                        }} onBlur={() => saveToHistory()} className="w-10 h-8 rounded border p-1" />
                                <input type="text" value={state.referenceTextOutlineColor} onChange={e => {
                          dispatch({
                            type: 'UPDATE_FIELD',
                            payload: {
                              field: 'referenceTextOutlineColor',
                              value: e.target.value
                            }
                          });
                        }} onBlur={() => saveToHistory()} className={`ml-2 flex-1 p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                              </div>
                            </div>
                            <div>
                              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Width: {state.referenceTextOutlineWidth}px
                              </label>
                              <input type="range" min="1" max="10" value={state.referenceTextOutlineWidth} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'referenceTextOutlineWidth',
                            value: parseInt(e.target.value)
                          }
                        });
                      }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                            </div>
                          </div>}
                      </div>
                    </div>}
                </div>
              </>}
          </div>;
      case 'watermark':
        return <div className="space-y-5">
            <div className="flex items-center justify-between">
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Show Watermark
              </label>
              <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.showWatermark ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={toggleWatermarkVisibility}>
                <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.showWatermark ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>
            {state.showWatermark && <>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Watermark Text
                  </label>
                  <input type="text" value={state.watermarkText} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'watermarkText',
                    value: e.target.value
                  }
                });
              }} onBlur={() => saveToHistory()} className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Font
                  </label>
                  <select value={state.watermarkFont} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'watermarkFont',
                    value: e.target.value
                  }
                });
                saveToHistory();
              }} className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}>
                    {arabicFonts.map(font => <option key={font.value} value={font.value}>
                        {font.label}
                      </option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Color
                  </label>
                  <div className="flex items-center">
                    <input type="color" value={state.watermarkColor} onChange={e => {
                  dispatch({
                    type: 'UPDATE_FIELD',
                    payload: {
                      field: 'watermarkColor',
                      value: e.target.value
                    }
                  });
                }} onBlur={() => saveToHistory()} className="w-12 h-10 rounded border p-1" />
                    <input type="text" value={state.watermarkColor} onChange={e => {
                  dispatch({
                    type: 'UPDATE_FIELD',
                    payload: {
                      field: 'watermarkColor',
                      value: e.target.value
                    }
                  });
                }} onBlur={() => saveToHistory()} className={`ml-2 flex-1 p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Size: {state.watermarkSize}px
                  </label>
                  <input type="range" min="10" max="100" value={state.watermarkSize} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'watermarkSize',
                    value: parseInt(e.target.value)
                  }
                });
              }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Opacity: {state.watermarkOpacity}%
                  </label>
                  <input type="range" min="1" max="100" value={state.watermarkOpacity} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'watermarkOpacity',
                    value: parseInt(e.target.value)
                  }
                });
              }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Rotation: {state.watermarkRotation}°
                  </label>
                  <input type="range" min="-180" max="180" value={state.watermarkRotation} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'watermarkRotation',
                    value: parseInt(e.target.value)
                  }
                });
              }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => setShowAdvancedSettings(!showAdvancedSettings)} className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                    <span className="font-medium">Advanced Settings</span>
                    <span className={`transform transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`}>
                      <ArrowUpDown size={16} />
                    </span>
                  </button>
                  {showAdvancedSettings && <div className="mt-4 space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Text Shadow
                          </label>
                          <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.watermarkTextShadow ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={() => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'watermarkTextShadow',
                          value: !state.watermarkTextShadow
                        }
                      });
                      saveToHistory();
                    }}>
                            <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.watermarkTextShadow ? 'translate-x-6' : 'translate-x-0'}`}></span>
                          </button>
                        </div>
                        {state.watermarkTextShadow && <div className="mt-3 space-y-3">
                            <div>
                              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Shadow Color
                              </label>
                              <div className="flex items-center">
                                <input type="color" value={state.watermarkTextShadowColor} onChange={e => {
                          dispatch({
                            type: 'UPDATE_FIELD',
                            payload: {
                              field: 'watermarkTextShadowColor',
                              value: e.target.value
                            }
                          });
                        }} onBlur={() => saveToHistory()} className="w-10 h-8 rounded border p-1" />
                                <input type="text" value={state.watermarkTextShadowColor} onChange={e => {
                          dispatch({
                            type: 'UPDATE_FIELD',
                            payload: {
                              field: 'watermarkTextShadowColor',
                              value: e.target.value
                            }
                          });
                        }} onBlur={() => saveToHistory()} className={`ml-2 flex-1 p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                              </div>
                            </div>
                            <div>
                              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Blur: {state.watermarkTextShadowBlur}px
                              </label>
                              <input type="range" min="0" max="20" value={state.watermarkTextShadowBlur} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'watermarkTextShadowBlur',
                            value: parseInt(e.target.value)
                          }
                        });
                      }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                            </div>
                            <div>
                              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Offset: {state.watermarkTextShadowOffset}px
                              </label>
                              <input type="range" min="0" max="20" value={state.watermarkTextShadowOffset} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'watermarkTextShadowOffset',
                            value: parseInt(e.target.value)
                          }
                        });
                      }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                            </div>
                          </div>}
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Text Background
                          </label>
                          <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.watermarkTextBackground ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={() => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'watermarkTextBackground',
                          value: !state.watermarkTextBackground
                        }
                      });
                      saveToHistory();
                    }}>
                            <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.watermarkTextBackground ? 'translate-x-6' : 'translate-x-0'}`}></span>
                          </button>
                        </div>
                        {state.watermarkTextBackground && <div className="mt-3 space-y-3">
                            <div>
                              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Background Color
                              </label>
                              <div className="flex items-center">
                                <input type="color" value={state.watermarkTextBackgroundColor.startsWith('rgba') ? '#ffffff' : state.watermarkTextBackgroundColor} onChange={e => {
                          dispatch({
                            type: 'UPDATE_FIELD',
                            payload: {
                              field: 'watermarkTextBackgroundColor',
                              value: e.target.value
                            }
                          });
                        }} onBlur={() => saveToHistory()} className="w-10 h-8 rounded border p-1" />
                                <input type="text" value={state.watermarkTextBackgroundColor} onChange={e => {
                          dispatch({
                            type: 'UPDATE_FIELD',
                            payload: {
                              field: 'watermarkTextBackgroundColor',
                              value: e.target.value
                            }
                          });
                        }} onBlur={() => saveToHistory()} placeholder="rgba(255,255,255,0.5)" className={`ml-2 flex-1 p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                              </div>
                            </div>
                            <div>
                              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Padding: {state.watermarkTextBackgroundPadding}
                                px
                              </label>
                              <input type="range" min="0" max="50" value={state.watermarkTextBackgroundPadding} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'watermarkTextBackgroundPadding',
                            value: parseInt(e.target.value)
                          }
                        });
                      }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                            </div>
                          </div>}
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Text Outline
                          </label>
                          <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.watermarkTextOutline ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={() => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'watermarkTextOutline',
                          value: !state.watermarkTextOutline
                        }
                      });
                      saveToHistory();
                    }}>
                            <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.watermarkTextOutline ? 'translate-x-6' : 'translate-x-0'}`}></span>
                          </button>
                        </div>
                        {state.watermarkTextOutline && <div className="mt-3 space-y-3">
                            <div>
                              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Outline Color
                              </label>
                              <div className="flex items-center">
                                <input type="color" value={state.watermarkTextOutlineColor} onChange={e => {
                          dispatch({
                            type: 'UPDATE_FIELD',
                            payload: {
                              field: 'watermarkTextOutlineColor',
                              value: e.target.value
                            }
                          });
                        }} onBlur={() => saveToHistory()} className="w-10 h-8 rounded border p-1" />
                                <input type="text" value={state.watermarkTextOutlineColor} onChange={e => {
                          dispatch({
                            type: 'UPDATE_FIELD',
                            payload: {
                              field: 'watermarkTextOutlineColor',
                              value: e.target.value
                            }
                          });
                        }} onBlur={() => saveToHistory()} className={`ml-2 flex-1 p-2 text-sm rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                              </div>
                            </div>
                            <div>
                              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Width: {state.watermarkTextOutlineWidth}px
                              </label>
                              <input type="range" min="1" max="10" value={state.watermarkTextOutlineWidth} onChange={e => {
                        dispatch({
                          type: 'UPDATE_FIELD',
                          payload: {
                            field: 'watermarkTextOutlineWidth',
                            value: parseInt(e.target.value)
                          }
                        });
                      }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                            </div>
                          </div>}
                      </div>
                    </div>}
                </div>
              </>}
          </div>;
      case 'background':
        return <div className="space-y-5">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Background Color
              </label>
              <div className="flex items-center">
                <input type="color" value={state.backgroundColor} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'backgroundColor',
                    value: e.target.value
                  }
                });
              }} onBlur={() => saveToHistory()} className="w-12 h-10 rounded border p-1" />
                <input type="text" value={state.backgroundColor} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'backgroundColor',
                    value: e.target.value
                  }
                });
              }} onBlur={() => saveToHistory()} className={`ml-2 flex-1 p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Background Image
              </label>
              <div className="flex items-center space-x-2">
                <label className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 border-dashed cursor-pointer ${darkMode ? 'border-gray-700 hover:border-gray-600 bg-gray-800 text-gray-300' : 'border-gray-300 hover:border-gray-400 bg-gray-50 text-gray-700'} transition-colors`}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <div className="flex flex-col items-center">
                    <ImageIcon size={24} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                    <span className="mt-2 text-sm">
                      {state.backgroundImage ? 'Change Image' : 'Upload Image'}
                    </span>
                  </div>
                </label>
                {state.backgroundImage && <button onClick={() => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'backgroundImage',
                    value: ''
                  }
                });
                saveToHistory();
              }} className={`p-3 rounded-lg ${darkMode ? 'bg-red-900 hover:bg-red-800 text-white' : 'bg-red-100 hover:bg-red-200 text-red-600'} transition-colors`}>
                    <Trash2 size={20} />
                  </button>}
              </div>
            </div>
            {state.backgroundImage && <>
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Lock Background
                  </label>
                  <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.backgroundLocked ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={toggleBackgroundLock}>
                    <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.backgroundLocked ? 'translate-x-6' : 'translate-x-0'}`}></span>
                  </button>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Opacity: {state.backgroundOpacity}%
                  </label>
                  <input type="range" min="1" max="100" value={state.backgroundOpacity} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'backgroundOpacity',
                    value: parseInt(e.target.value)
                  }
                });
              }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Brightness: {state.brightness}%
                  </label>
                  <input type="range" min="10" max="200" value={state.brightness} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'brightness',
                    value: parseInt(e.target.value)
                  }
                });
              }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Contrast: {state.contrast}%
                  </label>
                  <input type="range" min="10" max="200" value={state.contrast} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'contrast',
                    value: parseInt(e.target.value)
                  }
                });
              }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Blur: {state.blur}px
                  </label>
                  <input type="range" min="0" max="20" value={state.blur} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'blur',
                    value: parseInt(e.target.value)
                  }
                });
              }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                </div>
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Background Overlay
                  </label>
                  <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${state.backgroundOverlay ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} onClick={() => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'backgroundOverlay',
                    value: !state.backgroundOverlay
                  }
                });
                saveToHistory();
              }}>
                    <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${state.backgroundOverlay ? 'translate-x-6' : 'translate-x-0'}`}></span>
                  </button>
                </div>
                {state.backgroundOverlay && <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Overlay Color
                    </label>
                    <div className="flex items-center">
                      <input type="color" value={state.backgroundOverlayColor.startsWith('rgba') ? '#000000' : state.backgroundOverlayColor} onChange={e => {
                  const hexColor = e.target.value;
                  const rgba = `rgba(${parseInt(hexColor.substring(1, 3), 16)}, ${parseInt(hexColor.substring(3, 5), 16)}, ${parseInt(hexColor.substring(5, 7), 16)}, 0.3)`;
                  dispatch({
                    type: 'UPDATE_FIELD',
                    payload: {
                      field: 'backgroundOverlayColor',
                      value: rgba
                    }
                  });
                }} onBlur={() => saveToHistory()} className="w-12 h-10 rounded border p-1" />
                      <input type="text" value={state.backgroundOverlayColor} onChange={e => {
                  dispatch({
                    type: 'UPDATE_FIELD',
                    payload: {
                      field: 'backgroundOverlayColor',
                      value: e.target.value
                    }
                  });
                }} onBlur={() => saveToHistory()} placeholder="rgba(0,0,0,0.3)" className={`ml-2 flex-1 p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                    </div>
                  </div>}
              </>}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button onClick={() => setShowCanvasSettings(!showCanvasSettings)} className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                <span className="font-medium">Canvas Settings</span>
                <span className={`transform transition-transform ${showCanvasSettings ? 'rotate-180' : ''}`}>
                  <ArrowUpDown size={16} />
                </span>
              </button>
              {showCanvasSettings && <div className="mt-4 space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Canvas Size
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Width (px)
                        </label>
                        <input type="number" value={state.canvasWidth} onChange={e => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'canvasWidth',
                          value: parseInt(e.target.value)
                        }
                      });
                    }} onBlur={() => saveToHistory()} min="100" max="4000" className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                      </div>
                      <div>
                        <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Height (px)
                        </label>
                        <input type="number" value={state.canvasHeight} onChange={e => {
                      dispatch({
                        type: 'UPDATE_FIELD',
                        payload: {
                          field: 'canvasHeight',
                          value: parseInt(e.target.value)
                        }
                      });
                    }} onBlur={() => saveToHistory()} min="100" max="4000" className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Preset Ratios
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleCanvasRatioChange('square')} className={`p-2 text-sm rounded-lg ${state.canvasRatio === 'square' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}>
                        Square (1:1)
                      </button>
                      <button onClick={() => handleCanvasRatioChange('portrait')} className={`p-2 text-sm rounded-lg ${state.canvasRatio === 'portrait' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}>
                        Portrait (4:5)
                      </button>
                      <button onClick={() => handleCanvasRatioChange('landscape')} className={`p-2 text-sm rounded-lg ${state.canvasRatio === 'landscape' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}>
                        Landscape (5:4)
                      </button>
                      <button onClick={() => handleCanvasRatioChange('story')} className={`p-2 text-sm rounded-lg ${state.canvasRatio === 'story' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}>
                        Story (9:16)
                      </button>
                      <button onClick={() => handleCanvasRatioChange('widescreen')} className={`p-2 text-sm rounded-lg ${state.canvasRatio === 'widescreen' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors col-span-2`}>
                        Widescreen (16:9)
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Canvas Padding: {state.canvasPadding}px
                    </label>
                    <input type="range" min="0" max="100" value={state.canvasPadding} onChange={e => {
                  dispatch({
                    type: 'UPDATE_FIELD',
                    payload: {
                      field: 'canvasPadding',
                      value: parseInt(e.target.value)
                    }
                  });
                }} onMouseUp={() => saveToHistory()} onTouchEnd={() => saveToHistory()} className="w-full" />
                  </div>
                </div>}
            </div>
          </div>;
      case 'templates':
        return <div className="space-y-5">
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Templates
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose a template to quickly apply predefined styles.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {templates.map(template => <button key={template.name} onClick={() => applyTemplate(template)} className={`p-4 rounded-lg border text-left transition-all hover:shadow-md ${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                  <div className="w-full h-24 mb-3 rounded-md" style={{
                backgroundColor: template.settings.backgroundColor
              }}></div>
                  <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {template.name}
                  </h4>
                </button>)}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Background Themes
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Quick background colors.
              </p>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {presetThemes.map(theme => <button key={theme.name} onClick={() => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'backgroundColor',
                    value: theme.color
                  }
                });
                saveToHistory();
              }} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border shadow-sm hover:scale-110 transition-transform" style={{
                  backgroundColor: theme.color,
                  borderColor: theme.color === '#ffffff' ? '#e5e7eb' : theme.color
                }}></div>
                    <span className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {theme.name}
                    </span>
                  </button>)}
              </div>
            </div>
          </div>;
      case 'export':
        return <div className="space-y-5">
            <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Export Settings
            </h3>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                File Name
              </label>
              <input type="text" value={exportFileName} onChange={e => setExportFileName(e.target.value)} className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Format
              </label>
              <div className="flex space-x-2">
                <button onClick={() => setExportFormat('png')} className={`flex-1 p-3 rounded-lg ${exportFormat === 'png' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                  PNG
                </button>
                <button onClick={() => setExportFormat('jpeg')} className={`flex-1 p-3 rounded-lg ${exportFormat === 'jpeg' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                  JPEG
                </button>
              </div>
            </div>
            {exportFormat === 'jpeg' && <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Quality: {exportQuality * 100}%
                </label>
                <input type="range" min="0.1" max="1" step="0.1" value={exportQuality} onChange={e => setExportQuality(parseFloat(e.target.value))} className="w-full" />
              </div>}
            <div className="pt-4">
              <button onClick={handleDownload} className={`w-full flex items-center justify-center px-4 py-3 rounded-lg shadow-sm hover:shadow transition-all ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                <Download size={18} className="mr-2" />
                Download Image
              </button>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-3">
                <button onClick={handleSave} className={`flex items-center justify-center px-4 py-3 rounded-lg shadow-sm hover:shadow transition-all ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  <Save size={18} className="mr-2" />
                  Save Design
                </button>
                <button onClick={handleLoad} className={`flex items-center justify-center px-4 py-3 rounded-lg shadow-sm hover:shadow transition-all ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  <Upload size={18} className="mr-2" />
                  Load Saved Design
                </button>
                <button onClick={handleReset} className={`flex items-center justify-center px-4 py-3 rounded-lg shadow-sm hover:shadow transition-all ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  <RefreshCw size={18} className="mr-2" />
                  Reset to Default
                </button>
              </div>
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <div className={`flex flex-col md:flex-row h-screen ${darkMode ? 'bg-black text-gray-100' : 'bg-[#f7f9fb] text-gray-800'} font-sans transition-colors duration-300`}>
      {/* Mobile Header */}
      <div className={`md:hidden flex items-center justify-between p-4 border-b ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} transition-colors`}>
        <h1 className="text-xl font-semibold">Islamic Quote Generator</h1>
        <div className="flex items-center space-x-2">
          <button onClick={toggleDarkMode} className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-300' : 'bg-gray-100 text-gray-700'} transition-colors`} aria-label="Toggle dark mode">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
            {sidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-80 lg:w-96 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r overflow-y-auto transition-all duration-300 ease-in-out`}>
        <div className={`hidden md:flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <h1 className="text-xl font-semibold">Islamic Quote Generator</h1>
          <div className="flex items-center space-x-2">
            <button onClick={handleUndo} className={`p-2 rounded-full ${state.historyIndex <= 0 ? darkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-100 text-gray-400' : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`} aria-label="Undo" title="Undo (Ctrl+Z)">
              <RotateCcw size={16} />
            </button>
            <button onClick={handleRedo} className={`p-2 rounded-full ${state.historyIndex >= state.history?.length - 1 ? darkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-100 text-gray-400' : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`} aria-label="Redo" title="Redo (Ctrl+Y)">
              <RotateCw size={16} />
            </button>
            <button onClick={toggleDarkMode} className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`} aria-label="Toggle dark mode" title="Toggle dark mode">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className={`flex border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          {tabItems.map(tab => <button key={tab.id} className={`flex-1 py-4 px-2 flex flex-col items-center justify-center text-sm transition-all ${activeTab === tab.id ? darkMode ? 'border-b-2 border-blue-400 text-blue-400' : 'border-b-2 border-blue-500 text-blue-500' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`} onClick={() => setActiveTab(tab.id)}>
              <span className="mb-1">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>)}
        </div>
        {/* Tab Content */}
        <div className="p-5">{renderTabContent()}</div>
        {/* Additional Controls */}
        <div className={`p-5 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Show Grid</span>
            <button className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${showGrid ? 'bg-blue-500' : darkMode ? 'bg-gray-800' : 'bg-gray-300'}`} onClick={() => setShowGrid(!showGrid)}>
              <span className={`block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out bg-white ${showGrid ? 'translate-x-6' : 'translate-x-0'}`}></span>
            </button>
          </div>
          {/* Keyboard shortcuts info */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium mb-2">Keyboard Shortcuts</h3>
            <ul className="text-xs space-y-1">
              <li className="flex justify-between">
                <span>Undo</span>
                <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  Ctrl+Z
                </span>
              </li>
              <li className="flex justify-between">
                <span>Redo</span>
                <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  Ctrl+Y
                </span>
              </li>
              <li className="flex justify-between">
                <span>Save</span>
                <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                  Ctrl+S
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${darkMode ? 'bg-black' : 'bg-[#f7f9fb]'}`}>
        {/* Canvas Size Controls */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b p-3 flex items-center justify-between transition-colors`}>
          <div className="flex items-center">
            <button onClick={() => setShowCanvasSizeControls(!showCanvasSizeControls)} className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}>
              <Sliders size={16} />
              <span className="text-sm font-medium">Canvas Size</span>
              <span className={`transform transition-transform ${showCanvasSizeControls ? 'rotate-180' : ''}`}>
                <ArrowUpDown size={14} />
              </span>
            </button>
            {showCanvasSizeControls && <div className="ml-4 flex items-center space-x-2">
                <div className={`flex items-center space-x-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span>W:</span>
                  <input type="number" value={state.canvasWidth} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'canvasWidth',
                    value: parseInt(e.target.value)
                  }
                });
              }} onBlur={() => saveToHistory()} min="100" max="4000" className={`w-16 p-1 rounded border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <span>H:</span>
                  <input type="number" value={state.canvasHeight} onChange={e => {
                dispatch({
                  type: 'UPDATE_FIELD',
                  payload: {
                    field: 'canvasHeight',
                    value: parseInt(e.target.value)
                  }
                });
              }} onBlur={() => saveToHistory()} min="100" max="4000" className={`w-16 p-1 rounded border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} shadow-sm`} />
                </div>
              </div>}
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => handleCanvasRatioChange('square')} className={`p-1.5 text-xs rounded-lg ${state.canvasRatio === 'square' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`} title="Square (1:1)">
              1:1
            </button>
            <button onClick={() => handleCanvasRatioChange('portrait')} className={`p-1.5 text-xs rounded-lg ${state.canvasRatio === 'portrait' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`} title="Portrait (4:5)">
              4:5
            </button>
            <button onClick={() => handleCanvasRatioChange('story')} className={`p-1.5 text-xs rounded-lg ${state.canvasRatio === 'story' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`} title="Story (9:16)">
              9:16
            </button>
            <button onClick={() => handleCanvasRatioChange('widescreen')} className={`p-1.5 text-xs rounded-lg ${state.canvasRatio === 'widescreen' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`} title="Widescreen (16:9)">
              16:9
            </button>
          </div>
        </div>
        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          {/* Use our new Canvas component */}
          <Canvas showGrid={showGrid} />
        </div>
        {/* Action Buttons */}
        <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t p-4 transition-colors`}>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={handleDownload} className={`flex items-center px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
              <Download size={18} className="mr-2" />
              Download
            </button>
            <button onClick={handleShare} className={`flex items-center px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}>
              <Share size={18} className="mr-2" />
              Share
            </button>
            <button onClick={handleSave} className={`flex items-center px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}>
              <Save size={18} className="mr-2" />
              Save
            </button>
            <button onClick={handleLoad} className={`flex items-center px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}>
              <Upload size={18} className="mr-2" />
              Load
            </button>
            <button onClick={handleReset} className={`flex items-center px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}>
              <RefreshCw size={18} className="mr-2" />
              Reset
            </button>
          </div>
        </div>
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden fixed bottom-4 right-4 flex flex-col space-y-3">
          <button onClick={toggleDarkMode} className={`p-3 rounded-full shadow-lg ${darkMode ? 'bg-gray-800 text-yellow-300' : 'bg-blue-500 text-white'} transition-colors`} aria-label="Toggle dark mode">
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-3 rounded-full shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-blue-500 text-white'} hover:opacity-90 transition-opacity`}>
            {sidebarOpen ? <X size={24} /> : <Settings size={24} />}
          </button>
        </div>
        {/* History Controls (Mobile) */}
        <div className="md:hidden fixed bottom-4 left-4 flex flex-col space-y-3">
          <button onClick={handleUndo} className={`p-3 rounded-full shadow-lg ${state.historyIndex <= 0 ? 'bg-gray-400 text-gray-600' : 'bg-blue-500 text-white hover:bg-blue-600'} transition-colors`} aria-label="Undo">
            <RotateCcw size={24} />
          </button>
          <button onClick={handleRedo} className={`p-3 rounded-full shadow-lg ${state.historyIndex >= state.history?.length - 1 ? 'bg-gray-400 text-gray-600' : 'bg-blue-500 text-white hover:bg-blue-600'} transition-colors`} aria-label="Redo">
            <RotateCw size={24} />
          </button>
        </div>
      </div>
    </div>;
}