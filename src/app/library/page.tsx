'use client';
import { useState, useEffect } from 'react';
import { Play, Trash2, X } from 'lucide-react';

type Video = {
  id: string;
  title: string;
  size: string;
  duration: string;
  thumbnail: string;
  url: string;
};

export default function LibraryPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch('/api/videos');
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        }
      } catch (error) {
        console.error("Failed to fetch videos from backend:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Media Library</h1>
            <p className="text-gray-500 mt-1">Manage your uploaded video assets.</p>
          </div>
          <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
            {videos.length} Assets
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500 font-medium animate-pulse">
            Loading videos from backend...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col">
              {/* Thumbnail Container */}
              <div 
                className="relative h-48 w-full overflow-hidden"
                onClick={() => setPlayingVideo(video.id)}
              >
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Play className="text-white w-7 h-7 ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                  {video.duration}
                </div>
              </div>
              
              {/* Details */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 truncate mb-1" title={video.title}>
                    {video.title}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mb-4">{video.size}</p>
                </div>
                
                <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-auto">
                  <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                    Share Link
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideos(videos.filter(v => v.id !== video.id));
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
            {videos.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-400">
                <p>No media found on backend.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8" onClick={() => setPlayingVideo(null)}>
          <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setPlayingVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold transition-colors"
              title="Close Player"
            >
              <X className="w-6 h-6" />
            </button>
            <video 
              src={videos.find(v => v.id === playingVideo)?.url} 
              className="w-full h-auto max-h-[85vh] outline-none" 
              controls 
              autoPlay 
            />
          </div>
        </div>
      )}
    </main>
  );
}
