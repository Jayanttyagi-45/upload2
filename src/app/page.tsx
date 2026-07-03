'use client';

import { useState } from 'react';
import { tusUploadManager } from '../services/tusUploadManager';
import UploadStatus from '../components/UploadStatus';

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  
  // This function is triggered when a user selects a file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // Loop through all selected files and start them
      Array.from(event.target.files).forEach((file) => {
        tusUploadManager.startUpload(file);
      });
      
      // Clear the input so you can select the same file again if needed
      event.target.value = '';
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      // Filter to ensure we only upload video files
      const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('video/'));
      files.forEach((file) => {
        tusUploadManager.startUpload(file);
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-24">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Video Uploader</h1>
        <p className="text-gray-500 mb-8">Direct to Supabase using TUS Protocol</p>
        
        {/* The File Input */}
        <div 
          className={`border-2 border-dashed rounded-xl p-8 transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="cursor-pointer flex flex-col items-center w-full h-full">
            <span className="text-4xl mb-4">📁</span>
            <span className="text-blue-600 font-semibold text-lg hover:underline mb-2">
              Browse Videos
            </span>
            <span className="text-sm text-gray-400">or drag and drop here</span>
            <input 
              type="file" 
              className="hidden" 
              accept="video/*" 
              multiple 
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {/* 
        We render the UploadStatus component at the very bottom.
        Because it has "fixed" positioning in its CSS, it will float 
        in the bottom right corner over everything else!
      */}
      <UploadStatus />
    </main>
  );
}
