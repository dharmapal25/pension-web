import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertRetirementGoalClient } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useGoals() {
  return useQuery({
    queryKey: [api.goals.get.path],
    queryFn: async () => {
      const res = await fetch(api.goals.get.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch goals");
      }
      return api.goals.get.responses[200].parse(await res.json());
    },
  });
}

export function useUpsertGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertRetirementGoalClient) => {
      const validated = api.goals.upsert.input.parse(data);
      const res = await fetch(api.goals.upsert.path, {
        method: api.goals.upsert.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save goals");
      }
      return api.goals.upsert.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.goals.get.path] });
      toast({
        title: "Success",
        description: "Retirement goals updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
