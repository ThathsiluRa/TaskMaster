import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import type { Task } from '../types';
import type { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { tasks, toggleTaskComplete, deleteTask, categories } = useApp();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return '#FFFFFF';
      case 'medium':
        return '#CCCCCC';
      case 'low':
        return '#999999';
      default:
        return '#666666';
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#000000';
      default:
        return '#FFFFFF';
    }
  };

  const getCategoryInfo = (categoryId: string | undefined) => {
    if (!categoryId) return null;
    return categories.find(cat => cat.id === categoryId);
  };

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskLongPress = (task: Task) => {
    setSelectedTask(task);
  };

  const handleMarkComplete = async (task: Task) => {
    await toggleTaskComplete(task.id);
    setSelectedTask(null);
  };

  const handleEditTask = (task: Task) => {
    navigation.navigate('TaskForm', { task });
    setSelectedTask(null);
  };

  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task.id);
            setSelectedTask(null);
          },
        },
      ],
    );
  };

  const renderTaskCard = ({ item: task }: { item: Task }) => {
    const categoryInfo = getCategoryInfo(task.category);
    
    return (
      <TouchableOpacity
        style={[styles.taskCard, task.completed && styles.completedTaskCard]}
        onPress={() => handleTaskPress(task)}
        onLongPress={() => handleTaskLongPress(task)}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleContainer}>
            <TouchableOpacity
              style={[styles.checkbox, task.completed && styles.checkedBox]}
              onPress={() => handleMarkComplete(task)}
            >
              {task.completed && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            <Text style={[styles.taskTitle, task.completed && styles.completedTaskTitle]}>
              {task.title}
            </Text>
          </View>
          <View style={styles.taskTags}>
            {task.priority && (
              <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(task.priority) }]}>
                <Text style={[styles.priorityText, { color: getPriorityTextColor(task.priority) }]}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Text>
              </View>
            )}
            {categoryInfo && (
              <View style={[styles.tag, { backgroundColor: categoryInfo.color }]}>
                <Text style={styles.tagText}>{categoryInfo.name}</Text>
              </View>
            )}
          </View>
        </View>
        {task.description && (
          <Text style={[styles.taskDescription, task.completed && styles.completedTaskDescription]}>
            {task.description}
          </Text>
        )}
        {task.dueDate && (
          <View style={styles.dueDateContainer}>
            <Ionicons name="calendar-outline" size={14} color="#666666" />
            <Text style={styles.dueDateText}>
              {new Date(task.dueDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with Menu */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TaskMaster</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
        >
          <Ionicons name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        renderItem={renderTaskCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Task Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('TaskForm')}
      >
        <Ionicons name="add" size={24} color="#000000" />
      </TouchableOpacity>

      {/* Task Options Modal */}
      <Modal
        visible={selectedTask !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTask(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedTask(null)}
        >
          <View style={styles.modalContent}>
            {selectedTask && (
              <>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleMarkComplete(selectedTask)}
                >
                  <Ionicons
                    name={selectedTask.completed ? 'close-circle-outline' : 'checkmark-circle-outline'}
                    size={24}
                    color="#BB86FC"
                  />
                  <Text style={styles.modalOptionText}>
                    {selectedTask.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleEditTask(selectedTask)}
                >
                  <Ionicons name="create-outline" size={24} color="#03DAC6" />
                  <Text style={styles.modalOptionText}>Edit Task</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleDeleteTask(selectedTask)}
                >
                  <Ionicons name="trash-outline" size={24} color="#FF5252" />
                  <Text style={[styles.modalOptionText, styles.deleteOptionText]}>
                    Delete Task
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContent}>
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setShowMenu(false);
                navigation.navigate('Categories');
              }}
            >
              <Ionicons name="list-outline" size={24} color="#BB86FC" />
              <Text style={styles.menuOptionText}>Categories</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menuButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  completedTaskCard: {
    opacity: 0.7,
    borderColor: '#333333',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#FFFFFF',
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#666666',
  },
  taskTags: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#333333',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#333333',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  taskDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 8,
  },
  completedTaskDescription: {
    color: '#666666',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: '#666666',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxWidth: 300,
    borderWidth: 1,
    borderColor: '#333333',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  deleteOptionText: {
    color: '#FFFFFF',
  },
  menuContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxWidth: 300,
    position: 'absolute',
    top: 60,
    right: 16,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  menuOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
}); 