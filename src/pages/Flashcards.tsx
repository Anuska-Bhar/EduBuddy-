import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Flashcard {
  front: string;
  back: string;
}

const Flashcards = () => {
  const [topic, setTopic] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Topic Required',
        description: 'Please enter a topic for flashcards',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-flashcards', {
        body: { topic }
      });

      if (error) throw error;

      setFlashcards(data.flashcards);
      setStudyMode(true);
      setCurrentCard(0);
      setIsFlipped(false);

      toast({
        title: 'Flashcards Generated!',
        description: `${data.flashcards.length} cards ready for ${topic}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate flashcards. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  if (!studyMode) {
    return (
      <div className="min-h-screen bg-gradient-subtle py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-block p-3 bg-primary rounded-2xl mb-4">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-3">AI Flashcards</h1>
            <p className="text-muted-foreground text-lg">
              Generate and study flashcards on any topic
            </p>
          </div>

          <Card className="gradient-card shadow-medium border-border">
            <CardHeader>
              <CardTitle>Create Flashcards</CardTitle>
              <CardDescription>Enter a topic to generate study flashcards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="e.g., Spanish Vocabulary, Chemistry Formulas..."
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
                    Generating...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5 mr-2" />
                    Generate Flashcards
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">{topic}</h1>
          <p className="text-muted-foreground">
            Card {currentCard + 1} of {flashcards.length}
          </p>
        </div>

        <div 
          className="relative h-96 cursor-pointer perspective-1000 mb-8"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div 
            className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front of card */}
            <Card className={`absolute w-full h-full gradient-card shadow-medium border-border backface-hidden ${isFlipped ? 'hidden' : ''}`}>
              <CardContent className="flex flex-col items-center justify-center h-full p-8">
                <div className="text-sm text-muted-foreground mb-4">QUESTION</div>
                <p className="text-2xl text-center font-medium">{flashcards[currentCard].front}</p>
                <div className="mt-8 text-sm text-muted-foreground">Click to reveal answer</div>
              </CardContent>
            </Card>

            {/* Back of card */}
            <Card className={`absolute w-full h-full gradient-card shadow-medium border-border backface-hidden ${!isFlipped ? 'hidden' : ''}`}>
              <CardContent className="flex flex-col items-center justify-center h-full p-8">
                <div className="text-sm text-muted-foreground mb-4">ANSWER</div>
                <p className="text-2xl text-center font-medium">{flashcards[currentCard].back}</p>
                <div className="mt-8 text-sm text-muted-foreground">Click to see question</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={handlePrevious}
            disabled={currentCard === 0}
            variant="outline"
            size="lg"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentCard === flashcards.length - 1}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Button
            onClick={() => { setStudyMode(false); setTopic(''); }}
            variant="ghost"
          >
            Create New Flashcards
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
