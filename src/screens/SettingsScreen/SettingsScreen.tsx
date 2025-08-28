import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';


export default function SettingsScreen() {
const [useCloud, setUseCloud] = React.useState(false);
return (
<View style={styles.container}>
<Text style={styles.title}>Settings</Text>
<View style={styles.row}>
<Text style={styles.label}>Use cloud STT / AI</Text>
<Switch value={useCloud} onValueChange={setUseCloud} />
</View>
<Text style={styles.hint}>Privacy settings & MCP connectors will appear here.</Text>
</View>
);
}


const styles = StyleSheet.create({
container: { flex: 1, padding: 20, backgroundColor: '#071025' },
title: { color: '#fff', fontSize: 22, marginBottom: 12 },
row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
label: { color: '#dff7e6' },
hint: { color: '#9fb0c9', marginTop: 18 }
});