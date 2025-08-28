import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../styles/theme';


export default function ModeToggle({ mode, onChange }: { mode: 'journal' | 'idea'; onChange: (m: 'journal' | 'idea') => void; }) {
return (
<View style={styles.row}>
<TouchableOpacity onPress={() => onChange('journal')} style={[styles.btn, mode === 'journal' && styles.active]}>
<Text style={[styles.label, mode === 'journal' && styles.activeLabel]}>Journal</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => onChange('idea')} style={[styles.btn, mode === 'idea' && styles.active]}>
<Text style={[styles.label, mode === 'idea' && styles.activeLabel]}>Idea</Text>
</TouchableOpacity>
</View>
);
}


const styles = StyleSheet.create({
row: { flexDirection: 'row', alignSelf: 'center', marginVertical: 24 },
btn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: 'transparent', marginHorizontal: 6 },
active: { backgroundColor: '#0f1724', borderWidth: 1, borderColor: '#123' },
label: { color: theme.colors.muted },
activeLabel: { color: theme.colors.primary }
});