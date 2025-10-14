import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Trophy, BookOpen, Target } from 'lucide-react';

interface QuizResult {
  topic: string;
  score: number;
  total: number;
  date: string;
}

const Progress = () => {
  const [topicsLearned, setTopicsLearned] = useState<string[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const topics = JSON.parse(localStorage.getItem('topicsLearned') || '[]');
    const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
    setTopicsLearned(topics);
    setQuizResults(results);
  }, []);

  const totalQuizzes = quizResults.length;
  const averageScore = quizResults.length > 0
    ? Math.round((quizResults.reduce((acc, r) => acc + (r.score / r.total * 100), 0) / quizResults.length))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-3 bg-primary rounded-2xl mb-4">
            <BarChart3 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Your Learning Progress</h1>
          <p className="text-muted-foreground text-lg">
            Track your achievements and growth
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="gradient-card shadow-soft border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{topicsLearned.length}</div>
                  <div className="text-sm text-muted-foreground">Topics Learned</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-soft border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500 rounded-xl">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{totalQuizzes}</div>
                  <div className="text-sm text-muted-foreground">Quizzes Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-soft border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{averageScore}%</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Topics Learned */}
          <Card className="gradient-card shadow-medium border-border">
            <CardHeader>
              <CardTitle>Topics Explored</CardTitle>
              <CardDescription>Subjects you've learned about</CardDescription>
            </CardHeader>
            <CardContent>
              {topicsLearned.length > 0 ? (
                <div className="space-y-2">
                  {topicsLearned.map((topic, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-secondary rounded-lg flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-medium">
                        {idx + 1}
                      </div>
                      <span className="font-medium">{topic}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Start exploring topics to see them here!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quiz Results */}
          <Card className="gradient-card shadow-medium border-border">
            <CardHeader>
              <CardTitle>Quiz History</CardTitle>
              <CardDescription>Your recent quiz performances</CardDescription>
            </CardHeader>
            <CardContent>
              {quizResults.length > 0 ? (
                <div className="space-y-3">
                  {quizResults.slice(-10).reverse().map((result, idx) => {
                    const percentage = Math.round((result.score / result.total) * 100);
                    return (
                      <div
                        key={idx}
                        className="p-4 bg-secondary rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{result.topic}</span>
                          <span className={`text-sm font-semibold px-2 py-1 rounded ${
                            percentage >= 80 ? 'bg-green-500 text-white' :
                            percentage >= 60 ? 'bg-yellow-500 text-white' :
                            'bg-red-500 text-white'
                          }`}>
                            {percentage}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Score: {result.score}/{result.total}</span>
                          <span>{new Date(result.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Complete quizzes to see your scores here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Progress;
