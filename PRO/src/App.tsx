import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Heart, X, User, Settings as SettingsIcon, LogOut, Camera } from 'lucide-react';
import type { StudentProfile } from './types';

// Mock data for student profiles
const mockProfiles = [
  {
    id: '1',
    name: 'Sarah Chen',
    age: 21,
    department: 'Computer Science',
    year: 3,
    cgpa: 3.8,
    interests: ['AI', 'Web Development', 'Machine Learning'],
    bio: 'Passionate about AI and web development. Looking for study buddies!',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
  },
  {
    id: '2',
    name: 'Alex Thompson',
    age: 22,
    department: 'Engineering',
    year: 4,
    cgpa: 3.6,
    interests: ['Robotics', 'IoT', 'Embedded Systems'],
    bio: 'Engineering student interested in robotics and IoT projects.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    age: 20,
    department: 'Business',
    year: 2,
    cgpa: 3.9,
    interests: ['Finance', 'Marketing', 'Entrepreneurship'],
    bio: 'Business student with a passion for entrepreneurship and marketing.',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
  },
  {
    id: '4',
    name: 'James Wilson',
    age: 23,
    department: 'Data Science',
    year: 4,
    cgpa: 3.7,
    interests: ['Data Analysis', 'Machine Learning', 'Statistics'],
    bio: 'Data Science enthusiast who loves analyzing patterns and solving complex problems.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
  },
  {
    id: '5',
    name: 'Sophie Kim',
    age: 21,
    department: 'Design',
    year: 3,
    cgpa: 3.8,
    interests: ['UI/UX Design', 'Graphic Design', 'Product Design'],
    bio: 'Design student passionate about creating beautiful and functional user experiences.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
  },
  {
    id: '6',
    name: 'Michael Chen',
    age: 22,
    department: 'Computer Science',
    year: 3,
    cgpa: 3.9,
    interests: ['Cybersecurity', 'Cloud Computing', 'DevOps'],
    bio: 'CS student focused on cybersecurity and cloud technologies.',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400'
  },
  {
    id: '7',
    name: 'Olivia Parker',
    age: 20,
    department: 'Psychology',
    year: 2,
    cgpa: 3.7,
    interests: ['Clinical Psychology', 'Research', 'Mental Health'],
    bio: 'Psychology student interested in understanding human behavior and mental health.',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400'
  },
  {
    id: '8',
    name: 'David Lee',
    age: 23,
    department: 'Engineering',
    year: 4,
    cgpa: 3.6,
    interests: ['Mechanical Engineering', '3D Printing', 'CAD'],
    bio: 'Mechanical engineering student passionate about innovation and design.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  },
  {
    id: '9',
    name: 'Isabella Martinez',
    age: 21,
    department: 'Biology',
    year: 3,
    cgpa: 3.9,
    interests: ['Genetics', 'Molecular Biology', 'Research'],
    bio: 'Biology student fascinated by genetics and molecular biology.',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400'
  },
  {
    id: '10',
    name: 'William Taylor',
    age: 22,
    department: 'Physics',
    year: 3,
    cgpa: 3.8,
    interests: ['Quantum Physics', 'Astrophysics', 'Research'],
    bio: 'Physics student exploring the mysteries of the universe.',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'
  },
  {
    id: '11',
    name: 'Maya Patel',
    age: 20,
    department: 'Chemistry',
    year: 2,
    cgpa: 3.7,
    interests: ['Organic Chemistry', 'Research', 'Lab Work'],
    bio: 'Chemistry student passionate about organic chemistry and research.',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400'
  },
  {
    id: '12',
    name: 'Lucas Anderson',
    age: 23,
    department: 'Economics',
    year: 4,
    cgpa: 3.6,
    interests: ['Macroeconomics', 'Public Policy', 'Data Analysis'],
    bio: 'Economics student interested in public policy and economic analysis.',
    photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400'
  },
  {
    id: '13',
    name: 'Ava Nguyen',
    age: 21,
    department: 'Computer Science',
    year: 3,
    cgpa: 3.8,
    interests: ['Mobile Development', 'UI/UX', 'App Development'],
    bio: 'CS student focused on mobile app development and user experience.',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400'
  },
  {
    id: '14',
    name: 'Ethan Brown',
    age: 22,
    department: 'Business',
    year: 3,
    cgpa: 3.7,
    interests: ['Finance', 'Investment', 'Stock Market'],
    bio: 'Business student passionate about finance and investment strategies.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
  },
  {
    id: '15',
    name: 'Sophia Chen',
    age: 20,
    department: 'Mathematics',
    year: 2,
    cgpa: 3.9,
    interests: ['Pure Mathematics', 'Statistics', 'Problem Solving'],
    bio: 'Mathematics student who loves solving complex problems.',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
  },
  {
    id: '16',
    name: 'Ryan Murphy',
    age: 23,
    department: 'Film',
    year: 4,
    cgpa: 3.6,
    interests: ['Cinematography', 'Screenwriting', 'Film Production'],
    bio: 'Film student passionate about storytelling through visual media.',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'
  },
  {
    id: '17',
    name: 'Lily Zhang',
    age: 21,
    department: 'Architecture',
    year: 3,
    cgpa: 3.8,
    interests: ['Sustainable Design', 'Urban Planning', '3D Modeling'],
    bio: 'Architecture student focused on sustainable and innovative design.',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400'
  },
  {
    id: '18',
    name: 'Daniel Kim',
    age: 22,
    department: 'Engineering',
    year: 3,
    cgpa: 3.7,
    interests: ['Electrical Engineering', 'Power Systems', 'Renewable Energy'],
    bio: 'Engineering student passionate about renewable energy solutions.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
  },
  {
    id: '19',
    name: 'Emma Wilson',
    age: 20,
    department: 'Environmental Science',
    year: 2,
    cgpa: 3.9,
    interests: ['Climate Change', 'Conservation', 'Field Research'],
    bio: 'Environmental science student dedicated to climate change research.',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400'
  },
  {
    id: '20',
    name: 'Marcus Johnson',
    age: 23,
    department: 'Computer Science',
    year: 4,
    cgpa: 3.6,
    interests: ['Game Development', 'VR/AR', '3D Graphics'],
    bio: 'CS student passionate about game development and virtual reality.',
    photo: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400'
  },
  {
    id: '21',
    name: 'Nina Patel',
    age: 21,
    department: 'Biotechnology',
    year: 3,
    cgpa: 3.8,
    interests: ['Genetic Engineering', 'Bioinformatics', 'Research'],
    bio: 'Biotechnology student focused on genetic engineering and bioinformatics.',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
  },
  {
    id: '22',
    name: 'Thomas Wright',
    age: 22,
    department: 'Aerospace Engineering',
    year: 3,
    cgpa: 3.7,
    interests: ['Space Technology', 'Aircraft Design', 'Propulsion Systems'],
    bio: 'Aerospace engineering student passionate about space exploration.',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400'
  },
  {
    id: '23',
    name: 'Sofia Garcia',
    age: 20,
    department: 'International Relations',
    year: 2,
    cgpa: 3.9,
    interests: ['Global Politics', 'Diplomacy', 'International Law'],
    bio: 'International relations student interested in global politics and diplomacy.',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
  },
  {
    id: '24',
    name: 'Oliver Chen',
    age: 23,
    department: 'Computer Science',
    year: 4,
    cgpa: 3.6,
    interests: ['Blockchain', 'Cryptography', 'Distributed Systems'],
    bio: 'CS student focused on blockchain technology and cryptography.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
  },
  {
    id: '25',
    name: 'Victoria Lee',
    age: 21,
    department: 'Neuroscience',
    year: 3,
    cgpa: 3.8,
    interests: ['Cognitive Science', 'Brain Research', 'Psychology'],
    bio: 'Neuroscience student fascinated by the human brain and cognition.',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400'
  }
];

function MainApp() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [matches, setMatches] = useState<any[]>([]);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'discover' | 'matches' | 'profile' | 'settings'>('discover');
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [allProfiles, setAllProfiles] = useState<any[]>(mockProfiles);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: 'Your Name',
    department: 'Computer Science',
    year: 3,
    bio: '',
    interests: '',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
  });
  const [settingsData, setSettingsData] = useState({
    email: '',
    password: '',
    showProfile: true,
    allowMessages: true
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch real student profiles on component mount
  useEffect(() => {
    const fetchStudentProfiles = async () => {
      try {
        const { data: studentProfiles, error } = await supabase
          .from('student_profiles')
          .select('*');

        if (error) throw error;

        // Convert StudentProfile to Profile format
        const formattedProfiles = studentProfiles.map((profile: StudentProfile) => ({
          id: profile.id || String(Math.random()),
          name: profile.name,
          age: calculateAge(profile.created_at), // You might want to add an age field to StudentProfile
          state: 'Student',
          interests: profile.bio.split(',').map(i => i.trim()), // You might want to add an interests field
          hobbies: [],
          cgpa: profile.cgpa,
          bio: profile.bio,
          photos: profile.photos,
          instagramId: profile.instagram_id,
          department: profile.department,
          year: profile.year
        }));

        // Combine mock and real profiles
        setAllProfiles([...formattedProfiles, ...mockProfiles]);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfiles();
  }, []);

  // Add new useEffect to fetch user's profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile, error } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setProfileData({
            name: profile.name || 'Your Name',
            department: profile.department || 'Computer Science',
            year: profile.year || 1,
            bio: profile.bio || '',
            interests: profile.interests?.join(', ') || '',
            photo: profile.photos?.[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
          });
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  // Add effect to fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      setCurrentUser(authData?.user || null);
    };

    fetchCurrentUser();
  }, []);

  // Add subscription for real-time chat updates
  useEffect(() => {
    if (!selectedMatch) return;

    const fetchUserAndMessages = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      // Fetch existing messages
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${authData.user.id},receiver_id.eq.${authData.user.id}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(messages || []);
      scrollToBottom();

      // Subscribe to new messages
      const subscription = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${authData.user.id},receiver_id=eq.${selectedMatch.id}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new]);
            scrollToBottom();
          }
        )
        .subscribe();

      return subscription;
    };

    const setupSubscription = async () => {
      const subscription = await fetchUserAndMessages();
      return () => {
        subscription?.unsubscribe();
      };
    };

    setupSubscription();
  }, [selectedMatch]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatch) return;

    setIsSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const message = {
        sender_id: user.id,
        receiver_id: selectedMatch.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('messages')
        .insert([message]);

      if (error) throw error;

      setNewMessage('');
      scrollToBottom();
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Error sending message');
    } finally {
      setIsSending(false);
    }
  };

  // Helper function to calculate age from created_at
  const calculateAge = (created_at?: string) => {
    if (!created_at) return 20; // Default age
    const years = Math.floor(
      (new Date().getTime() - new Date(created_at).getTime()) / 
      (1000 * 60 * 60 * 24 * 365)
    );
    return 18 + years; // Assuming minimum age is 18
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      const newMatch = allProfiles[currentProfileIndex];
      setMatches([...matches, newMatch]);
      setMatchedProfile(newMatch);
      setShowMatchAnimation(true);
      setTimeout(() => setShowMatchAnimation(false), 3000);
    }
    
    setCurrentProfileIndex((prev) => 
      prev < allProfiles.length - 1 ? prev + 1 : 0
    );
  };

  const handleLogout = () => {
    // Add your logout logic here
    window.location.href = '/login';
  };

  const handleProfileSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Convert interests string to array
      const interestsArray = profileData.interests
        .split(',')
        .map(interest => interest.trim())
        .filter(interest => interest.length > 0);

      const { error: updateError } = await supabase
        .from('student_profiles')
        .update({
          name: profileData.name,
          department: profileData.department,
          year: profileData.year,
          bio: profileData.bio,
          interests: interestsArray,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err instanceof Error ? err.message : 'Error saving profile');
    }
  };

  const handleSettingsSave = () => {
    // Here you would typically save to your backend
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Show loading state
      setShowSuccessMessage(false);
      const loadingMessage = document.createElement('div');
      loadingMessage.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      loadingMessage.textContent = 'Uploading photo...';
      document.body.appendChild(loadingMessage);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload photo to storage
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      // Update profile in database
      const { error: updateError } = await supabase
        .from('student_profiles')
        .update({
          photos: [publicUrl],
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setProfileData(prev => ({
        ...prev,
        photo: publicUrl
      }));

      // Remove loading message and show success
      document.body.removeChild(loadingMessage);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError(err instanceof Error ? err.message : 'Error uploading photo');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'discover':
        return (
          <div className="flex-1 flex items-center justify-center p-4 md:p-6">
            {loading ? (
              <div className="text-white">Loading profiles...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : allProfiles[currentProfileIndex] ? (
              <div className="bg-[#2D2D2D] rounded-xl p-4 md:p-6 w-full max-w-md">
                <img
                  src={allProfiles[currentProfileIndex].photos?.[0] || allProfiles[currentProfileIndex].photo}
                  alt={allProfiles[currentProfileIndex].name}
                  className="w-full h-64 md:h-96 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {allProfiles[currentProfileIndex].name}, {allProfiles[currentProfileIndex].age}
                </h2>
                <p className="text-white/60 mb-2">
                  {allProfiles[currentProfileIndex].department} • Year {allProfiles[currentProfileIndex].year}
                </p>
                <p className="text-white/60 mb-4">
                  CGPA: {allProfiles[currentProfileIndex].cgpa}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {allProfiles[currentProfileIndex].interests.map((interest: string, index: number) => (
                    <span
                      key={index}
                      className="bg-[#6200EE] text-white px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
                <p className="text-white/80 mb-6">
                  {allProfiles[currentProfileIndex].bio}
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleSwipe('left')}
                    className="p-4 bg-red-500 rounded-full hover:bg-opacity-80 transition-colors"
                  >
                    <X className="text-white" size={24} />
                  </button>
                  <button
                    onClick={() => handleSwipe('right')}
                    className="p-4 bg-green-500 rounded-full hover:bg-opacity-80 transition-colors"
                  >
                    <Heart className="text-white" size={24} />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        );
      case 'matches':
        return (
          <div className="flex-1 bg-[#2D2D2D] rounded-xl p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Your Matches</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="bg-[#1E1E1E] rounded-lg p-4 cursor-pointer hover:bg-[#2A2A2A] transition-colors"
                  onClick={() => {
                    setSelectedMatch(match);
                    setShowChat(true);
                  }}
                >
                  <img
                    src={match.photo}
                    alt={match.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-white font-medium text-lg">{match.name}</h3>
                  <p className="text-white/60">{match.department}</p>
                  <p className="text-white/40 text-sm">Year {match.year}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="flex-1 bg-[#2D2D2D] rounded-xl p-4 md:p-6 relative">
            <button
              onClick={() => setCurrentView('discover')}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Your Profile</h2>
            <div className="bg-[#1E1E1E] rounded-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <div className="relative group">
                  <img
                    src={profileData.photo}
                    alt="Your Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Camera className="text-white" size={20} />
                  </label>
                </div>
                <div className="w-full md:w-auto">
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full bg-transparent text-white text-xl font-medium border-b border-white/20 focus:border-white/60 outline-none"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    <input
                      type="text"
                      value={profileData.department}
                      onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      className="flex-1 bg-transparent text-white/60 border-b border-white/20 focus:border-white/60 outline-none"
                    />
                    <span className="text-white/60">•</span>
                    <input
                      type="number"
                      value={profileData.year}
                      onChange={(e) => setProfileData({ ...profileData, year: parseInt(e.target.value) })}
                      className="w-16 bg-transparent text-white/60 border-b border-white/20 focus:border-white/60 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-white/60 block mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full bg-[#2A2A2A] text-white rounded-lg p-3"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div>
                  <label className="text-white/60 block mb-2">Interests</label>
                  <input
                    type="text"
                    value={profileData.interests}
                    onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
                    className="w-full bg-[#2A2A2A] text-white rounded-lg p-3"
                    placeholder="Add your interests..."
                  />
                </div>
                <button 
                  onClick={handleProfileSave}
                  className="w-full bg-[#6200EE] text-white py-3 rounded-lg hover:bg-[#7C4DFF] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 bg-[#2D2D2D] rounded-xl p-4 md:p-6 relative">
            <button
              onClick={() => setCurrentView('discover')}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Settings</h2>
            <div className="bg-[#1E1E1E] rounded-lg p-4 md:p-6 space-y-6">
              <div>
                <h3 className="text-white font-medium mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/60 block mb-2">Email</label>
                    <input
                      type="email"
                      value={settingsData.email}
                      onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                      className="w-full bg-[#2A2A2A] text-white rounded-lg p-3"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 block mb-2">Password</label>
                    <input
                      type="password"
                      value={settingsData.password}
                      onChange={(e) => setSettingsData({ ...settingsData, password: e.target.value })}
                      className="w-full bg-[#2A2A2A] text-white rounded-lg p-3"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-white font-medium mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settingsData.showProfile}
                      onChange={(e) => setSettingsData({ ...settingsData, showProfile: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-white">Show my profile to others</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settingsData.allowMessages}
                      onChange={(e) => setSettingsData({ ...settingsData, allowMessages: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-white">Allow messages from matches</span>
                  </label>
                </div>
              </div>
              <button
                onClick={handleSettingsSave}
                className="w-full bg-[#6200EE] text-white py-3 rounded-lg hover:bg-[#7C4DFF] transition-colors"
              >
                Save Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col md:flex-row p-4 md:p-8 gap-4 md:gap-8">
      {/* Main Content */}
      <div className="flex-1">
        {renderContent()}
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Changes saved successfully!
        </div>
      )}

      {/* Sidebar - Hidden on mobile when in profile or settings */}
      <div className={`w-full md:w-96 flex flex-col gap-4 ${(currentView === 'profile' || currentView === 'settings') ? 'hidden md:flex' : ''}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Matches</h2>
          <div className="flex gap-2">
            <button 
              className={`p-2 rounded-full transition-colors ${currentView === 'profile' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              onClick={() => setCurrentView('profile')}
            >
              <User className="text-white/60" size={20} />
            </button>
            <button 
              className={`p-2 rounded-full transition-colors ${currentView === 'settings' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              onClick={() => setCurrentView('settings')}
            >
              <SettingsIcon className="text-white/60" size={20} />
            </button>
            <button 
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="text-white/60" size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-[#2D2D2D] rounded-xl p-4 overflow-y-auto">
          {matches.map((match) => (
            <div
              key={match.id}
              className="flex items-center gap-4 p-4 bg-[#1E1E1E] rounded-lg mb-2 cursor-pointer hover:bg-[#2A2A2A] transition-colors"
              onClick={() => {
                setSelectedMatch(match);
                setShowChat(true);
              }}
            >
              <img
                src={match.photo}
                alt={match.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-white font-medium">{match.name}</h3>
                <p className="text-white/60 text-sm">{match.department}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {showChat && selectedMatch && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#2D2D2D] rounded-xl w-full h-full md:h-[80vh] md:max-w-2xl flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMatch.photo}
                  alt={selectedMatch.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-white font-medium">{selectedMatch.name}</h3>
                  <p className="text-white/60 text-sm">{selectedMatch.department}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowChat(false);
                  setMessages([]);
                  setNewMessage('');
                }}
                className="text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-white/40">
                  Start a conversation with {selectedMatch.name}
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isSender = message.sender_id === currentUser?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isSender
                              ? 'bg-[#6200EE] text-white'
                              : 'bg-[#1E1E1E] text-white/90'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs opacity-60 mt-1">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-[#1E1E1E] text-white rounded-lg px-4 py-2"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={isSending || !newMessage.trim()}
                  className="bg-[#6200EE] text-white px-6 py-2 rounded-lg hover:bg-[#7C4DFF] transition-colors disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Match Animation */}
      {showMatchAnimation && matchedProfile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center p-4">
            <Heart className="w-24 md:w-32 h-24 md:h-32 text-pink-500 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">It's a Match!</h2>
            <p className="text-lg md:text-xl text-white/80">
              You matched with {matchedProfile.name}
            </p>
            <img
              src={matchedProfile.photo}
              alt={matchedProfile.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto mt-8 object-cover border-4 border-pink-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router basename="/">
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;