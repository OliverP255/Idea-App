import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  name: string;
  age: string;
  occupation: string;
  goals: string;
  interests: string;
  context: string;
}

interface AppSettings {
  useCloudSTT: boolean;
  useCloudAI: boolean;
  autoSave: boolean;
  voiceActivation: boolean;
  darkMode: boolean;
}

const PROFILE_KEY = 'user_profile_v1';
const SETTINGS_KEY = 'app_settings_v1';

export default function SettingsScreen() {
  const theme = useTheme();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: '',
    occupation: '',
    goals: '',
    interests: '',
    context: '',
  });
  
  const [settings, setSettings] = useState<AppSettings>({
    useCloudSTT: false,
    useCloudAI: false,
    autoSave: true,
    voiceActivation: false,
    darkMode: true,
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserProfile();
    loadAppSettings();
  }, []);

  const loadUserProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem(PROFILE_KEY);
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const loadAppSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(SETTINGS_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load app settings:', error);
    }
  };

  const saveUserProfile = async () => {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      setIsEditing(false);
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      console.error('Failed to save user profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const saveAppSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save app settings:', error);
    }
  };

  const updateProfile = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const updateSetting = (field: keyof AppSettings, value: boolean) => {
    const newSettings = { ...settings, [field]: value };
    saveAppSettings(newSettings);
  };

  const renderProfileField = (
    label: string,
    field: keyof UserProfile,
    placeholder: string,
    multiline = false
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, multiline && styles.textInputMultiline]}
        value={profile[field]}
        onChangeText={(value) => updateProfile(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#666"
        multiline={multiline}
        editable={isEditing}
      />
    </View>
  );

  const renderSettingRow = (
    label: string,
    description: string,
    field: keyof AppSettings,
    icon: keyof typeof Ionicons.glyphMap
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <View style={styles.settingHeader}>
          <Ionicons name={icon} size={20} color="#6ee7b7" />
          <Text style={styles.settingLabel}>{label}</Text>
        </View>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={settings[field]}
        onValueChange={(value) => updateSetting(field, value)}
        trackColor={{ false: '#333', true: '#6ee7b7' }}
        thumbColor={settings[field] ? '#000' : '#666'}
      />
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
      </View>

      {/* User Profile Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="person-circle-outline" size={24} color="#6ee7b7" />
            <Text style={styles.sectionTitle}>User Profile</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (isEditing) {
                saveUserProfile();
              } else {
                setIsEditing(true);
              }
            }}
          >
            <Ionicons 
              name={isEditing ? "checkmark" : "create-outline"} 
              size={20} 
              color="#6ee7b7" 
            />
            <Text style={styles.editButtonText}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionDescription}>
          Help the AI understand you better by providing context about yourself.
        </Text>

        <View style={styles.profileForm}>
          {renderProfileField('Name', 'name', 'Your full name')}
          {renderProfileField('Age', 'age', 'Your age')}
          {renderProfileField('Occupation', 'occupation', 'Your job or profession')}
          {renderProfileField(
            'Goals',
            'goals',
            'What are you trying to achieve? (e.g., learn programming, start a business)',
            true
          )}
          {renderProfileField(
            'Interests',
            'interests',
            'Your hobbies and interests (e.g., photography, cooking, travel)',
            true
          )}
          {renderProfileField(
            'Additional Context',
            'context',
            'Any other information that would help the AI assist you better',
            true
          )}
        </View>
      </View>

      {/* App Settings Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="settings-outline" size={24} color="#6ee7b7" />
            <Text style={styles.sectionTitle}>App Settings</Text>
          </View>
        </View>

        <Text style={styles.sectionDescription}>
          Configure how the app processes your voice and data.
        </Text>

        {renderSettingRow(
          'Cloud Speech-to-Text',
          'Use cloud services for better speech recognition',
          'useCloudSTT',
          'cloud-outline'
        )}

        {renderSettingRow(
          'Cloud AI Processing',
          'Use cloud AI for enhanced note processing and ideas',
          'useCloudAI',
          'bulb-outline'
        )}

        {renderSettingRow(
          'Auto Save',
          'Automatically save notes as you speak',
          'autoSave',
          'save-outline'
        )}

        {renderSettingRow(
          'Voice Activation',
          'Start recording with voice commands',
          'voiceActivation',
          'mic-outline'
        )}
      </View>

      {/* Privacy Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#6ee7b7" />
            <Text style={styles.sectionTitle}>Privacy & Data</Text>
          </View>
        </View>

        <View style={styles.privacyInfo}>
          <Text style={styles.privacyText}>
            • All data is stored locally on your device by default
          </Text>
          <Text style={styles.privacyText}>
            • Cloud services are only used when explicitly enabled
          </Text>
          <Text style={styles.privacyText}>
            • Your voice recordings are not stored permanently
          </Text>
          <Text style={styles.privacyText}>
            • You can export or delete your data at any time
          </Text>
        </View>

        <TouchableOpacity style={styles.dangerButton}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={[styles.section, styles.lastSection]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="information-circle-outline" size={24} color="#6ee7b7" />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
        </View>

        <View style={styles.aboutInfo}>
          <Text style={styles.aboutText}>Idea - AI-Powered Note Taking</Text>
          <Text style={styles.aboutVersion}>Version 1.0.0</Text>
          <Text style={styles.aboutDescription}>
            Capture your thoughts effortlessly with voice-to-text and AI assistance.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151718',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ECEDEE',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 32,
    backgroundColor: '#1a1d21',
    borderRadius: 16,
    padding: 20,
  },
  lastSection: {
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ECEDEE',
    marginLeft: 12,
  },
  sectionDescription: {
    color: '#9BA1A6',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1724',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#6ee7b7',
    marginLeft: 6,
    fontWeight: '600',
  },
  profileForm: {
    gap: 16,
  },
  fieldContainer: {
    gap: 8,
  },
  fieldLabel: {
    color: '#ECEDEE',
    fontSize: 16,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#0f1724',
    color: '#ECEDEE',
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0f1724',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingLabel: {
    color: '#ECEDEE',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  settingDescription: {
    color: '#9BA1A6',
    fontSize: 14,
    lineHeight: 20,
  },
  privacyInfo: {
    gap: 8,
    marginBottom: 20,
  },
  privacyText: {
    color: '#9BA1A6',
    fontSize: 14,
    lineHeight: 20,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a1a1a',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  dangerButtonText: {
    color: '#ef4444',
    marginLeft: 8,
    fontWeight: '600',
  },
  aboutInfo: {
    alignItems: 'center',
    gap: 8,
  },
  aboutText: {
    color: '#ECEDEE',
    fontSize: 18,
    fontWeight: '600',
  },
  aboutVersion: {
    color: '#9BA1A6',
    fontSize: 14,
  },
  aboutDescription: {
    color: '#9BA1A6',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
});