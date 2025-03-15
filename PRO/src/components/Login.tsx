import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StudentProfile } from '../types';

interface LoginProps {
  onLogin: () => void;
}

// Department code mapping
const DEPARTMENT_CODES: { [key: string]: string } = {
  'Computer Science': 'CS',
  'Information Technology': 'IT',
  'Electrical Engineering': 'EE',
  'Mechanical Engineering': 'ME',
  'Civil Engineering': 'CE',
  'Chemical Engineering': 'CH',
  'Business Administration': 'BA',
  'Data Science': 'DS',
  'Psychology': 'PS',
  'Design': 'DE'
};

export function Login({ onLogin }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Registration form state
  const [registerData, setRegisterData] = useState<StudentProfile>({
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
  });

  // Generate student ID based on department and year
  const generateStudentId = (department: string) => {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const deptCode = DEPARTMENT_CODES[department] || department.slice(0, 2).toUpperCase();
    // Generate a random 4-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${currentYear}-${deptCode}-${randomNum}`;
  };

  // Update student ID when department changes
  useEffect(() => {
    if (registerData.department && isRegistering) {
      const newStudentId = generateStudentId(registerData.department);
      setRegisterData(prev => ({ ...prev, student_id: newStudentId }));
    }
  }, [registerData.department, isRegistering]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;
      onLogin();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus('Validating input...');

    try {
      // Input validation
      if (!registerData.email || !registerData.password) {
        throw new Error('Email and password are required');
      }

      if (registerData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (!registerData.name.trim()) {
        throw new Error('Name is required');
      }

      if (!registerData.department) {
        throw new Error('Please select a department');
      }

      if (registerData.cgpa < 0 || registerData.cgpa > 4) {
        throw new Error('CGPA must be between 0 and 4');
      }

      if (registerData.year < 1 || registerData.year > 5) {
        throw new Error('Year must be between 1 and 5');
      }

      // Validate student ID format
      if (!registerData.student_id.match(/^\d{2}-[A-Z]{2,3}-\d{4}$/)) {
        throw new Error('Invalid student ID format');
      }

      console.log('Starting registration process...', { registerData });

      setStatus('Creating your account...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        console.error('No user data returned');
        throw new Error('Failed to create user account');
      }

      console.log('Auth user created successfully');

      setStatus('Setting up your profile...');
      const { data: profileData, error: profileError } = await supabase
        .from('student_profiles')
        .insert([
          {
            id: authData.user.id,
            email: registerData.email,
            name: registerData.name,
            student_id: registerData.student_id,
            department: registerData.department,
            year: registerData.year,
            cgpa: registerData.cgpa,
            bio: registerData.bio || '',
            photos: [],
            instagram_id: registerData.instagram_id || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Try to clean up the auth user if profile creation fails
        await supabase.auth.signOut();
        throw new Error('Failed to create student profile: ' + profileError.message);
      }

      console.log('Profile created successfully:', profileData);

      setStatus('Registration successful! Logging you in...');
      onLogin();
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An unexpected error occurred');
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#2D2D2D] rounded-xl p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Student Match</h2>
            <p className="text-white/60">Connect with fellow students</p>
          </div>

          {!isRegistering ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-white/60 block mb-2">Email</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full bg-[#1E1E1E] text-white rounded-lg px-4 py-3"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label className="text-white/60 block mb-2">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full bg-[#1E1E1E] text-white rounded-lg px-4 py-3"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6200EE] text-white py-3 rounded-lg hover:bg-[#7C4DFF] transition-colors disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
              <p className="text-center text-white/60">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-[#6200EE] hover:text-[#7C4DFF]"
                >
                  Sign Up
                </button>
              </p>
            </form>
          ) : (
            // Registration Form
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-white/60 block mb-2">Email</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full bg-[#1E1E1E] text-white rounded-lg px-4 py-3"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label className="text-white/60 block mb-2">Password</label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full bg-[#1E1E1E] text-white rounded-lg px-4 py-3"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="text-white/60 block mb-2">Full Name</label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="w-full bg-[#1E1E1E] text-white rounded-lg px-4 py-3"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="text-white/60 block mb-2">Department</label>
                <select
                  value={registerData.department}
                  onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
                  className="w-full bg-[#1E1E1E] text-white rounded-lg px-4 py-3"
                  required
                >
                  <option value="">Select Department</option>
                  {Object.keys(DEPARTMENT_CODES).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white/60 block mb-2">Student ID</label>
                <input
                  type="text"
                  value={registerData.student_id}
                  className="w-full bg-[#1E1E1E] text-white rounded-lg px-4 py-3"
                  placeholder="Generated automatically"
                  readOnly
                />
                <p className="text-white/40 text-xs mt-1">
                  Format: YY-DEPT-XXXX (automatically generated)
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 block mb-2">Year</label>
                  <input
                    type="number"
                    value={registerData.year}
                    onChange={(e) => setRegisterData({ ...registerData, year: parseInt(e.target.value) })}
                    className="w-full bg-[#1E1E1E] text-white rounded-lg px-4 py-3"
                    min="1"
                    max="5"
                    required
                  />
                </div>
                <div>
                  <label className="text-white/60 block mb-2">CGPA</label>
                  <input
                    type="number"
                    value={registerData.cgpa}
                    onChange={(e) => setRegisterData({ ...registerData, cgpa: parseFloat(e.target.value) })}
                    className="w-full bg-[#1E1E1E] text-white rounded-lg px-4 py-3"
                    step="0.01"
                    min="0"
                    max="4"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-white/60 block mb-2">Bio</label>
                <textarea
                  value={registerData.bio}
                  onChange={(e) => setRegisterData({ ...registerData, bio: e.target.value })}
                  className="w-full bg-[#1E1E1E] text-white rounded-lg px-4 py-3"
                  placeholder="Tell us about yourself..."
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="text-white/60 block mb-2">Instagram ID</label>
                <input
                  type="text"
                  value={registerData.instagram_id}
                  onChange={(e) => setRegisterData({ ...registerData, instagram_id: e.target.value })}
                  className="w-full bg-[#1E1E1E] text-white rounded-lg px-4 py-3"
                  placeholder="@yourusername"
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#6200EE] text-white py-3 rounded-lg hover:bg-[#7C4DFF] transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
              <p className="text-center text-white/60">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-[#6200EE] hover:text-[#7C4DFF]"
                >
                  Log In
                </button>
              </p>
            </form>
          )}

          {status && (
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-3">
              <p className="text-blue-500 text-sm flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                {status}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 