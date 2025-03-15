import React, { useState } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { 
  GraduationCap, 
  MapPin, 
  Heart, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Instagram 
} from 'lucide-react';
import type { Profile } from '../types';

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onSwipe }) => {
  const controls = useAnimation();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(offset) > 100 || Math.abs(velocity) > 500) {
      const direction = offset > 0 ? 'right' : 'left';
      await controls.start({
        x: direction === 'left' ? -200 : 200,
        opacity: 0,
        transition: { duration: 0.3 }
      });
      onSwipe(direction);
      controls.set({ x: 0, opacity: 1 });
    } else {
      controls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.3 }
      });
    }
  };

  const handlePhotoNavigation = (direction: 'prev' | 'next') => {
    setCurrentPhotoIndex(prev => {
      if (direction === 'prev') {
        return prev > 0 ? prev - 1 : profile.photos.length - 1;
      } else {
        return prev < profile.photos.length - 1 ? prev + 1 : 0;
      }
    });
  };

  const handlePhotoUpload = async () => {
    // Photo upload logic here
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="w-[400px] bg-[#2D2D2D] rounded-2xl overflow-hidden shadow-xl"
    >
      <div className="relative h-[400px]">
        <motion.img
          key={currentPhotoIndex}
          src={profile.photos[currentPhotoIndex]}
          alt={profile.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover"
        />
        
        {profile.photos.length > 1 && (
          <>
            <button
              onClick={() => handlePhotoNavigation('prev')}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => handlePhotoNavigation('next')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <h2 className="text-2xl font-bold text-white">{profile.name}, {profile.age}</h2>
          <div className="flex items-center gap-2 text-white/90 mt-2">
            <MapPin size={16} />
            <span>{profile.state}</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
          {profile.instagramId && (
            <a
              href={`https://instagram.com/${profile.instagramId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <Instagram size={20} />
            </a>
          )}
        </div>
      </div>

      <div 
        className="p-6 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-2 text-white/90 mb-4">
          <GraduationCap size={18} />
          <span>CGPA: {profile.cgpa}</span>
        </div>

        <motion.div
          initial={false}
          animate={{ height: showDetails ? 'auto' : '100px' }}
          className="overflow-hidden"
        >
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-white/90">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-[#6200EE] text-white rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-white/90">Hobbies</h3>
            <div className="flex flex-wrap gap-2">
              {profile.hobbies.map((hobby) => (
                <span
                  key={hobby}
                  className="px-3 py-1 bg-[#03DAC6] text-black rounded-full text-sm"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>

          <p className="text-white/80">{profile.bio}</p>
        </motion.div>
      </div>

      <div className="flex justify-center gap-4 p-4 border-t border-white/10">
        <button
          onClick={() => onSwipe('left')}
          className="p-4 bg-[#F44336] rounded-full hover:bg-opacity-80 transition-colors"
        >
          <X className="text-white" size={24} />
        </button>
        <button
          onClick={() => onSwipe('right')}
          className="p-4 bg-[#4CAF50] rounded-full hover:bg-opacity-80 transition-colors"
        >
          <Heart className="text-white" size={24} />
        </button>
      </div>
    </motion.div>
  );
};