import { create } from 'zustand';

// 1. Defining the possible states our upload can be in
export type UploadStatus = 'Idle' | 'Uploading' | 'Completed' | 'Failed' | 'Paused';

// 2. Defining what a single video upload looks like in our state
export interface UploadItem {
  id: string;          // A unique fingerprint for the file (so we can resume it)
  fileName: string;    // The name of the video
  progress: number;    // The current progress from 0 to 100
  status: UploadStatus;// Is it paused? uploading? done?
}

// 3. Defining the shape of our global store
interface UploadState {
  uploads: Record<string, UploadItem>; // A dictionary of all active/past uploads
  
  // Actions to mutate the state
  addUpload: (upload: UploadItem) => void;
  updateProgress: (id: string, progress: number) => void;
  updateStatus: (id: string, status: UploadStatus) => void;
  removeUpload: (id: string) => void;
}

// 4. Creating the actual Zustand store
export const useUploadStore = create<UploadState>((set) => ({
  uploads: {},
  
  addUpload: (upload) => set((state) => ({ 
    uploads: { ...state.uploads, [upload.id]: upload } 
  })),
  
  updateProgress: (id, progress) => set((state) => ({
    uploads: {
      ...state.uploads,
      [id]: { ...state.uploads[id], progress }
    }
  })),
  
  updateStatus: (id, status) => set((state) => ({
    uploads: {
      ...state.uploads,
      [id]: { ...state.uploads[id], status }
    }
  })),
  
  removeUpload: (id) => set((state) => {
    const newUploads = { ...state.uploads };
    delete newUploads[id];
    return { uploads: newUploads };
  }),
}));
