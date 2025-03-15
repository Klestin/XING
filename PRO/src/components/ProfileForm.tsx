import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { StudentProfile } from '../types';
import { X, Upload, Camera, GraduationCap, BookOpen, Calendar, User, Mail, Instagram } from 'lucide-react';

interface ProfileFormProps {
  onClose: () => void;
  onSubmit: (profile: StudentProfile) => void;
}

export function ProfileForm({ onClose, onSubmit }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [profile, setProfile] = useState<StudentProfile>({
    email: '',
    password: '',
    name: '',
    student_id: '',
    department: '',
    year: 1,
    cgpa: 0,
    bio: '',
    photos: [],
    instagram_id: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(profile);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      setProfile(prev => ({
        ...prev,
        photos: [...(prev.photos || []), publicUrl]
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading photo');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#2D2D2D] rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="text-white/60" size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photos */}
          <div>
            <label className="block text-white/80 mb-2">Profile Photos</label>
            <div className="flex gap-4">
              {profile.photos?.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Profile ${index + 1}`}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setProfile(prev => ({
                        ...prev,
                        photos: prev.photos?.filter((_, i) => i !== index)
                      }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:border-white/40 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <span className="text-white/60">+</span>
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full Name"
                  className="w-full bg-[#1E1E1E] rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#6200EE]"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full bg-[#1E1E1E] rounded-lg pl-10 pr-4 py-2 text-white/40"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Academic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="text"
                  name="student_id"
                  value={profile.student_id}
                  onChange={e => setProfile(prev => ({ ...prev, student_id: e.target.value }))}
                  placeholder="Student ID"
                  className="w-full bg-[#1E1E1E] rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#6200EE]"
                  required
                />
              </div>

              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="text"
                  name="department"
                  value={profile.department}
                  onChange={e => setProfile(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Department"
                  className="w-full bg-[#1E1E1E] rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#6200EE]"
                  required
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="number"
                  name="year"
                  value={profile.year}
                  onChange={e => setProfile(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  placeholder="Year"
                  className="w-full bg-[#1E1E1E] rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#6200EE]"
                  required
                />
              </div>

              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="number"
                  name="cgpa"
                  value={profile.cgpa}
                  onChange={e => setProfile(prev => ({ ...prev, cgpa: parseFloat(e.target.value) }))}
                  placeholder="CGPA"
                  step="0.01"
                  min="0"
                  max="4"
                  className="w-full bg-[#1E1E1E] rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#6200EE]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Social Media</h3>
            <div className="relative">
              <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
              <input
                type="text"
                name="instagram_id"
                value={profile.instagram_id}
                onChange={e => setProfile(prev => ({ ...prev, instagram_id: e.target.value }))}
                placeholder="Instagram ID"
                className="w-full bg-[#1E1E1E] rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#6200EE]"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Bio</h3>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full bg-[#1E1E1E] rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#6200EE]"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#6200EE] text-white rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 