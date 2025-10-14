import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, Loader2, Download } from 'lucide-react';

const Summary = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast({
        title: 'Text Required',
        description: 'Please enter some text to summarize',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('summarize-text', {
        body: { text }
      });

      if (error) throw error;

      setSummary(data.summary);

      toast({
        title: 'Summary Generated!',
        description: 'Your text has been summarized',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded!',
      description: 'Summary saved to your device',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-3 bg-primary rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-3">AI Text Summarizer</h1>
          <p className="text-muted-foreground text-lg">
            Condense long texts into concise summaries
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="gradient-card shadow-medium border-border">
            <CardHeader>
              <CardTitle>Input Text</CardTitle>
              <CardDescription>Paste the text you want to summarize</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your text here... (articles, notes, documents, etc.)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[400px] text-base"
              />
              <Button
                onClick={handleSummarize}
                disabled={isLoading || !text.trim()}
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    Generate Summary
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-medium border-border">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>AI-generated summary of your text</CardDescription>
            </CardHeader>
            <CardContent>
              {summary ? (
                <>
                  <div className="min-h-[400px] p-4 bg-secondary rounded-lg whitespace-pre-wrap text-base">
                    {summary}
                  </div>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full mt-4"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Summary
                  </Button>
                </>
              ) : (
                <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">Your summary will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Summary;
