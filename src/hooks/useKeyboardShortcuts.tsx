import React, { useCallback, useEffect } from 'react';
import { useDesign } from '../contexts/DesignContext';
import { useToast } from '../components/ui/Toast';
export function useKeyboardShortcuts() {
  const {
    handleUndo,
    handleRedo,
    saveDesign
  } = useDesign();
  const {
    toast
  } = useToast();
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Undo: Ctrl/Cmd + Z
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
      toast({
        title: 'Action undone',
        description: 'Previous change has been undone'
      });
    }
    // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey || (e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      handleRedo();
      toast({
        title: 'Action redone',
        description: 'Change has been reapplied'
      });
    }
    // Save: Ctrl/Cmd + S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveDesign();
      toast({
        title: 'Design saved',
        description: 'Your design has been saved locally'
      });
    }
  }, [handleUndo, handleRedo, saveDesign, toast]);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  return null;
}