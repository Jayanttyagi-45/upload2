import * as tus from "tus-js-client";
import { useUploadStore } from "../store/uploadStore";

// We will use your Supabase URL and Anon Key here later
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

class TusUploadManager {
  // We keep a private list of the actual "tus" upload objects so we can pause/resume them
  private activeUploads: Map<string, tus.Upload> = new Map();

  // This creates a unique ID for the file based on its name, size, and date
  private getFileId(file: File): string {
    return `${file.name}-${file.size}-${file.lastModified}`;
  }

  public startUpload(file: File) {
    const fileId = this.getFileId(file);
    const store = useUploadStore.getState();

    // 1. Tell our Zustand store that a new upload has started
    if (!store.uploads[fileId]) {
      store.addUpload({
        id: fileId,
        fileName: file.name,
        progress: 0,
        status: "Uploading",
      });
    } else {
      store.updateStatus(fileId, "Uploading");
    }

    // 2. Configure the TUS library
    const upload = new tus.Upload(file, {
      endpoint: `${SUPABASE_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      chunkSize: 6 * 1024 * 1024, // Slices the video into exactly 6 Megabyte chunks (Supabase recommended)
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      metadata: {
        bucketName: "videos",
        objectName: `anonymous_uploads/${Date.now()}_${file.name}`,
        contentType: file.type,
      },
      // Force TUS to use our unique ID so it knows when to resume
      fingerprint: () => Promise.resolve(fileId),

      // 3. What to do while uploading (Update progress bar)
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
        store.updateProgress(fileId, percentage);
      },

      // 4. What to do when finished
      onSuccess: () => {
        store.updateStatus(fileId, "Completed");
        store.updateProgress(fileId, 100);
        this.activeUploads.delete(fileId);
      },

      onError: (error) => {
        console.error("Upload failed:", error);
        store.updateStatus(fileId, "Failed");
      },
    });

    // Save the upload object in memory
    this.activeUploads.set(fileId, upload);

    // Check if we have a saved upload URL in the browser's local storage to resume from
    upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length > 0) {
        console.log("Resuming previous upload found in local storage.");
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }
      upload.start();
    });
  }

  // --- Controls ---
  public pauseUpload(fileId: string) {
    const upload = this.activeUploads.get(fileId);
    if (upload) {
      upload.abort();
      useUploadStore.getState().updateStatus(fileId, "Paused");
    }
  }

  public resumeUpload(fileId: string) {
    const upload = this.activeUploads.get(fileId);
    if (upload) {
      upload.start();
      useUploadStore.getState().updateStatus(fileId, "Uploading");
    }
  }

  public cancelUpload(fileId: string) {
    const upload = this.activeUploads.get(fileId);
    if (upload) {
      upload.abort();
      this.activeUploads.delete(fileId);
    }
    useUploadStore.getState().removeUpload(fileId);
  }
}

// We export a single instance so the whole app uses the same manager
export const tusUploadManager = new TusUploadManager();
