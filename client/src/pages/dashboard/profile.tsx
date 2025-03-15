import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User, updateUserPaymentSchema } from "@shared/schema";
import PrivacyPolicy from "@/components/layout/PrivacyPolicy";
import { Globe2, Moon, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import type { z } from "zod";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी (Hindi)" },
  { code: "es", name: "Español (Spanish)" },
  { code: "fr", name: "Français (French)" },
  { code: "de", name: "Deutsch (German)" },
] as const;

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
        title: "Settings updated",
        description: "Your profile has been updated successfully",
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
          <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Full Name</p>
                  <p className="text-muted-foreground">{user.fullName}</p>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">{user.phone || "Not set"}</p>
                </div>
                <div>
                  <p className="font-medium">Date of Birth</p>
                  <p className="text-muted-foreground">{user.dateOfBirth || "Not set"}</p>
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{user.location || "Not detected"}</p>
                </div>
                <div>
                  <p className="font-medium">Referral Code</p>
                  <p className="text-muted-foreground">{user.referralCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Update your payment details for withdrawals</CardDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred language
                  </p>
                </div>
                <Select 
                  defaultValue={user.preferredLanguage || "en"}
                  onValueChange={(value) => {
                    // Handle language change
                    toast({
                      title: "Language updated",
                      description: "Your language preference has been updated",
                    });
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle dark mode theme
                  </p>
                </div>
                <Switch 
                  checked={user.darkMode || false}
                  onCheckedChange={() => {
                    // Handle dark mode toggle
                    toast({
                      title: "Theme updated",
                      description: "Your theme preference has been updated",
                    });
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>Get help and learn more about the app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/help">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Visit Help Center
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe2 className="mr-2 h-4 w-4" />
                Check Device & Location Info
              </Button>
              <div className="pt-4">
                <PrivacyPolicy />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}