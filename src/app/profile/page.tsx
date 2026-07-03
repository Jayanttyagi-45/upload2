'use client';
import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
export default function ProfilePage() {
  const [photoHover, setPhotoHover] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    bio: 'Software Developer and Videographer.',
    photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile((prev) => ({ ...prev, ...JSON.parse(savedProfile) }));
    }
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result) {
          setProfile(prev => ({ ...prev, photoUrl: result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate network request
    setTimeout(() => {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 w-full relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        
        <div className="px-8 pb-10">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Profile Photo Avatar */}
            <div className="relative -mt-16 mb-8 flex justify-between items-end">
              <label 
                className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 overflow-hidden cursor-pointer group block"
                onMouseEnter={() => setPhotoHover(true)}
                onMouseLeave={() => setPhotoHover(false)}
              >
                <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${photoHover ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="text-white text-xs font-semibold tracking-wider uppercase">Change</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoChange}
                />
              </label>
              <button 
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? 'Saving...' : saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Changes'}
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input required name="firstName" value={profile.firstName} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input required name="lastName" value={profile.lastName} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input required name="email" value={profile.email} onChange={handleChange} type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea name="bio" value={profile.bio} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none resize-none"></textarea>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
