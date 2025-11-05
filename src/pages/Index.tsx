import { useState } from "react";
import { Cloud, TrendingUp, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeatherModule from "@/components/WeatherModule";
import CurrencyConverter from "@/components/CurrencyConverter";
import QuoteGenerator from "@/components/QuoteGenerator";

const Index = () => {
  const [activeTab, setActiveTab] = useState("weather");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-primary/5 to-accent/5 sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-2xl font-bold text-white">IH</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                InfoHub
              </h1>
              <p className="text-sm text-muted-foreground">Your daily utilities dashboard</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
            <TabsTrigger 
              value="weather" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white py-3"
            >
              <Cloud className="h-4 w-4" />
              <span className="hidden sm:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger 
              value="currency" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white py-3"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Currency</span>
            </TabsTrigger>
            <TabsTrigger 
              value="quotes" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white py-3"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Quotes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weather" className="space-y-4 animate-in fade-in-50 duration-300">
            <WeatherModule />
          </TabsContent>

          <TabsContent value="currency" className="space-y-4 animate-in fade-in-50 duration-300">
            <CurrencyConverter />
          </TabsContent>

          <TabsContent value="quotes" className="space-y-4 animate-in fade-in-50 duration-300">
            <QuoteGenerator />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-6 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built for ByteXL Coding Challenge • InfoHub Dashboard</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
