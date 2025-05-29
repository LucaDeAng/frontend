import React, { useEffect, useState } from 'react';
import { getQuizData } from '@/services/quizService';

interface Quiz {
  id: number;
  question: string;
  options: string[];
  answer: number;
}

const mockFetchQuiz = async (): Promise<Quiz[]> => {
  // Simulazione fetch quiz
  return [
    {
      id: 1,
      question: 'Cos\'è il machine learning?',
      options: [
        'Un tipo di intelligenza artificiale',
        'Un linguaggio di programmazione',
        'Un framework per il web',
        'Un database relazionale'
      ],
      answer: 0
    },
    {
      id: 2,
      question: 'Quale modello è noto per la generazione di testo?',
      options: [
        'ResNet',
        'GPT',
        'YOLO',
        'BERT'
      ],
      answer: 1
    }
  ];
};

const AiQuiz: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<{[id:number]: number}>({});
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    getQuizData(mockFetchQuiz).then(data => {
      setQuiz(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="mb-8 text-gray-400">Caricamento quiz...</div>;

  const handleSelect = (qid: number, idx: number) => {
    setSelected(s => ({ ...s, [qid]: idx }));
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  return (
    <div className="mb-8 p-4 bg-black/40 border border-accent/30 rounded-xl">
      <h2 className="text-xl font-bold text-accent mb-4">Quiz AI</h2>
      {quiz.map(q => (
        <div key={q.id} className="mb-4">
          <div className="font-medium text-white mb-2">{q.question}</div>
          <div className="flex flex-col gap-2">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                className={`px-3 py-2 rounded border border-white/10 text-left text-sm ${selected[q.id] === idx ? 'bg-accent/30 text-accent' : 'bg-black/30 text-white hover:bg-accent/10'}`}
                onClick={() => handleSelect(q.id, idx)}
                disabled={showResult}
              >
                {opt}
              </button>
            ))}
          </div>
          {showResult && (
            <div className={`mt-2 text-sm ${selected[q.id] === q.answer ? 'text-blue-400' : 'text-red-400'}`}>
              {selected[q.id] === q.answer ? 'Risposta corretta!' : `Risposta corretta: ${q.options[q.answer]}`}
            </div>
          )}
        </div>
      ))}
      {!showResult && (
        <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-accent text-black rounded font-medium">Verifica Risposte</button>
      )}
    </div>
  );
};

export default AiQuiz; 