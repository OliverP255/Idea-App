import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { getAllNotes, saveNote, deleteNote } from '../../services/db/localDb';
import type { Note } from '../../packages/types';

interface Folder {
  id: string;
  name: string;
  color: string;
  noteIds: string[];
}

export default function NotesListScreen() {
  const theme = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'note' | 'folder'>('note');
  const [newItemName, setNewItemName] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    loadNotes();
    loadFolders();
  }, []);

  const loadNotes = async () => {
    const loadedNotes = await getAllNotes();
    setNotes(loadedNotes);
  };

  const loadFolders = () => {
    // Mock folders for now - in real app, these would be persisted
    const mockFolders: Folder[] = [
      { id: 'work', name: 'Work', color: '#6ee7b7', noteIds: [] },
      { id: 'personal', name: 'Personal', color: '#60a5fa', noteIds: [] },
      { id: 'ideas', name: 'Ideas', color: '#f59e0b', noteIds: [] },
    ];
    setFolders(mockFolders);
  };

  const createNote = async () => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: newItemName || 'Untitled Note',
      blocks: [
        {
          id: `block_${Date.now()}`,
          type: 'paragraph',
          content: '',
          order: 0,
        },
      ],
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'manual',
      draft: true,
    };

    await saveNote(newNote);
    setNotes(prev => [newNote, ...prev]);
    setNewItemName('');
    setShowAddModal(false);
  };

  const createFolder = () => {
    const newFolder: Folder = {
      id: `folder_${Date.now()}`,
      name: newItemName || 'New Folder',
      color: '#6ee7b7',
      noteIds: [],
    };

    setFolders(prev => [...prev, newFolder]);
    setNewItemName('');
    setShowAddModal(false);
  };

  const openNote = (note: Note) => {
    setEditingNote(note);
    setNoteContent(note.blocks.map(block => block.content).join('\n\n'));
  };

  const saveNoteContent = async () => {
    if (!editingNote) return;

    const updatedNote: Note = {
      ...editingNote,
      blocks: [
        {
          id: `block_${Date.now()}`,
          type: 'paragraph',
          content: noteContent,
          order: 0,
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    await saveNote(updatedNote);
    setNotes(prev => prev.map(note => 
      note.id === editingNote.id ? updatedNote : note
    ));
    setEditingNote(null);
    setNoteContent('');
  };

  const handleDeleteNote = async (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteNote(noteId);
            setNotes(prev => prev.filter(note => note.id !== noteId));
          },
        },
      ]
    );
  };

  const filteredNotes = selectedFolder
    ? notes.filter(note => 
        folders.find(f => f.id === selectedFolder)?.noteIds.includes(note.id)
      )
    : notes;

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => openNote(item)}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle} numberOfLines={1}>
          {item.title || 'Untitled'}
        </Text>
        <TouchableOpacity
          onPress={() => handleDeleteNote(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
      <Text style={styles.notePreview} numberOfLines={2}>
        {item.blocks.map(block => block.content).join(' ') || 'No content'}
      </Text>
      <View style={styles.noteFooter}>
        <Text style={styles.noteDate}>
          {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
        <View style={styles.noteSource}>
          <Ionicons
            name={item.source === 'voice' ? 'mic' : item.source === 'ai' ? 'bulb' : 'create'}
            size={12}
            color="#98a2b3"
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFolder = ({ item }: { item: Folder }) => (
    <TouchableOpacity
      style={[
        styles.folderCard,
        { borderLeftColor: item.color },
        selectedFolder === item.id && styles.selectedFolder,
      ]}
      onPress={() => setSelectedFolder(selectedFolder === item.id ? null : item.id)}
    >
      <Ionicons name="folder" size={20} color={item.color} />
      <Text style={styles.folderName}>{item.name}</Text>
      <Text style={styles.folderCount}>{item.noteIds.length}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Notes</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setModalType('folder');
              setShowAddModal(true);
            }}
          >
            <Ionicons name="folder-outline" size={20} color="#6ee7b7" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setModalType('note');
              setShowAddModal(true);
            }}
          >
            <Ionicons name="add" size={24} color="#6ee7b7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Folders */}
      {folders.length > 0 && (
        <View style={styles.foldersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.allNotesFolder,
                !selectedFolder && styles.selectedFolder,
              ]}
              onPress={() => setSelectedFolder(null)}
            >
              <Ionicons name="document-text" size={20} color="#6ee7b7" />
              <Text style={styles.folderName}>All Notes</Text>
              <Text style={styles.folderCount}>{notes.length}</Text>
            </TouchableOpacity>
            <FlatList
              horizontal
              data={folders}
              keyExtractor={item => item.id}
              renderItem={renderFolder}
              showsHorizontalScrollIndicator={false}
            />
          </ScrollView>
        </View>
      )}

      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        renderItem={renderNote}
        contentContainerStyle={styles.notesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#333" />
            <Text style={styles.emptyText}>No notes yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to create your first note
            </Text>
          </View>
        }
      />

      {/* Add Item Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Create New {modalType === 'note' ? 'Note' : 'Folder'}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={`${modalType === 'note' ? 'Note' : 'Folder'} name`}
              placeholderTextColor="#666"
              value={newItemName}
              onChangeText={setNewItemName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowAddModal(false);
                  setNewItemName('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={modalType === 'note' ? createNote : createFolder}
              >
                <Text style={[styles.modalButtonText, { color: '#000' }]}>
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Note Editor Modal */}
      <Modal visible={!!editingNote} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.noteEditorContent]}>
            <View style={styles.noteEditorHeader}>
              <Text style={styles.modalTitle}>
                {editingNote?.title || 'Untitled Note'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setEditingNote(null);
                  setNoteContent('');
                }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.noteEditorInput}
              value={noteContent}
              onChangeText={setNoteContent}
              placeholder="Start writing..."
              placeholderTextColor="#666"
              multiline
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setEditingNote(null);
                  setNoteContent('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={saveNoteContent}
              >
                <Text style={[styles.modalButtonText, { color: '#000' }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151718',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ECEDEE',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a1d21',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foldersSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  allNotesFolder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1d21',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 120,
  },
  folderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1d21',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    borderLeftWidth: 3,
    minWidth: 120,
  },
  selectedFolder: {
    backgroundColor: '#0f1724',
  },
  folderName: {
    color: '#ECEDEE',
    marginLeft: 8,
    fontWeight: '600',
    flex: 1,
  },
  folderCount: {
    color: '#9BA1A6',
    fontSize: 12,
    backgroundColor: '#2a2d31',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  notesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  noteCard: {
    backgroundColor: '#1a1d21',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    color: '#ECEDEE',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  notePreview: {
    color: '#9BA1A6',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteDate: {
    color: '#687076',
    fontSize: 12,
  },
  noteSource: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    color: '#9BA1A6',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#687076',
    fontSize: 14,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1d21',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  noteEditorContent: {
    height: '80%',
    maxHeight: 600,
  },
  noteEditorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#ECEDEE',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#0f1724',
    color: '#ECEDEE',
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  noteEditorInput: {
    backgroundColor: '#0f1724',
    color: '#ECEDEE',
    fontSize: 16,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    flex: 1,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#0f1724',
  },
  modalButtonPrimary: {
    backgroundColor: '#6ee7b7',
  },
  modalButtonText: {
    color: '#ECEDEE',
    fontWeight: '600',
  },
});