export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export type GeofenceTrigger = {
  latitude: number;
  longitude: number;
  radius: number; // in meters
  triggerOn: 'enter' | 'leave';
};

export type TaskAction = {
  type: 'updateTodo';
  todoItemId: string; // ID of the TodoItem to update
  newText: string;   // The new text for the TodoItem
};

export interface Task {
  id: string;
  name: string;
  triggerType: 'time' | 'geofence';
  activationTime?: string; // HH:MM format for time trigger
  geofence?: GeofenceTrigger; 
  action: TaskAction;
}

export interface Routine {
  id: string;
  name: string;
  tasks: Task[];
}
