import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Brain, Trophy, BookOpen, Target, TrendingUp, Calendar, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface QuizResult {
  topic: string;
  score: number;
  total: number;
  date: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [topicsLearned, setTopicsLearned] = useState<string[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);

  useEffect(() => {
    const topics = JSON.parse(localStorage.getItem('topicsLearned') || '[]');
    const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
    setTopicsLearned(topics);
    setQuizResults(results);
    fetchMotivationalQuote();
  }, []);

  const fetchMotivationalQuote = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('motivational-quote');
      if (error) throw error;
      setMotivationalQuote(data.quote);
    } catch (error) {
      console.error('Error fetching quote:', error);
      setMotivationalQuote('Every expert was once a beginner. Keep learning, keep growing! 🌱');
    } finally {
      setIsLoadingQuote(false);
    }
  };

  const totalQuizzes = quizResults.length;
  const averageScore = quizResults.length > 0
    ? Math.round((quizResults.reduce((acc, r) => acc + (r.score / r.total * 100), 0) / quizResults.length))
    : 0;

  const chartData = quizResults.slice(-5).map(r => ({
    name: r.topic.slice(0, 15) + (r.topic.length > 15 ? '...' : ''),
    score: Math.round((r.score / r.total) * 100)
  }));

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-vibrant bg-clip-text text-transparent">
            Your Learning Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your progress and keep learning!
          </p>
        </div>

        {/* Motivational Quote */}
        <Card className="mb-8 gradient-card shadow-glow border-2 border-primary/20 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-vibrant rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Quote of the Day</h3>
                <p className="text-muted-foreground italic">
                  {isLoadingQuote ? 'Loading...' : motivationalQuote}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="gradient-card shadow-soft border-border hover-scale transition-bounce">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-xl">
                  <BookOpen className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold">{topicsLearned.length}</div>
                  <div className="text-sm text-muted-foreground">Topics Learned</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-soft border-border hover-scale transition-bounce">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary rounded-xl">
                  <Target className="w-8 h-8 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold">{totalQuizzes}</div>
                  <div className="text-sm text-muted-foreground">Quizzes Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-soft border-border hover-scale transition-bounce">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-vibrant rounded-xl">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold">{averageScore}%</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                  <Progress value={averageScore} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quiz Performance Chart */}
          <Card className="gradient-card shadow-medium border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Recent Quiz Performance
              </CardTitle>
              <CardDescription>Your last 5 quiz scores</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.score >= 80 ? 'hsl(var(--primary))' : entry.score >= 60 ? 'hsl(var(--secondary))' : 'hsl(var(--accent))'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Complete quizzes to see your performance!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="gradient-card shadow-medium border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              {topicsLearned.length > 0 || quizResults.length > 0 ? (
                <div className="space-y-3">
                  {topicsLearned.slice(-5).reverse().map((topic, idx) => (
                    <div key={idx} className="p-3 bg-secondary/20 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">{topic}</p>
                          <p className="text-sm text-muted-foreground">Topic explored</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {quizResults.slice(-3).reverse().map((result, idx) => (
                    <div key={idx} className="p-3 bg-secondary/20 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-secondary" />
                        <div className="flex-1">
                          <p className="font-medium">{result.topic}</p>
                          <p className="text-sm text-muted-foreground">
                            Quiz: {result.score}/{result.total} ({Math.round((result.score / result.total) * 100)}%)
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Start learning to see your activity here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card 
            className="gradient-card shadow-medium border-2 border-primary/20 hover-scale transition-bounce cursor-pointer"
            onClick={() => navigate('/explain')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-primary to-primary-glow rounded-2xl shadow-soft">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Start Learning</h3>
                  <p className="text-sm text-muted-foreground">Get AI explanations on any topic</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="gradient-card shadow-medium border-2 border-secondary/20 hover-scale transition-bounce cursor-pointer"
            onClick={() => navigate('/chat')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-secondary to-accent rounded-2xl shadow-soft">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Chat with EduBuddy</h3>
                  <p className="text-sm text-muted-foreground">Ask questions and get instant help</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
