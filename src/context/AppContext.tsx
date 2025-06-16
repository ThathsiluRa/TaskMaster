import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, Task, Category } from '../types';

interface AppContextType {
  tasks: Task[];
  categories: Category[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  getTasksByCategory: (categoryId: string) => Task[];
  getTasksByStatus: (completed: boolean) => Task[];
  getTasksByPriority: (priority: 'low' | 'medium' | 'high') => Task[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = '@TaskNotes:data';

const initialData: AppData = {
  tasks: [],
  categories: [
    {
      id: '1',
      name: 'Work',
      color: '#BB86FC',
    },
    {
      id: '2',
      name: 'Personal',
      color: '#03DAC6',
    },
    {
      id: '3',
      name: 'Shopping',
      color: '#CF6679',
    },
  ],
  lastUpdated: new Date().toISOString(),
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data to storage whenever it changes
  useEffect(() => {
    saveData();
  }, [data]);

  const loadData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      const dataToSave = {
        ...data,
        lastUpdated: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  };

  const updateTask = (updatedTask: Task) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === updatedTask.id
          ? { ...updatedTask, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  };

  const deleteTask = (taskId: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId),
    }));
  };

  const toggleTaskComplete = (taskId: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task
      ),
    }));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
    };
    setData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  const updateCategory = (updatedCategory: Category) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(category =>
        category.id === updatedCategory.id ? updatedCategory : category
      ),
    }));
  };

  const deleteCategory = (categoryId: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category.id !== categoryId),
      // Remove category from tasks
      tasks: prev.tasks.map(task =>
        task.category === categoryId ? { ...task, category: undefined } : task
      ),
    }));
  };

  const getTasksByCategory = (categoryId: string) => {
    return data.tasks.filter(task => task.category === categoryId);
  };

  const getTasksByStatus = (completed: boolean) => {
    return data.tasks.filter(task => task.completed === completed);
  };

  const getTasksByPriority = (priority: 'low' | 'medium' | 'high') => {
    return data.tasks.filter(task => task.priority === priority);
  };

  const value = {
    tasks: data.tasks,
    categories: data.categories,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addCategory,
    updateCategory,
    deleteCategory,
    getTasksByCategory,
    getTasksByStatus,
    getTasksByPriority,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 