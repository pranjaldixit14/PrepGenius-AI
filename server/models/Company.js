import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
    },
    tier: {
      type: String,
      enum: ['Tier 1 / Product', 'Service / Enterprise', 'High-Growth Tech', 'Startup'],
      default: 'Tier 1 / Product',
    },
    roles: {
      type: [String],
      default: ['Software Development Engineer', 'Graduate Trainee', 'Backend Engineer'],
    },
    dsaEmphasis: [
      {
        topic: String,
        weightage: String, // e.g. "Very High (35%)"
        importance: Number, // 1 to 5
      }
    ],
    aptitudeEmphasis: [
      {
        topic: String,
        weightage: String,
      }
    ],
    coreCsTopics: {
      type: [String],
      default: ['Operating Systems', 'DBMS & SQL', 'Computer Networks', 'OOP Principles', 'System Design Basics'],
    },
    interviewPattern: [
      {
        round: Number,
        name: String,
        duration: String,
        description: String,
        format: String,
      }
    ],
    preparationChecklist: [
      {
        id: String,
        item: String,
        category: String,
      }
    ],
    popularQuestions: [
      {
        title: String,
        topic: String,
        difficulty: String,
      }
    ],
  },
  { timestamps: true }
);

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
export default Company;
