import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Note } from '../../packages/types';


const NOTES_KEY = 'idea_notes_v1';


export async function saveNote(note: Note) {
const notes = await getAllNotes();
const idx = notes.findIndex(n => n.id === note.id);
if (idx >= 0) {
notes[idx] = note;
} else {
notes.unshift(note);
}
await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}


export async function getAllNotes(): Promise<Note[]> {
const raw = await AsyncStorage.getItem(NOTES_KEY);
if (!raw) return [];
try {
return JSON.parse(raw) as Note[];
} catch {
return [];
}
}


export async function getNoteById(id: string): Promise<Note | null> {
const notes = await getAllNotes();
return notes.find(n => n.id === id) ?? null;
}


export async function clearAllNotes() {
await AsyncStorage.removeItem(NOTES_KEY);
}