import { useState, useEffect } from "react";
import { ArrowRightLeft, Loader2, IndianRupee, DollarSign, Euro } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ExchangeRates {
  usd: number;
  eur: number;
}

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("100");
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRates = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/INR"
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
      }
      
      const data = await response.json();
      
      setRates({
        usd: data.rates.USD,
        eur: data.rates.EUR,
      });
    } catch (err) {
      setError("Unable to fetch exchange rates. Please try again later.");
      setRates(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleConvert = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    setError("");
  };

  const getConvertedAmount = (rate: number) => {
    const numAmount = parseFloat(amount) || 0;
    return (numAmount * rate).toFixed(2);
  };

  return (
    <Card className="border-2 shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-2xl">Currency Converter</CardTitle>
        <CardDescription className="headingCurrency">Convert INR to USD and EUR instantly</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
          <IndianRupee className="h-8 w-8 text-primary flex-shrink-0" />
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Amount in INR</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg font-semibold"
              min="0"
              step="0.01"
            />
          </div>
          <Button onClick={handleConvert} size="icon" className="flex-shrink-0">
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Fetching latest rates...</p>
          </div>
        )}

        {rates && !isLoading && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800 space-y-3">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">US Dollar (USD)</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    ${getConvertedAmount(rates.usd)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Rate: 1 INR = ${rates.usd.toFixed(4)} USD
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-800 space-y-3">
              <div className="flex items-center gap-3">
                <Euro className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Euro (EUR)</p>
                  <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">
                    €{getConvertedAmount(rates.eur)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">
                Rate: 1 INR = €{rates.eur.toFixed(4)} EUR
              </p>
            </div>
          </div>
        )}

        {!isLoading && rates && (
          <Button 
            onClick={fetchRates} 
            variant="outline" 
            className="w-full"
          >
            Refresh Rates
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
