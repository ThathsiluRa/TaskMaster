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
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{note.title}</Text>
          <View style={styles.metaInfo}>
            <Text style={styles.category}>{note.category}</Text>
            <Text style={styles.date}>
              Updated: {formatDate(note.updatedAt)}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.noteText}>{note.content}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.editButton]}
          onPress={() => navigation.navigate('NoteForm', { noteId: note.id })}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    color: '#666666',
  },
  date: {
    fontSize: 14,
    color: '#666666',
  },
  content: {
    padding: 16,
  },
  noteText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    gap: 12,
  },
  footerButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FFFFFF',
  },
  editButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#333333',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 