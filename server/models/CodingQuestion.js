import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String, default: '' },
}, { _id: false });

const codingQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
      index: true,
    },
    topics: {
      type: [String],
      required: true,
      index: true,
    },
    statement: {
      type: String,
      required: true,
    },
    examples: {
      type: [exampleSchema],
      default: [],
    },
    constraints: {
      type: [String],
      default: [],
    },
    hints: {
      type: [String],
      default: [],
    },
    starterCode: {
      type: Map,
      of: String,
      default: {
        javascript: '// Write your solution here\nfunction solve() {\n  \n}',
        python: '# Write your solution here\ndef solve():\n    pass',
        cpp: '// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}',
        java: '// Write your solution here\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}'
      },
    },
    functionName: {
      type: String,
      default: '',
    },
    testCases: [
      {
        input: { type: mongoose.Schema.Types.Mixed },
        expected: { type: mongoose.Schema.Types.Mixed },
        expectedOutput: { type: String },
        isHidden: { type: Boolean, default: false },
      }
    ],
  },
  { timestamps: true }
);

const CodingQuestion = mongoose.models.CodingQuestion || mongoose.model('CodingQuestion', codingQuestionSchema);
export default CodingQuestion;
