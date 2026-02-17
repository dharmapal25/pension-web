import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold font-display tracking-tight">PensionPal</span>
          </div>
          <div className="flex gap-4">
            <a href="/api/login">
              <Button>Login / Sign Up</Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-bold font-display tracking-tight text-foreground"
            >
              Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Retirement</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              Visualize your future wealth, track pension pots across providers, and ensure you're on track for the retirement you deserve.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="pt-4 flex justify-center gap-4"
            >
              <a href="/api/login">
                <Button size="lg" className="h-12 px-8 text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all">
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto text-primary">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display">Smart Projections</h3>
                <p className="text-muted-foreground">
                  Advanced compound interest calculators visualize your pot growth and projected monthly income.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display">Secure Tracking</h3>
                <p className="text-muted-foreground">
                  Keep tabs on multiple pension providers in one secure dashboard. Never lose track of a pot again.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto text-purple-600">
                  <PieChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display">Goal Setting</h3>
                <p className="text-muted-foreground">
                  Set retirement targets and get instant feedback on whether you're on track to meet them.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} PensionPal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
