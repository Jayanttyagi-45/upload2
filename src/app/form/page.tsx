'use client';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
export default function FormPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit form');
      
      setStatus('success');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      }, 3000);
      
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen py-16 px-4 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-10 border border-gray-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-50 blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-indigo-50 blur-3xl opacity-60 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Contact Support</h1>
            <p className="text-gray-500 text-lg">We'd love to hear from you. Send us a message.</p>
          </div>
          
          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h2>
              <p className="text-green-600">Thanks for reaching out. We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-medium">
                  Failed to send message. Please try again or check if the backend is running.
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <input 
                    required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Jane Doe" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <input 
                    required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Subject</label>
                <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer">
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Billing Question</option>
                  <option>Feedback</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Message</label>
                <textarea 
                  required name="message" value={formData.message} onChange={handleChange} rows={5} placeholder="How can we help you?" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-70 disabled:transform-none flex justify-center items-center gap-2"
              >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
