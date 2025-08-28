import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../hooks/useTheme'; // adjust path if needed

export default function MainMicButton({ mode }: { mode: 'journal' | 'idea' }) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const sessionRef = useRef<any>(null);
  const theme = useTheme(); // get theme inside component

  const styles = StyleSheet.create({
    container: { alignItems: 'center' },
    button: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: theme.colors.primary, // works now
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonActive: { backgroundColor: '#34d399' },
    btnText: { color: '#001', fontWeight: '700' },
    transcriptContainer: { marginTop: 18, width: '90%' },
    transcript: { color: theme.colors.text, textAlign: 'center' },
  });

  const onStart = () => {
    setListening(true);
    setInterim('');
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
      },
    });
  };

  const onStop = () => {
    if (sessionRef.current) sessionRef.current.stop();
    setListening(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => (listening ? onStop() : onStart())}
        style={[styles.button, listening && styles.buttonActive]}
      >
        {!listening ? <Text style={styles.btnText}>Speak</Text> : <ActivityIndicator color="#000" />}
      </TouchableOpacity>

      <View style={styles.transcriptContainer}>
        <Text style={styles.transcript}>{interim}</Text>
      </View>
    </View>
  );
}
