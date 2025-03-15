import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Gift, Sparkle } from "lucide-react";
import type { User } from "@shared/schema";

export default function Dashboard() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  const stats = [
    {
      title: "Points Balance",
      value: user?.points || 0,
      icon: Sparkle,
      color: "text-yellow-600",
    },
    {
      title: "Tasks Completed",
      value: "Coming soon",
      icon: Trophy,
      color: "text-green-600",
    },
    {
      title: "Total Withdrawn",
      value: "Coming soon",
      icon: Gift,
      color: "text-blue-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}
          </h2>
          <p className="text-muted-foreground">
            Here's an overview of your rewards activity
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
