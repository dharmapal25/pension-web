import { useGoals, useUpsertGoal } from "@/hooks/use-goals";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRetirementGoalSchemaClient, type InsertRetirementGoalClient } from "@shared/schema";
import { Sidebar } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Target } from "lucide-react";
import { useEffect } from "react";

export default function PlannerPage() {
  const { data: goals, isLoading } = useGoals();
  const upsertMutation = useUpsertGoal();

  const form = useForm<InsertRetirementGoalClient>({
    resolver: zodResolver(insertRetirementGoalSchemaClient),
    defaultValues: {
      currentAge: 30,
      retirementAge: 65,
      targetAnnualIncome: 25000,
      lifeExpectancy: 85,
      includeStatePension: true,
    },
  });

  useEffect(() => {
    if (goals) {
      form.reset({
        currentAge: goals.currentAge,
        retirementAge: goals.retirementAge,
        targetAnnualIncome: Number(goals.targetAnnualIncome),
        lifeExpectancy: goals.lifeExpectancy,
        includeStatePension: goals.includeStatePension ?? true,
      });
    }
  }, [goals, form]);

  const onSubmit = (data: InsertRetirementGoalClient) => {
    upsertMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-background items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-72 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Retirement Planner</h1>
            <p className="text-muted-foreground mt-1">Set your goals and assumptions for the future.</p>
          </div>

          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2.5 rounded-lg">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>My Retirement Goals</CardTitle>
                  <CardDescription>Adjust these variables to see how they impact your projections on the dashboard.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="currentAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Age</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="h-12 text-lg" />
                            </FormControl>
                            <FormDescription>Your age today.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="retirementAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Retirement Age</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="h-12 text-lg" />
                            </FormControl>
                            <FormDescription>When you plan to stop working.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="lifeExpectancy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Life Expectancy Assumption</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="h-12 text-lg" />
                            </FormControl>
                            <FormDescription>Used to calculate drawdown duration.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetAnnualIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Annual Income (£)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} className="h-12 text-lg font-mono" />
                            </FormControl>
                            <FormDescription>How much you want per year in retirement.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <FormField
                      control={form.control}
                      name="includeStatePension"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg p-2">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Include State Pension?</FormLabel>
                            <FormDescription>
                              Adds approx £11,500/yr from age 67.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" className="w-full md:w-auto gap-2" disabled={upsertMutation.isPending}>
                      {upsertMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Goals
                    </Button>
                  </div>

                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
