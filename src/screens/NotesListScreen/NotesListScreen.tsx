import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getAllNotes } from '../../services/db/localDb';
import type { Note } from '../../packages/types';


export default function NotesListScreen() {
const [notes, setNotes] = useState<Note[]>([]);


useEffect(() => {
(async () => {
const n = await getAllNotes();
setNotes(n);
})();
}, []);


return (
<View style={styles.container}>
<Text style={styles.title}>Notes</Text>
<FlatList
data={notes}
keyExtractor={i => i.id}
renderItem={({ item }) => (
<TouchableOpacity style={styles.card}>
<Text style={styles.noteTitle}>{item.title ?? 'Untitled'}</Text>
<Text numberOfLines={2} style={styles.notePreview}>{item.blocks.map(b => b.content).join(' ')}</Text>
</TouchableOpacity>
)}
/>
</View>
);
}


const styles = StyleSheet.create({
container: { flex: 1, padding: 20, backgroundColor: '#071025' },
title: { color: '#fff', fontSize: 22, marginBottom: 12 },
card: { backgroundColor: '#081326', padding: 12, borderRadius: 12, marginBottom: 10 },
noteTitle: { color: '#dff7e6', fontWeight: '700' },
notePreview: { color: '#9fb0c9', marginTop: 6 }
});