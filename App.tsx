import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, FileText, Info } from 'lucide-react';
import { QuestionInput } from './components/QuestionInput';
import { PrintPreview } from './components/PrintPreview';
import { Question } from './types';

// Initialize 10 empty questions
const initialQuestions: Question[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  text: '',
  correctAnswer: '',
  wrongAnswers: ['', '', ''],
}));

export default function App() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (id: number, field: string, value: string, index?: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;

        if (field === 'text') {
          return { ...q, text: value };
        } else if (field === 'correctAnswer') {
          return { ...q, correctAnswer: value };
        } else if (field === 'wrongAnswer' && typeof index === 'number') {
          const newWrong = [...q.wrongAnswers];
          newWrong[index as number] = value;
          return { ...q, wrongAnswers: newWrong as [string, string, string] };
        }
        return q;
      })
    );
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    // Short timeout to allow UI to render the print preview properly before capturing
    setTimeout(async () => {
      const input = document.getElementById('print-area');
      if (input) {
        try {
          // Temporarily ensure the element is visible for capture if needed, though off-screen works best
          const canvas = await html2canvas(input, {
            scale: 2, // High resolution
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
          });
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          
          // Calculate height to fit width
          const finalHeight = (imgHeight * pdfWidth) / imgWidth;
          
          // If content is taller than page, we scale it to fit
          if (finalHeight > pdfHeight) {
             const scaleFactor = pdfHeight / finalHeight;
             const scaledWidth = pdfWidth * scaleFactor;
             const scaledHeight = finalHeight * scaleFactor;
             const marginX = (pdfWidth - scaledWidth) / 2;
             pdf.addImage(imgData, 'PNG', marginX, 0, scaledWidth, scaledHeight);
          } else {
             pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalHeight);
          }

          pdf.save('quiz-gematria.pdf');
        } catch (error) {
          console.error("Error generating PDF", error);
          alert("אירעה שגיאה ביצירת ה-PDF. נסה שנית.");
        } finally {
          setIsGenerating(false);
        }
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">מחולל שאלון גימטריה</h1>
            <p className="text-sm text-gray-500 hidden sm:block">הזן 10 שאלות, הורד PDF להדפסה</p>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white shadow-md transition-all
              ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
          >
            {isGenerating ? (
              <span>מייצר...</span>
            ) : (
              <>
                <Download size={20} />
                <span>הורד PDF</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Instructions */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-md flex items-start gap-3">
          <Info className="text-blue-500 mt-1 shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-bold mb-1">הוראות שימוש:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>עבור כל שאלה, הזן את תוכן השאלה.</li>
              <li>בשדה הירוק: הזן את התשובה <strong>הנכונה</strong>.</li>
              <li>בשדות האדומים: הזן את שלוש התשובות <strong>השגויות</strong>.</li>
              <li>בסיום, לחץ על "הורד PDF" ואת הקובץ שתקבל העבר בוואטסאפ לדרור ססובר או אוהד שגב.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        {questions.map((q) => (
          <QuestionInput
            key={q.id}
            questionNumber={q.id}
            data={q}
            onChange={handleInputChange}
          />
        ))}

        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">סיימת למלא את כל השאלות?</p>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
          >
            <FileText size={20} />
            צור שאלון סופי
          </button>
        </div>
      </main>

      {/* Hidden Print Area (Visible to html2canvas only) */}
      {/* Changed: Position absolute off-screen instead of opacity-0 to ensure html2canvas captures it correctly */}
      <div className="absolute top-0 left-[-10000px] -z-50">
        <div style={{ width: '210mm', minHeight: '297mm' }}>
            <PrintPreview id="print-area" questions={questions} />
        </div>
      </div>
    </div>
  );
}