


export interface Entry {
  _id: string;
  description: string;
  createdAt: number;
  status: EntryStatus; // pending, in-progess, finished
}

export type EntryStatus = 'pending' | 'in-progress' | 'finished'