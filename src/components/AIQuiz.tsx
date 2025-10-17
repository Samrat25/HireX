import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface AIQuizProps {
  onQuizComplete: (score: number) => void;
}

const quizQuestions = [
  {
    question: "What is the primary role of a university professor?",
    options: ["Research only", "Teaching and Research", "Administration", "Student counseling"],
    correct: 1
  },
  {
    question: "Which research methodology is most suitable for qualitative analysis?",
    options: ["Surveys", "Case Studies", "Experiments", "Meta-analysis"],
    correct: 1
  },
  {
    question: "What is the importance of peer review in academic publishing?",
    options: ["Speed up publication", "Ensure quality and validity", "Reduce costs", "Increase citations"],
    correct: 1
  }
];

export const AIQuiz = ({ onQuizComplete }: AIQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast({
        title: "Please select an answer",
        variant: "destructive",
      });
      return;
    }

    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correct;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      const percentage = Math.round((newScore / quizQuestions.length) * 100);
      setIsComplete(true);
      onQuizComplete(percentage);
      toast({
        title: "Quiz Complete!",
        description: `Your score: ${percentage}%`,
      });
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (isComplete) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    return (
      <Card className="p-6 border-border/50 shadow-soft">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">Quiz Complete!</h3>
          <div className="bg-gradient-card p-6 rounded-lg">
            <p className="text-4xl font-bold text-primary mb-2">{percentage}%</p>
            <p className="text-muted-foreground">
              You scored {score} out of {quizQuestions.length}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-border/50 shadow-soft">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">
            {quizQuestions[currentQuestion].question}
          </h3>
          
          <RadioGroup value={selectedAnswer?.toString()} onValueChange={(val) => setSelectedAnswer(Number(val))}>
            <div className="space-y-3">
              {quizQuestions[currentQuestion].options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted transition-smooth">
                  <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <Button onClick={handleNext} className="w-full" variant="hero">
          {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Submit Quiz'}
        </Button>
      </div>
    </Card>
  );
};
