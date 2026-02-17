import { usePensions } from "@/hooks/use-pensions";
import { useGoals } from "@/hooks/use-goals";
import { calculateProjections } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout-sidebar";
import { PensionDialog } from "@/components/pension-dialog";
import { Link } from "wouter";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { 
  Wallet, 
  TrendingUp, 
  PiggyBank, 
  AlertCircle, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: pensions, isLoading: pensionsLoading } = usePensions();
  const { data: goals, isLoading: goalsLoading } = useGoals();

  const isLoading = pensionsLoading || goalsLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Loading financial data...</p>
        </div>
      </div>
    );
  }

  const { data: projectionData, summary } = calculateProjections(pensions || [], goals);
  const hasPensions = pensions && pensions.length > 0;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 lg:ml-72 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Financial Overview</h1>
              <p className="text-muted-foreground mt-1">Here's how your retirement is looking today.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/planner">
                <Button variant="outline">Update Goals</Button>
              </Link>
              <PensionDialog />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Pot Value</CardTitle>
                  <Wallet className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-display">£{summary.totalPotValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">Across {pensions?.length || 0} pension pots</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Contribution</CardTitle>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-display">£{summary.totalMonthlyContribution.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">Added to your pots each month</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-blue-400">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Projected Total</CardTitle>
                  <PiggyBank className="w-4 h-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-display">£{summary.projectedTotal.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">Estimated value at age {goals?.retirementAge || 65}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className={`hover:shadow-md transition-shadow duration-300 border-l-4 ${summary.shortfall > 0 ? 'border-l-orange-500' : 'border-l-emerald-500'}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
                  {summary.shortfall > 0 ? 
                    <AlertCircle className="w-4 h-4 text-orange-500" /> : 
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  }
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-display">£{Math.round(summary.projectedMonthlyIncome).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {summary.shortfall > 0 
                      ? `£${Math.round(summary.shortfall).toLocaleString()} short of target` 
                      : "On track to meet goal"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-sm border-border/60">
              <CardHeader>
                <CardTitle>Retirement Projection</CardTitle>
                <CardDescription>Estimated growth of your pension pots over time until age {goals?.lifeExpectancy || 85}</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {hasPensions ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="age" 
                        label={{ value: 'Age', position: 'insideBottomRight', offset: -10 }} 
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        tickFormatter={(val) => `£${val/1000}k`}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                        }}
                        formatter={(value: number) => [`£${value.toLocaleString()}`, "Pot Value"]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="totalPotValue" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                      {goals?.retirementAge && (
                        <ReferenceLine x={goals.retirementAge} stroke="hsl(var(--accent))" strokeDasharray="3 3" label="Retirement" />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-muted rounded-lg">
                    <Wallet className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold">No Pension Data</h3>
                    <p className="text-muted-foreground mb-4 max-w-sm">Add your pension pots to see your retirement projection graph.</p>
                    <PensionDialog />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Side Panel / Recommendations */}
            <Card className="shadow-sm border-border/60">
              <CardHeader>
                <CardTitle>Analysis</CardTitle>
                <CardDescription>Based on your current goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target Annual Income</span>
                    <span className="font-semibold">£{Number(goals?.targetAnnualIncome || 25000).toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Projected Income</span>
                    <span className={`font-semibold ${summary.shortfall > 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
                      £{(summary.projectedMonthlyIncome * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${summary.shortfall > 0 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${Math.min(100, (summary.projectedMonthlyIncome * 12 / Number(goals?.targetAnnualIncome || 25000)) * 100)}%` }} 
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    {summary.shortfall > 0 ? <AlertCircle className="w-4 h-4 text-orange-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    Verdict
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {summary.shortfall > 0 
                      ? `You are projected to have a shortfall of £${Math.round(summary.shortfall).toLocaleString()} per month. Consider increasing your contributions or adjusting your retirement age.`
                      : "Great news! You are on track to meet your retirement income goals. Keep up the good work!"}
                  </p>
                </div>

                <Link href="/planner">
                  <Button className="w-full gap-2" variant="secondary">
                    Adjust Goals <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
