import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPensionPotSchemaClient, type InsertPensionPotClient, type PensionPot } from "@shared/schema";
import { useCreatePension, useUpdatePension } from "@/hooks/use-pensions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface PensionDialogProps {
  pension?: PensionPot;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PensionDialog({ pension, trigger, open: controlledOpen, onOpenChange }: PensionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const createMutation = useCreatePension();
  const updateMutation = useUpdatePension();
  
  const isEditing = !!pension;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<InsertPensionPotClient>({
    resolver: zodResolver(insertPensionPotSchemaClient),
    defaultValues: {
      providerName: "",
      currentValue: 0,
      monthlyContribution: 0,
      annualGrowthRate: 5,
      managementFee: 0.75,
    },
  });

  useEffect(() => {
    if (open && pension) {
      form.reset({
        providerName: pension.providerName,
        currentValue: Number(pension.currentValue),
        monthlyContribution: Number(pension.monthlyContribution),
        annualGrowthRate: Number(pension.annualGrowthRate),
        managementFee: Number(pension.managementFee),
      });
    } else if (open && !pension) {
      form.reset({
        providerName: "",
        currentValue: 0,
        monthlyContribution: 0,
        annualGrowthRate: 5,
        managementFee: 0.75,
      });
    }
  }, [open, pension, form]);

  const onSubmit = async (data: InsertPensionPotClient) => {
    try {
      if (isEditing && pension) {
        await updateMutation.mutateAsync({ id: pension.id, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      // handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && !isControlled && (
        <DialogTrigger asChild>
          <Button className="gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <Plus className="w-4 h-4" /> Add Pension
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-primary">
            {isEditing ? "Edit Pension Pot" : "Add New Pension Pot"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the details of your existing pension pot." 
              : "Enter the details of your pension pot to track its growth."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="providerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Aviva, Vanguard, Nest" {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Value (£)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="h-11 font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyContribution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Contribution (£)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="h-11 font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="annualGrowthRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Growth Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} className="h-11 font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="managementFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Fee (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="h-11 font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-[100px]">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? "Save Changes" : "Add Pension"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
