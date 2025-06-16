import { Task } from '../types';

export type RootStackParamList = {
  Home: undefined;
  TaskList: undefined;
  TaskForm: { task?: Task };
  TaskDetails: { taskId: string };
  Categories: undefined;
}; 