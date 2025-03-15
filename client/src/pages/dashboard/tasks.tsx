import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TaskCard from "@/components/layout/TaskCard";
import { Task, User } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currencyService } from "@/lib/currency";
import { useState, useEffect } from "react";

export default function Tasks() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const [currency, setCurrency] = useState({ code: 'USD', symbol: '$', rate: 1 });

  useEffect(() => {
    currencyService.detectUserCurrency().then(setCurrency);
  }, []);

  const taskTypes = ["all", "ad", "survey", "game"] as const;

  const taskTypeDescriptions = {
    all: "Complete various tasks to earn rewards",
    ad: "Watch promotional content and earn instantly",
    survey: "Share your opinion and get rewarded",
    game: "Play exciting games to earn points"
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Available Tasks</h2>
          <p className="text-muted-foreground">
            Complete tasks to earn points and rewards
          </p>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            {taskTypes.map((type) => (
              <TabsTrigger key={type} value={type} className="capitalize">
                {type}
              </TabsTrigger>
            ))}
          </TabsList>

          {taskTypes.map((type) => (
            <TabsContent key={type} value={type}>
              <p className="text-muted-foreground mb-4">
                {taskTypeDescriptions[type]}
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks
                  .filter((task) => type === "all" || task.type === type)
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      userId={user?.id || 0}
                      currency={currency}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}