import React, { useMemo } from 'react';
import { Question, CORRECT_LETTERS_MAP } from '../types';

interface PrintPreviewProps {
  questions: Question[];
  id: string;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Fisher-Yates shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const getWrongLetters = (exclude: string, count: number): string[] => {
  // Filter out the correct letter (and its first char just in case it's multi-char like 'GG')
  const available = ALPHABET.split('').filter(char => char !== exclude && char !== exclude[0]);
  return shuffleArray(available).slice(0, count);
};

export const PrintPreview: React.FC<PrintPreviewProps> = ({ questions, id }) => {
  
  // Prepare questions with shuffled answers and assigned letters
  const preparedQuestions = useMemo(() => {
    return questions.map((q) => {
      const correctLetter = CORRECT_LETTERS_MAP[q.id] || '?';
      
      // Get 3 unique random letters for the wrong answers
      const wrongLetters = getWrongLetters(correctLetter, 3);
      
      const options = [
        // Correct answer
        { text: q.correctAnswer, letter: correctLetter, isCorrect: true },
        // Wrong answers
        { text: q.wrongAnswers[0], letter: wrongLetters[0], isCorrect: false },
        { text: q.wrongAnswers[1], letter: wrongLetters[1], isCorrect: false },
        { text: q.wrongAnswers[2], letter: wrongLetters[2], isCorrect: false },
      ];

      // Shuffle the positions of the answers
      return {
        ...q,
        shuffledOptions: shuffleArray(options),
      };
    });
  }, [questions]);

  // Clean white background for best printing results
  const containerStyle = {
    backgroundColor: 'white',
    width: '210mm',
    minHeight: '297mm',
    padding: '20mm', // Standard print margins
    boxSizing: 'border-box' as const,
    position: 'relative' as const,
  };

  return (
    <div id={id} className="text-black mx-auto" style={containerStyle}>
      
      {/* Decorative Border around the page content area */}
      <div className="absolute inset-5 border-4 border-double border-black pointer-events-none"></div>

      <div className="h-full flex flex-col justify-between relative z-10">
        <div>
          {/* Header */}
          <div className="text-center mb-8 pb-4 border-b-2 border-black">
            <h1 className="text-4xl font-extrabold mb-2 tracking-wide text-black">מכירים מספיק טוב?</h1>
            <h2 className="text-2xl font-normal text-black">עימדו במעגל וענו על כל השאלות</h2>
          </div>

          {/* Questions Grid */}
          <div className="space-y-6">
            {preparedQuestions.map((q, index) => (
              <div key={q.id} className="break-inside-avoid">
                {/* Question Title */}
                <div className="flex items-center gap-3 mb-3">
                  {/* Number Circle - Moved number up for better visual centering */}
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                     <span className="font-bold text-lg leading-none -translate-y-[2px]">{index + 1}</span>
                  </div>
                  <p className="font-bold text-xl leading-tight text-black">{q.text || '___________________'}</p>
                </div>
                
                {/* Answers Grid */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-3 pr-11">
                  {q.shuffledOptions.map((opt, i) => (
                    <div 
                      key={i} 
                      className="flex items-start justify-between"
                    >
                      {/* Text on the Right - Allowed to wrap, removed truncate */}
                      <span className="text-right font-medium text-lg leading-tight pl-2 flex-grow text-black break-words">
                        {opt.text || '___________'}
                      </span>
                      
                      {/* Letter on the Left */}
                      <span className="font-mono font-bold text-xl text-black shrink-0 w-8 text-center leading-none mt-[2px]">
                        {opt.letter}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center border-t-2 border-black pt-6">
          <h3 className="text-3xl font-extrabold tracking-widest text-black">כעת זהו אותי בגימטריה!</h3>
        </div>
      </div>
    </div>
  );
};