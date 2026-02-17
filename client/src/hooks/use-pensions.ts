import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertPensionPotClient } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function usePensions() {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: [api.pensions.list.path],
    queryFn: async () => {
      const res = await fetch(api.pensions.list.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch pensions");
      }
      return api.pensions.list.responses[200].parse(await res.json());
    },
  });
}

export function usePension(id: number) {
  return useQuery({
    queryKey: [api.pensions.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.pensions.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch pension");
      return api.pensions.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreatePension() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertPensionPotClient) => {
      const validated = api.pensions.create.input.parse(data);
      const res = await fetch(api.pensions.create.path, {
        method: api.pensions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create pension");
      }
      return api.pensions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.pensions.list.path] });
      toast({
        title: "Success",
        description: "Pension pot added successfully",
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

export function useUpdatePension() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertPensionPotClient>) => {
      const url = buildUrl(api.pensions.update.path, { id });
      const res = await fetch(url, {
        method: api.pensions.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to update pension");
      }
      return api.pensions.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.pensions.list.path] });
      toast({
        title: "Success",
        description: "Pension pot updated",
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

export function useDeletePension() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.pensions.delete.path, { id });
      const res = await fetch(url, {
        method: api.pensions.delete.method,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete pension");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.pensions.list.path] });
      toast({
        title: "Success",
        description: "Pension pot deleted",
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
