import React, { useState } from 'react';
import { 
  Moon, 
  Bell, 
  Eye, 
  MapPin, 
  User, 
  LogOut,
  Save
} from 'lucide-react';
import type { UserPreferences } from '../types';

interface SettingsProps {
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    darkMode: true,
    notifications: {
      matches: true,
      messages: true,
      profileViews: false
    },
    visibility: true,
    maxDistance: 50,
    ageRange: {
      min: 18,
      max: 25
    }
  });

  const handleSave = () => {
    // TODO: Implement save functionality with backend
    console.log('Saving preferences:', preferences);
  };

  return (
    <div className="bg-[#2D2D2D] rounded-xl p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Settings</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <span className="text-white/60">×</span>
        </button>
      </div>

      {/* Appearance */}
      <section className="mb-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Moon size={20} />
          Appearance
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/80">Dark Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.darkMode}
                onChange={(e) => setPreferences({
                  ...preferences,
                  darkMode: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6200EE]"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Bell size={20} />
          Notifications
        </h3>
        <div className="space-y-4">
          {Object.entries(preferences.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-white/80 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    notifications: {
                      ...preferences.notifications,
                      [key]: e.target.checked
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6200EE]"></div>
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="mb-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Eye size={20} />
          Privacy
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/80">Profile Visibility</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.visibility}
                onChange={(e) => setPreferences({
                  ...preferences,
                  visibility: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6200EE]"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="mb-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <MapPin size={20} />
          Location
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 mb-2">Maximum Distance (km)</label>
            <input
              type="range"
              min="1"
              max="100"
              value={preferences.maxDistance}
              onChange={(e) => setPreferences({
                ...preferences,
                maxDistance: parseInt(e.target.value)
              })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#6200EE]"
            />
            <div className="text-right text-white/60">{preferences.maxDistance} km</div>
          </div>
        </div>
      </section>

      {/* Age Range */}
      <section className="mb-6">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <User size={20} />
          Age Range
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 mb-2">Minimum Age</label>
            <input
              type="number"
              min="18"
              max="100"
              value={preferences.ageRange.min}
              onChange={(e) => setPreferences({
                ...preferences,
                ageRange: {
                  ...preferences.ageRange,
                  min: parseInt(e.target.value)
                }
              })}
              className="w-full bg-[#1E1E1E] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]"
            />
          </div>
          <div>
            <label className="block text-white/80 mb-2">Maximum Age</label>
            <input
              type="number"
              min="18"
              max="100"
              value={preferences.ageRange.max}
              onChange={(e) => setPreferences({
                ...preferences,
                ageRange: {
                  ...preferences.ageRange,
                  max: parseInt(e.target.value)
                }
              })}
              className="w-full bg-[#1E1E1E] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6200EE]"
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-white/60 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#6200EE] text-white rounded-lg hover:bg-opacity-80 transition-colors flex items-center gap-2"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}; 