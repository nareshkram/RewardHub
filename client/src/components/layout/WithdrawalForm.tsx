import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertWithdrawalSchema } from "@shared/schema";

interface WithdrawalFormProps {
  userId: number;
  userPoints: number;
}

export default function WithdrawalForm({ userId, userPoints }: WithdrawalFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertWithdrawalSchema),
    defaultValues: {
      userId,
      amount: 0,
      method: "upi",
      status: "pending"
    }
  });

  const withdrawalMutation = useMutation({
    mutationFn: async (data: typeof form.getValues) => {
      const res = await apiRequest("POST", "/api/withdrawals", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/withdrawals/${userId}`] });
      toast({
        title: "Withdrawal requested",
        description: "Your withdrawal request has been submitted",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => withdrawalMutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (Points)</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number" 
                  min={50} 
                  max={Math.min(500, userPoints)}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Withdrawal Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select withdrawal method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="upi">UPI (₹5 fee)</SelectItem>
                  <SelectItem value="bank">Bank Transfer (₹20 fee)</SelectItem>
                  <SelectItem value="paypal">PayPal (₹10 + provider fee)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={withdrawalMutation.isPending || userPoints < 50}
        >
          {withdrawalMutation.isPending ? "Processing..." : "Request Withdrawal"}
        </Button>
      </form>
    </Form>
  );
}
