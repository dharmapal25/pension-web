import { usePensions, useDeletePension } from "@/hooks/use-pensions";
import { Sidebar } from "@/components/layout-sidebar";
import { PensionDialog } from "@/components/pension-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Wallet, Plus } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function PensionsPage() {
  const { data: pensions, isLoading } = usePensions();
  const deleteMutation = useDeletePension();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-72 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">My Pensions</h1>
              <p className="text-muted-foreground mt-1">Manage your pension pots and contributions.</p>
            </div>
            <PensionDialog />
          </div>

          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle>Pension Pots</CardTitle>
              <CardDescription>All your registered pension funds.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : !pensions || pensions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-muted rounded-lg bg-muted/10">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Wallet className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Pensions Added Yet</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Add your first pension pot to start tracking your retirement savings and projecting your future income.
                  </p>
                  <PensionDialog 
                    trigger={
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" /> Add Your First Pension
                      </Button>
                    } 
                  />
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-[200px]">Provider</TableHead>
                        <TableHead>Current Value</TableHead>
                        <TableHead>Monthly Cont.</TableHead>
                        <TableHead>Growth Rate</TableHead>
                        <TableHead>Fees</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pensions.map((pot, index) => (
                        <TableRow key={pot.id} className="group">
                          <TableCell className="font-medium">{pot.providerName}</TableCell>
                          <TableCell className="font-mono">£{Number(pot.currentValue).toLocaleString()}</TableCell>
                          <TableCell className="font-mono text-green-600">+£{Number(pot.monthlyContribution).toLocaleString()}</TableCell>
                          <TableCell>{pot.annualGrowthRate}%</TableCell>
                          <TableCell className="text-muted-foreground">{pot.managementFee}%</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <PensionDialog 
                                pension={pot} 
                                trigger={
                                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                    <Pencil className="w-4 h-4 text-primary" />
                                  </Button>
                                }
                              />
                              
                              <AlertDialog open={deleteId === pot.id} onOpenChange={(open) => setDeleteId(open ? pot.id : null)}>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10">
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Pension Pot?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this pension pot from <strong>{pot.providerName}</strong>? 
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="bg-destructive hover:bg-destructive/90"
                                      onClick={() => {
                                        deleteMutation.mutate(pot.id);
                                        setDeleteId(null);
                                      }}
                                    >
                                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
