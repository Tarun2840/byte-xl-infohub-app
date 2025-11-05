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
      const response = await fetch("https://api.quotable.io/random?tags=inspirational");
      
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }
      
      const data = await response.json();
      
      setQuote({
        content: data.content,
        author: data.author,
      });
    } catch (err) {
      setError("Unable to fetch quote. Please try again.");
      setQuote(null);
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
