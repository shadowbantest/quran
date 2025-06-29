import React, { useCallback, useState, useRef, Fragment, memo } from 'react';
import { Move } from 'lucide-react';
import { useDesign } from '../contexts/DesignContext';
interface CanvasProps {
  showGrid: boolean;
}
const Canvas: React.FC<CanvasProps> = ({
  showGrid
}) => {
  const {
    state,
    dispatch,
    saveToHistory
  } = useDesign();
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0
  });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Format multiline text for display
  const formatMultilineText = (text: string, element: string) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => <Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </Fragment>);
  };
  // Handle drag start events
  const handleDragStart = useCallback((element: string, e: React.MouseEvent) => {
    setDraggedElement(element);
    setSelectedElement(element);
    if (element === 'background' && !state.backgroundLocked && previewRef.current) {
      const rect = previewRef.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX - rect.left - state.backgroundPosition.x,
        y: e.clientY - rect.top - state.backgroundPosition.y
      });
    }
  }, [state.backgroundLocked, state.backgroundPosition]);
  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedElement || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (draggedElement === 'arabic') {
      dispatch({
        type: 'UPDATE_POSITION',
        payload: {
          field: 'arabicPosition',
          x,
          y
        }
      });
    } else if (draggedElement === 'english') {
      dispatch({
        type: 'UPDATE_POSITION',
        payload: {
          field: 'englishPosition',
          x,
          y
        }
      });
    } else if (draggedElement === 'reference') {
      dispatch({
        type: 'UPDATE_POSITION',
        payload: {
          field: 'referencePosition',
          x,
          y
        }
      });
    } else if (draggedElement === 'watermark') {
      dispatch({
        type: 'UPDATE_POSITION',
        payload: {
          field: 'watermarkPosition',
          x,
          y
        }
      });
    } else if (draggedElement === 'background' && !state.backgroundLocked) {
      dispatch({
        type: 'UPDATE_POSITION',
        payload: {
          field: 'backgroundPosition',
          x: e.clientX - rect.left - dragStart.x,
          y: e.clientY - rect.top - dragStart.y
        }
      });
    }
  }, [draggedElement, dragStart, dispatch, state.backgroundLocked]);
  // Handle mouse up to end dragging
  const handleMouseUp = useCallback(() => {
    if (draggedElement) {
      saveToHistory();
    }
    setDraggedElement(null);
  }, [draggedElement, saveToHistory]);
  return <>
      <div ref={previewRef} className="relative shadow-xl rounded-lg overflow-hidden" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={{
      width: `${state.canvasWidth}px`,
      height: `${state.canvasHeight}px`,
      maxWidth: '100%',
      maxHeight: '100%',
      backgroundColor: state.backgroundGradient ? 'transparent' : state.backgroundColor,
      backgroundImage: state.backgroundGradient ? `linear-gradient(${state.backgroundGradientDirection}, ${state.backgroundGradientColors[0]}, ${state.backgroundGradientColors[1]})` : ''
    }}>
        {/* Background Image with Position */}
        {state.backgroundImage && <div className={`absolute inset-0 ${!state.backgroundLocked && 'cursor-move'} ${draggedElement === 'background' ? 'ring-2 ring-blue-500' : ''}`} style={{
        backgroundImage: `url(${state.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: `calc(50% + ${state.backgroundPosition.x}px) calc(50% + ${state.backgroundPosition.y}px)`,
        filter: `brightness(${state.brightness}%) contrast(${state.contrast}%) blur(${state.blur}px)`,
        opacity: state.backgroundOpacity / 100
      }} onMouseDown={e => state.backgroundImage && !state.backgroundLocked ? handleDragStart('background', e) : null}>
            {state.backgroundImage && !state.backgroundLocked && <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1.5 rounded shadow-lg opacity-0 hover:opacity-100 transition-opacity flex items-center">
                <Move size={14} className="mr-2" /> Drag to reposition image
              </div>}
          </div>}
        {/* Background Overlay */}
        {state.backgroundOverlay && <div className="absolute inset-0" style={{
        backgroundColor: state.backgroundOverlayColor
      }}></div>}
        {/* Grid overlay */}
        {showGrid && <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
            {[...Array(9)].map((_, i) => <div key={i} className="border border-gray-400 border-opacity-30"></div>)}
          </div>}
        {/* Arabic Text */}
        <div className={`absolute cursor-move select-none group ${selectedElement === 'arabic' ? 'ring-2 ring-blue-500' : ''}`} style={{
        top: state.arabicPosition.y,
        left: state.arabicPosition.x,
        transform: `translate(-50%, -50%) rotate(${state.arabicTextRotation}deg)`,
        color: state.arabicColor,
        fontFamily: state.arabicFont,
        fontSize: `${state.arabicSize}px`,
        fontWeight: state.arabicBold ? 'bold' : 'normal',
        fontStyle: state.arabicItalic ? 'italic' : 'normal',
        textDecoration: state.arabicUnderline ? 'underline' : 'none',
        textAlign: state.arabicAlignment,
        direction: 'rtl',
        maxWidth: '80%',
        lineHeight: state.arabicLineHeight,
        letterSpacing: `${state.arabicLetterSpacing}px`,
        textShadow: state.arabicTextShadow ? `${state.arabicTextShadowOffset}px ${state.arabicTextShadowOffset}px ${state.arabicTextShadowBlur}px ${state.arabicTextShadowColor}` : 'none',
        padding: state.arabicTextBackground ? `${state.arabicTextBackgroundPadding}px` : '0',
        backgroundColor: state.arabicTextBackground ? state.arabicTextBackgroundColor : 'transparent',
        WebkitTextStroke: state.arabicTextOutline ? `${state.arabicTextOutlineWidth}px ${state.arabicTextOutlineColor}` : 'initial',
        zIndex: draggedElement === 'arabic' ? 10 : 1
      }} onMouseDown={e => handleDragStart('arabic', e)}>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center shadow-lg">
            <Move size={12} className="mr-1" /> Drag to move
          </div>
          {formatMultilineText(state.arabicText, 'arabic')}
        </div>
        {/* English Text */}
        <div className={`absolute cursor-move select-none group ${selectedElement === 'english' ? 'ring-2 ring-blue-500' : ''}`} style={{
        top: state.englishPosition.y,
        left: state.englishPosition.x,
        transform: `translate(-50%, -50%) rotate(${state.englishTextRotation}deg)`,
        color: state.englishColor,
        fontFamily: state.englishFont,
        fontSize: `${state.englishSize}px`,
        fontWeight: state.englishBold ? 'bold' : 'normal',
        fontStyle: state.englishItalic ? 'italic' : 'normal',
        textDecoration: state.englishUnderline ? 'underline' : 'none',
        textAlign: state.englishAlignment,
        maxWidth: '80%',
        lineHeight: state.englishLineHeight,
        letterSpacing: `${state.englishLetterSpacing}px`,
        textShadow: state.englishTextShadow ? `${state.englishTextShadowOffset}px ${state.englishTextShadowOffset}px ${state.englishTextShadowBlur}px ${state.englishTextShadowColor}` : 'none',
        padding: state.englishTextBackground ? `${state.englishTextBackgroundPadding}px` : '0',
        backgroundColor: state.englishTextBackground ? state.englishTextBackgroundColor : 'transparent',
        WebkitTextStroke: state.englishTextOutline ? `${state.englishTextOutlineWidth}px ${state.englishTextOutlineColor}` : 'initial',
        zIndex: draggedElement === 'english' ? 10 : 1
      }} onMouseDown={e => handleDragStart('english', e)}>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center shadow-lg">
            <Move size={12} className="mr-1" /> Drag to move
          </div>
          {formatMultilineText(state.englishText, 'english')}
        </div>
        {/* Reference Text */}
        {state.showReference && state.referenceText && <div className={`absolute cursor-move select-none group ${selectedElement === 'reference' ? 'ring-2 ring-blue-500' : ''}`} style={{
        top: state.referencePosition.y,
        left: state.referencePosition.x,
        transform: 'translate(-50%, -50%)',
        color: state.referenceColor,
        fontFamily: state.referenceFont,
        fontSize: `${state.referenceSize}px`,
        fontWeight: state.referenceBold ? 'bold' : 'normal',
        fontStyle: state.referenceItalic ? 'italic' : 'normal',
        textDecoration: state.referenceUnderline ? 'underline' : 'none',
        textAlign: state.referenceAlignment,
        maxWidth: '80%',
        lineHeight: state.referenceLineHeight,
        letterSpacing: `${state.referenceLetterSpacing}px`,
        textShadow: state.referenceTextShadow ? '1px 1px 4px rgba(0,0,0,0.5)' : 'none',
        padding: state.referenceTextBackground ? `${state.referenceTextBackgroundPadding}px` : '0',
        backgroundColor: state.referenceTextBackground ? state.referenceTextBackgroundColor : 'transparent',
        zIndex: draggedElement === 'reference' ? 10 : 1
      }} onMouseDown={e => handleDragStart('reference', e)}>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center shadow-lg">
              <Move size={12} className="mr-1" /> Drag to move
            </div>
            {state.referenceText}
          </div>}
        {/* Watermark */}
        {state.showWatermark && state.watermarkText && <div className={`absolute cursor-move select-none group ${selectedElement === 'watermark' ? 'ring-2 ring-blue-500' : ''}`} style={{
        top: state.watermarkPosition.y,
        left: state.watermarkPosition.x,
        transform: `translate(-50%, -50%) rotate(${state.watermarkRotation}deg)`,
        color: state.watermarkColor,
        fontSize: `${state.watermarkSize}px`,
        fontFamily: state.watermarkFont,
        opacity: state.watermarkOpacity / 100,
        zIndex: draggedElement === 'watermark' ? 10 : 1
      }} onMouseDown={e => handleDragStart('watermark', e)}>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center shadow-lg">
              <Move size={12} className="mr-1" /> Drag to move
            </div>
            {state.watermarkText}
          </div>}
      </div>
      {/* Hidden canvas for export */}
      <canvas ref={canvasRef} className="hidden" width={state.canvasWidth} height={state.canvasHeight}></canvas>
    </>;
};
export default memo(Canvas);