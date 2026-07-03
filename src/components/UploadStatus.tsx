'use client';

import { useUploadStore } from '../store/uploadStore';
import { tusUploadManager } from '../services/tusUploadManager';

export default function UploadStatus() {
  // 1. We connect to our Zustand "whiteboard" to get the list of uploads
  const { uploads } = useUploadStore();
  const uploadList = Object.values(uploads);

  // If there are no uploads, don't show the floating UI at all
  if (uploadList.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-50">
      <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Active Uploads ({uploadList.length})</h3>
      
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {uploadList.map((upload) => (
          <div key={upload.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            
            {/* Top Row: Filename and Status/Buttons */}
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-700 truncate w-40" title={upload.fileName}>
                {upload.fileName}
              </span>
              
              <div className="flex gap-2 items-center">
                <span className="text-[10px] font-bold px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                  {upload.status}
                </span>

                {/* Pause Button */}
                {upload.status === 'Uploading' && (
                  <button onClick={() => tusUploadManager.pauseUpload(upload.id)} className="text-xl hover:text-yellow-600 transition-colors" title="Pause">
                    ⏸️
                  </button>
                )}
                
                {/* Resume Button */}
                {upload.status === 'Paused' && (
                  <button onClick={() => tusUploadManager.resumeUpload(upload.id)} className="text-xl hover:text-blue-600 transition-colors" title="Resume">
                    ▶️
                  </button>
                )}
                
                {/* Cancel Button */}
                <button onClick={() => tusUploadManager.cancelUpload(upload.id)} className="text-xl hover:text-red-600 transition-colors" title="Cancel">
                  ✖️
                </button>
              </div>
            </div>
            
            {/* Bottom Row: The Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
              <div 
                className={`h-full transition-all duration-300 ${
                  upload.status === 'Completed' ? 'bg-green-500' : 
                  upload.status === 'Failed' ? 'bg-red-500' : 
                  upload.status === 'Paused' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                style={{ width: `${upload.progress}%` }}
              />
            </div>
            <div className="text-right text-xs font-bold text-gray-500">
              {upload.progress}%
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
