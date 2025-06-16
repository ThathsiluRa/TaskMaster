import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Note } from '../types';
import { format } from 'date-fns';

type NoteDetailsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NoteDetails'>;
  route: RouteProp<RootStackParamList, 'NoteDetails'>;
};

// Temporary mock data (in a real app, this would come from a data store)
const mockNote: Note = {
  id: '1',
  title: 'Project Ideas',
  content: 'List of potential features and improvements for the app:\n\n1. Dark mode support\n2. Rich text editing\n3. Cloud sync\n4. Tags and labels\n5. Search functionality\n6. Export to PDF',
  category: 'Ideas',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function NoteDetailsScreen({ navigation, route }: NoteDetailsScreenProps) {
  const [note, setNote] = useState<Note>(mockNote);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement note deletion
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{note.title}</Text>
          {note.category && (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>{note.category}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.noteContent}>{note.content}</Text>
        </View>

        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            Created: {formatDate(note.createdAt)}
          </Text>
          <Text style={styles.metadataText}>
            Updated: {formatDate(note.updatedAt)}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => navigation.navigate('NoteForm', { noteId: note.id })}
          >
            <Text style={styles.buttonText}>Edit Note</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={[styles.buttonText, styles.deleteButtonText]}>
              Delete Note
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryContainer: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#1976d2',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  noteContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  metadata: {
    marginBottom: 24,
    gap: 4,
  },
  metadataText: {
    color: '#666',
    fontSize: 14,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#f4511e',
  },
  deleteButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#f44336',
  },
}); 