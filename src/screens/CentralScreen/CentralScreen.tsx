import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import MainMicButton from '../../components/MainMicButton';

const { width, height } = Dimensions.get('window');

export default function CentralScreen() {
  const theme = useTheme();
  const [mode, setMode] = useState<'journal' | 'idea'>('journal');
  const [isRecording, setIsRecording] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleStartRecording = () => {
    setIsRecording(true);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  if (isRecording) {
    return (
      <View style={[styles.container, styles.recordingContainer]}>
        <View style={styles.recordingContent}>
          <MainMicButton 
            mode={mode} 
            isRecording={true}
            onStopRecording={handleStopRecording}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.exitButton}
          onPress={handleStopRecording}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Capture Your Thoughts
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.icon }]}>
            Choose your mode and start speaking
          </Text>
        </View>

        {/* Mode Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              mode === 'journal' && styles.toggleButtonActive,
              { borderColor: theme.colors.tabIconDefault }
            ]}
            onPress={() => setMode('journal')}
          >
            <Ionicons 
              name="journal-outline" 
              size={20} 
              color={mode === 'journal' ? '#6ee7b7' : theme.colors.tabIconDefault} 
            />
            <Text style={[
              styles.toggleText,
              { color: mode === 'journal' ? '#6ee7b7' : theme.colors.tabIconDefault }
            ]}>
              Journal
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.toggleButton,
              mode === 'idea' && styles.toggleButtonActive,
              { borderColor: theme.colors.tabIconDefault }
            ]}
            onPress={() => setMode('idea')}
          >
            <Ionicons 
              name="bulb-outline" 
              size={20} 
              color={mode === 'idea' ? '#6ee7b7' : theme.colors.tabIconDefault} 
            />
            <Text style={[
              styles.toggleText,
              { color: mode === 'idea' ? '#6ee7b7' : theme.colors.tabIconDefault }
            ]}>
              Idea
            </Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={[styles.description, { color: theme.colors.icon }]}>
            {mode === 'journal' 
              ? 'Speak naturally and we\'ll create structured notes from your thoughts'
              : 'Have a conversation with AI to develop and refine your ideas'
            }
          </Text>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartRecording}
          activeOpacity={0.8}
        >
          <View style={styles.startButtonInner}>
            <Ionicons name="mic" size={32} color="#000" />
          </View>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.icon }]}>
            Tap to begin recording
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151718',
  },
  recordingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  recordingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1d21',
    borderRadius: 50,
    padding: 4,
    marginBottom: 48,
    alignSelf: 'center',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 46,
    minWidth: 120,
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#0f1724',
  },
  toggleText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 64,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  startButton: {
    alignItems: 'center',
    marginBottom: 48,
  },
  startButtonInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6ee7b7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6ee7b7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 16,
  },
  startButtonText: {
    color: '#6ee7b7',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.6,
  },
  exitButton: {
    position: 'absolute',
    bottom: 50,
    left: '50%',
    marginLeft: -25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
});