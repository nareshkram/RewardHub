import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TaskCard from "@/components/layout/TaskCard";
import { Task, User } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Tasks() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const taskTypes = ["all", "ad", "survey", "game"] as const;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Available Tasks</h2>
          <p className="text-muted-foreground">
            Complete tasks to earn points
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks
                  .filter((task) => type === "all" || task.type === type)
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      userId={user?.id || 0}
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
