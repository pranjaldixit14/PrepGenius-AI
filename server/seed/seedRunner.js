import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CodingQuestion from '../models/CodingQuestion.js';
import AptitudeQuestion from '../models/AptitudeQuestion.js';
import Company from '../models/Company.js';
import { codingQuestionsSeed, aptitudeQuestionsSeed, companiesSeed } from './seedData.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Synchronizing Coding Questions...');
    for (const q of codingQuestionsSeed) {
      await CodingQuestion.findOneAndUpdate(
        { slug: q.slug },
        { $set: q },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Successfully synced ${codingQuestionsSeed.length} coding questions.`);

    console.log('[Seed] Synchronizing Aptitude Questions...');
    for (const aq of aptitudeQuestionsSeed) {
      await AptitudeQuestion.findOneAndUpdate(
        { question: aq.question },
        { $set: aq },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Successfully synced ${aptitudeQuestionsSeed.length} aptitude questions.`);

    console.log('[Seed] Synchronizing Company Profiles...');
    for (const c of companiesSeed) {
      await Company.findOneAndUpdate(
        { slug: c.slug },
        { $set: c },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Successfully synced ${companiesSeed.length} company profiles.`);

    console.log('[Seed] Database initialization verified.');
  } catch (error) {
    console.warn('[Seed Warning] Could not seed database:', error.message);
  }
};

// If run directly via `npm run seed`
if (process.argv[1] && process.argv[1].endsWith('seedRunner.js')) {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prepgenius';
  mongoose.connect(mongoUri)
    .then(async () => {
      console.log('[Seed CLI] Connected to MongoDB');
      await seedDatabase();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed CLI] Connection failed:', err.message);
      process.exit(1);
    });
}
