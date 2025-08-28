import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
import ModeToggle from '../../components/ModeToggle';
import MainMicButton from '../../components/MainMicButton';
import theme from '../../styles/theme';


export default function CentralScreen() {
const router = useRouter();
const [mode, setMode] = useState<'journal' | 'idea'>('journal');


return (
<View style={styles.container}>
<View style={styles.topRow}>
<TouchableOpacity onPress={() => router.push('/notes')}>
<Text style={styles.link}>Notes</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => router.push('/settings')}>
<Text style={styles.link}>Settings</Text>
</TouchableOpacity>
</View>


<ModeToggle mode={mode} onChange={m => setMode(m)} />


<View style={styles.centerArea}>
<Text style={styles.hint}>{mode === 'journal' ? 'Journal Mode — speak and we write.' : 'Idea Mode — converse with AI.'}</Text>
<MainMicButton mode={mode} />
</View>


<View style={styles.footer}>
<Text style={styles.muted}>Idea — note-taking done for you</Text>
</View>
</View>
);
}


const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: theme.colors.bg, padding: 20 },
topRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12 },
link: { color: theme.colors.primary, fontSize: 16 },
centerArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
hint: { color: theme.colors.muted, marginBottom: 18 },
footer: { paddingBottom: 30, alignItems: 'center' },
muted: { color: theme.colors.muted }
});