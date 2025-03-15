import { Task } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Play, Award, PenSquare } from "lucide-react";
import { antiCheat } from "@/lib/anti-cheat";

interface TaskCardProps {
  task: Task;
  userId: number;
  currency: {
    code: string;
    symbol: string;
    rate: number;
  };
}

export default function TaskCard({ task, userId, currency }: TaskCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: async () => {
      // Validate task completion
      const metrics = {
        taskCompletionSpeed: 5, // Example: 5 seconds
        mouseMovements: true,
        keyboardEvents: true,
        timeSpent: 10,
      };

      if (!antiCheat.validateTaskCompletion(metrics)) {
        throw new Error("Task completion validation failed");
      }

      if (!antiCheat.validateEarningPattern(userId, task.points)) {
        throw new Error("Daily earning limit exceeded");
      }

      const res = await apiRequest("POST", `/api/tasks/${task.id}/complete`, { userId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task completed!",
        description: `You earned ${currency.symbol}${(task.points * 0.01 * currency.rate).toFixed(2)}`,
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

  const getTaskIcon = () => {
    switch (task.type) {
      case "ad":
        return <Play className="h-5 w-5" />;
      case "survey":
        return <PenSquare className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  const getTaskColor = () => {
    switch (task.type) {
      case "ad":
        return "bg-blue-50 text-blue-700";
      case "survey":
        return "bg-green-50 text-green-700";
      default:
        return "bg-purple-50 text-purple-700";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${getTaskColor()}`}>
              {getTaskIcon()}
            </div>
            <CardTitle>{task.title}</CardTitle>
          </div>
          <div className="text-lg font-bold text-primary">
            {currency.symbol}{(task.points * 0.01 * currency.rate).toFixed(2)}
          </div>
        </div>
        <CardDescription className="mt-2">{task.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full"
          onClick={() => completeMutation.mutate()}
          disabled={completeMutation.isPending}
        >
          {completeMutation.isPending ? "Completing..." : "Complete Task"}
        </Button>
      </CardContent>
    </Card>
  );
}