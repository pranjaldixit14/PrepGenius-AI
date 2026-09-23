import mongoose from 'mongoose';
import Company from '../models/Company.js';
import { memoryStore } from '../services/memoryStore.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getCompanies = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const companies = await Company.find().select('name slug overview tier roles dsaEmphasis');
      return res.json({ success: true, count: companies.length, companies });
    } else {
      const companies = memoryStore.getCompanies().map(({ interviewPattern: _, preparationChecklist: __, ...rest }) => rest);
      return res.json({ success: true, count: companies.length, companies });
    }
  } catch (error) {
    next(error);
  }
};

export const getCompanyDetails = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    let company;
    if (isDbConnected()) {
      if (mongoose.Types.ObjectId.isValid(identifier)) {
        company = await Company.findById(identifier);
      }
      if (!company) {
        company = await Company.findOne({ slug: identifier });
      }
    } else {
      company = memoryStore.getCompanyBySlugOrId(identifier);
    }

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company preparation guide not found.' });
    }

    return res.json({ success: true, company });
  } catch (error) {
    next(error);
  }
};
