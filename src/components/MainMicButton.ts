import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { startMockSession } from '../services/s2t/s2tAdapter';
import { postProcessJournalTranscript } from '../services/ai/ideaEngine';
import { saveNote } from '../services/db/localDb';

interface MainMicButtonProps {
  mode: 'journal' | 'idea';
  isRecording?: boolean;
  onStopRecording?: () => void;
}

export default function MainMicButton({ 
  mode, 
  isRecording = false, 
  onStopRecording 
}: MainMicButtonProps) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const sessionRef = useRef<any>(null);
  const theme = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for recording state
  useEffect(() => {
    if (listening) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      
      return () => pulseAnimation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [listening, pulseAnim]);

  // Auto-start when in recording mode
  useEffect(() => {
    if (isRecording && !listening) {
      onStart();
    }
  }, [isRecording]);

  const onStart = () => {
    setListening(true);
    setInterim('');
    
    // Scale animation
    Animated.timing(scaleAnim, {
      toValue: 1.1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    sessionRef.current = startMockSession({
      onInterim: (t: string) => setInterim(t),
      onFinal: async (t: string) => {
        setInterim(t);
        const note = postProcessJournalTranscript(t);
        if (mode === 'journal') {
          await saveNote(note);
        } else {
          note.source = 'ai';
          await saveNote(note);
        }
        setListening(false);
        
        // Reset scale
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();

        // Call onStopRecording if provided (for recording mode)
        if (onStopRecording) {
          setTimeout(onStopRecording, 500);
        }
      },
    });
  };

  const onStop = () => {
    if (sessionRef.current) sessionRef.current.stop();
    setListening(false);
    
    // Reset scale
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (onStopRecording) {
      onStopRecording();
    }
  };

  if (isRecording) {
    return (
      <View style={styles.recordingContainer}>
        <Animated.View
          style={[
            styles.recordingButton,
            {
              transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.recordingButtonInner}>
            {listening ? (
              <View style={styles.recordingIndicator}>
                <View style={styles.waveform}>
                  {[...Array(5)].map((_, i) => (
                    <View key={i} style={[styles.waveBar, { height: Math.random() * 30 + 10 }]} />
                  ))}
                </View>
              </View>
            ) : (
              <Ionicons name="mic" size={48} color="#000" />
            )}
          </View>
        </Animated.View>

        {interim ? (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcript}>{interim}</Text>
          </View>
        ) : (
          <Text style={styles.listeningText}>
            {listening ? 'Listening...' : 'Tap to start'}
          </Text>
        )}
      </View>
    );
  }

  return null; // Non-recording mode is handled by the parent component
}

const styles = StyleSheet.create({
  recordingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  recordingButton: {
    marginBottom: 32,
  },
  recordingButtonInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#6ee7b7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6ee7b7',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 16,
  },
  recordingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
    gap: 3,
  },
  waveBar: {
    width: 4,
    backgroundColor: '#000',
    borderRadius: 2,
    opacity: 0.8,
  },
  transcriptContainer: {
    maxWidth: '80%',
    backgroundColor: 'rgba(15, 23, 36, 0.9)',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
  },
  transcript: {
    color: '#e6eef9',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  listeningText: {
    color: '#98a2b3',
    fontSize: 18,
    marginTop: 20,
  },
});