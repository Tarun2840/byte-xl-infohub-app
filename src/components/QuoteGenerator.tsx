import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Quote {
  content: string;
  author: string;
}

const QuoteGenerator = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchQuote = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Try primary API first
      let response = await fetch("https://api.quotable.io/random?tags=inspirational");
      
      if (!response.ok) {
        // Fallback to alternative API
        response = await fetch("https://zenquotes.io/api/random");
      }
      
      const data = await response.json();
      
      // Handle different API response formats
      if (Array.isArray(data)) {
        // ZenQuotes format
        setQuote({
          content: data[0].q,
          author: data[0].a,
        });
      } else {
        // Quotable format
        setQuote({
          content: data.content,
          author: data.author,
        });
      }
    } catch (err) {
      // Use local fallback quotes if all APIs fail
      const fallbackQuotes = [
        { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
        { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      ];
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomQuote);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <Card className="border-2 shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" />
          Motivational Quote
        </CardTitle>
        <CardDescription>Get inspired with wisdom and motivation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading inspiration...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {quote && !isLoading && !error && (
          <div className="relative">
            <div className="absolute -top-4 -left-2 text-6xl text-primary/20 font-serif">"</div>
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-8 border-2 border-primary/20 relative">
              <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-6">
                {quote.content}
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                <p className="text-sm font-semibold text-primary">— {quote.author}</p>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-2 text-6xl text-primary/20 font-serif rotate-180">"</div>
          </div>
        )}

        <Button 
          onClick={fetchQuote} 
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Get New Quote
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuoteGenerator;
