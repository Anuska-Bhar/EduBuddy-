import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, Loader2, Trophy, RefreshCw } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const Quiz = () => {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Topic Required',
        description: 'Please enter a topic for the quiz',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: { topic }
      });

      if (error) throw error;

      setQuestions(data.questions);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setSelectedAnswer(null);

      toast({
        title: 'Quiz Generated!',
        description: `5 questions ready on ${topic}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate quiz. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      // Save quiz result
      const quizResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
      quizResults.push({ topic, score: score + (selectedAnswer === questions[currentQuestion].correct ? 1 : 0), total: questions.length, date: new Date().toISOString() });
      localStorage.setItem('quizResults', JSON.stringify(quizResults));
    }
  };

  const handleRetry = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setTopic('');
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-subtle py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-block p-3 bg-primary rounded-2xl mb-4">
              <ClipboardList className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-3">AI Quiz Generator</h1>
            <p className="text-muted-foreground text-lg">
              Test your knowledge with AI-generated quizzes
            </p>
          </div>

          <Card className="gradient-card shadow-medium border-border">
            <CardHeader>
              <CardTitle>Create Your Quiz</CardTitle>
              <CardDescription>Enter a topic to generate 5 multiple choice questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="e.g., World History, Biology, Programming..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                className="text-lg"
              />
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !topic.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <ClipboardList className="w-5 h-5 mr-2" />
                    Generate Quiz
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-subtle py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="gradient-card shadow-medium border-border animate-fade-in">
            <CardHeader className="text-center">
              <div className="inline-block p-4 bg-primary rounded-2xl mb-4 mx-auto">
                <Trophy className="w-12 h-12 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
              <CardDescription className="text-lg">Here's how you did on {topic}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {score}/{questions.length}
                </div>
                <div className="text-xl text-muted-foreground">
                  {percentage}% Correct
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={handleRetry} size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Another Quiz
                </Button>
                <Button onClick={() => window.location.href = '/progress'} size="lg" variant="outline" className="w-full">
                  <Trophy className="w-5 h-5 mr-2" />
                  View Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="gradient-card shadow-medium border-border">
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-sm font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full">
                Score: {score}
              </span>
            </div>
            <CardTitle className="text-2xl">{questions[currentQuestion].question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={selectedAnswer?.toString()} onValueChange={(v) => setSelectedAnswer(parseInt(v))}>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent transition-smooth">
                    <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                    <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer text-base">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
