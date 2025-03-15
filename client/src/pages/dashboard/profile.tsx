import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User, updateUserPaymentSchema } from "@shared/schema";
import type { z } from "zod";

export default function Profile() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof updateUserPaymentSchema>>({
    resolver: zodResolver(updateUserPaymentSchema),
    defaultValues: {
      upiId: user?.upiId || "",
      bankAccount: user?.bankAccount || "",
      ifscCode: user?.ifscCode || "",
    },
  });

  const updatePaymentInfoMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateUserPaymentSchema>) => {
      if (!user) throw new Error("User not found");
      const res = await apiRequest("PATCH", `/api/users/${user.id}/payment-info`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      toast({
        title: "Payment information updated",
        description: "Your payment details have been saved successfully",
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

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payment Information</h2>
          <p className="text-muted-foreground">
            Add your payment details for withdrawals
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Update Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit((data) => updatePaymentInfoMutation.mutate(data))} 
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="upiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UPI ID</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter your UPI ID (e.g., name@upi)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Account Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter your bank account number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ifscCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IFSC Code</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter your bank's IFSC code"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={updatePaymentInfoMutation.isPending}
                >
                  {updatePaymentInfoMutation.isPending ? "Updating..." : "Update Payment Information"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
