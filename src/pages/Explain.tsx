import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Loader2 } from 'lucide-react';

const Explain = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'advanced'>('medium');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleExplain = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Topic Required',
        description: 'Please enter a topic to explain',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setExplanation('');

    try {
      const { data, error } = await supabase.functions.invoke('ai-explain', {
        body: { topic, difficulty }
      });

      if (error) throw error;

      setExplanation(data.explanation);
      
      // Save to localStorage for progress tracking
      const learned = JSON.parse(localStorage.getItem('topicsLearned') || '[]');
      if (!learned.includes(topic)) {
        learned.push(topic);
        localStorage.setItem('topicsLearned', JSON.stringify(learned));
      }

      toast({
        title: 'Explanation Generated!',
        description: `${topic} explained at ${difficulty} level`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate explanation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-3 bg-primary rounded-2xl mb-4">
            <Lightbulb className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-3">AI Explanations</h1>
          <p className="text-muted-foreground text-lg">
            Learn any topic at your preferred difficulty level
          </p>
        </div>

        <Card className="gradient-card shadow-medium border-border mb-6">
          <CardHeader>
            <CardTitle>What would you like to learn?</CardTitle>
            <CardDescription>Enter a topic and choose your difficulty level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="e.g., Quantum Physics, Machine Learning, Photosynthesis..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleExplain()}
              className="text-lg"
            />

            <Tabs value={difficulty} onValueChange={(v) => setDifficulty(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="easy">Easy 🌱</TabsTrigger>
                <TabsTrigger value="medium">Medium 🌿</TabsTrigger>
                <TabsTrigger value="advanced">Advanced 🌳</TabsTrigger>
              </TabsList>
              <TabsContent value="easy" className="text-sm text-muted-foreground mt-4">
                Simple explanations with everyday examples. Perfect for beginners!
              </TabsContent>
              <TabsContent value="medium" className="text-sm text-muted-foreground mt-4">
                Balanced detail with clear examples. Good for building knowledge.
              </TabsContent>
              <TabsContent value="advanced" className="text-sm text-muted-foreground mt-4">
                In-depth technical explanations. For those with background knowledge.
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleExplain}
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
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Explain This Topic
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {explanation && (
          <Card className="gradient-card shadow-soft border-border animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
                {topic}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-blue max-w-none">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {explanation}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Explain;
