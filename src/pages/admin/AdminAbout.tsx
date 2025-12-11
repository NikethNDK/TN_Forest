import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  subscribeToMissionVision,
  updateMissionVision
} from '../../services/firebase/aboutService';
import { LoadingSpinner, ErrorMessage } from '../../components/common';

const AdminAbout: React.FC = () => {
  const [localMission, setLocalMission] = useState('');
  const [localVision, setLocalVision] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Track if user is currently editing to prevent overwriting from Firestore
  const isEditingRef = useRef(false);
  const lastSavedMissionRef = useRef('');
  const lastSavedVisionRef = useRef('');

  // Subscribe to real-time updates
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToMissionVision(
      (data) => {
        if (data) {
          // Only update from Firestore if:
          // 1. User is not currently editing, OR
          // 2. The data is different from what we last saved (meaning it came from another source)
          const isFromOtherSource = 
            data.mission !== lastSavedMissionRef.current || 
            data.vision !== lastSavedVisionRef.current;
          
          if (!isEditingRef.current || isFromOtherSource) {
            setLocalMission(data.mission);
            setLocalVision(data.vision);
            lastSavedMissionRef.current = data.mission;
            lastSavedVisionRef.current = data.vision;
          }
          
          if (data.updatedAt) {
            setLastSaved(new Date(data.updatedAt.toMillis()));
          }
        } else {
          // Document doesn't exist yet, initialize with empty strings
          setLocalMission('');
          setLocalVision('');
          lastSavedMissionRef.current = '';
          lastSavedVisionRef.current = '';
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load mission and vision';
        setError(errorMessage);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Save function
  const saveToFirestore = useCallback(async (mission: string, vision: string) => {
    try {
      setSaving(true);
      setError(null);
      isEditingRef.current = false; // Mark that we're saving, not editing
      await updateMissionVision(mission, vision);
      
      // Update refs to track what we just saved
      lastSavedMissionRef.current = mission;
      lastSavedVisionRef.current = vision;
      
      setSaved(true);
      setLastSaved(new Date());
      // Hide "Saved" message after 3 seconds
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save mission and vision';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  }, []);

  // Handle mission change
  const handleMissionChange = (value: string) => {
    isEditingRef.current = true; // Mark that user is editing
    setLocalMission(value);
    setSaved(false);
    // Save immediately without debouncing (fire and forget to not block UI)
    saveToFirestore(value, localVision).catch(() => {
      // Error is handled in saveToFirestore
    });
  };

  // Handle vision change
  const handleVisionChange = (value: string) => {
    isEditingRef.current = true; // Mark that user is editing
    setLocalVision(value);
    setSaved(false);
    // Save immediately without debouncing (fire and forget to not block UI)
    saveToFirestore(localMission, value).catch(() => {
      // Error is handled in saveToFirestore
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <LoadingSpinner message="Loading mission and vision..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-900 mb-2">About Page Management</h1>
        <p className="text-gray-600">Manage mission and vision content</p>
      </div>

      {error && <ErrorMessage message={error} className="mb-4" />}

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-900">Mission & Vision</h2>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {saving && (
              <span className="flex items-center gap-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            )}
            {saved && !saving && (
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Saved
              </span>
            )}
            {lastSaved && !saving && !saved && (
              <span className="text-gray-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mission
            </label>
            <textarea
              value={localMission}
              onChange={(e) => handleMissionChange(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm whitespace-pre-wrap"
              placeholder="Enter mission content..."
              style={{ whiteSpace: 'pre-wrap' }}
            />
            <p className="mt-2 text-xs text-gray-500">
              Formatting (spaces, newlines) will be preserved exactly as typed
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vision
            </label>
            <textarea
              value={localVision}
              onChange={(e) => handleVisionChange(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm whitespace-pre-wrap"
              placeholder="Enter vision content..."
              style={{ whiteSpace: 'pre-wrap' }}
            />
            <p className="mt-2 text-xs text-gray-500">
              Formatting (spaces, newlines) will be preserved exactly as typed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;
