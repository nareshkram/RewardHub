import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WithdrawalForm from "@/components/layout/WithdrawalForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Withdrawal } from "@shared/schema";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function Withdrawals() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users/me"],
  });

  const { data: withdrawals = [] } = useQuery<Withdrawal[]>({
    queryKey: [`/api/withdrawals/${user?.id}`],
    enabled: !!user?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Withdraw Points</h2>
          <p className="text-muted-foreground">
            Convert your points to real money
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Request Withdrawal</CardTitle>
            </CardHeader>
            <CardContent>
              {user && (
                <WithdrawalForm 
                  userId={user.id} 
                  userPoints={user.points} 
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {withdrawals.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No withdrawal history yet
                  </p>
                ) : (
                  withdrawals.map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="flex items-center justify-between border-b py-2"
                    >
                      <div>
                        <p className="font-medium">
                          {withdrawal.amount} points
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(withdrawal.createdAt),
                            "MMM d, yyyy"
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={getStatusColor(withdrawal.status)}
                        >
                          {withdrawal.status}
                        </Badge>
                        <Badge variant="outline">
                          {withdrawal.method}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
