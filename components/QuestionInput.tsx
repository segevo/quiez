import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Question } from '../types';

interface QuestionInputProps {
  questionNumber: number;
  data: Question;
  onChange: (id: number, field: string, value: string, index?: number) => void;
}

export const QuestionInput: React.FC<QuestionInputProps> = ({ questionNumber, data, onChange }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6 transition-all hover:shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm">
          {questionNumber}
        </span>
        הזנת שאלה {questionNumber}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">השאלה:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="הקלד את השאלה כאן..."
            value={data.text}
            onChange={(e) => onChange(data.id, 'text', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Correct Answer Input */}
          <div className="relative">
            <label className="flex items-center gap-1 text-sm font-bold text-green-700 mb-1">
              <CheckCircle size={16} />
              תשובה נכונה
            </label>
            <input
              type="text"
              className="w-full p-2 border-2 border-green-400 bg-green-50 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-green-700/50"
              placeholder="הזן את התשובה הנכונה"
              value={data.correctAnswer}
              onChange={(e) => onChange(data.id, 'correctAnswer', e.target.value)}
            />
          </div>

          {/* Wrong Answers Inputs */}
          {data.wrongAnswers.map((ans, idx) => (
            <div key={`wrong-${idx}`} className="relative">
              <label className="flex items-center gap-1 text-sm font-bold text-red-700 mb-1">
                <XCircle size={16} />
                תשובה שגויה {idx + 1}
              </label>
              <input
                type="text"
                className="w-full p-2 border-2 border-red-300 bg-red-50 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-red-700/50"
                placeholder="הזן תשובה שגויה"
                value={ans}
                onChange={(e) => onChange(data.id, 'wrongAnswer', e.target.value, idx)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};