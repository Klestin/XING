import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  instagramId?: string;
  photos: string[];
  bio: string;
  age: number;
  location: {
    type: string;
    coordinates: number[];
  };
  preferences: {
    ageRange: {
      min: number;
      max: number;
    };
    distance: number;
    darkMode: boolean;
    notifications: boolean;
    privacy: {
      showOnline: boolean;
      showLocation: boolean;
    };
  };
  matches: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  instagramId: { type: String },
  photos: [{ type: String }],
  bio: { type: String, required: true },
  age: { type: Number, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  preferences: {
    ageRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    distance: { type: Number, required: true },
    darkMode: { type: Boolean, default: false },
    notifications: { type: Boolean, default: true },
    privacy: {
      showOnline: { type: Boolean, default: true },
      showLocation: { type: Boolean, default: true }
    }
  },
  matches: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create geospatial index
userSchema.index({ location: '2dsphere' });

export const User = mongoose.model<IUser>('User', userSchema); 