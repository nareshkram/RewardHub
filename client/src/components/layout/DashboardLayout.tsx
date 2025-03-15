import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Layout, LayoutDashboard, Gift, HelpCircle, LogOut, User } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/dashboard/tasks", icon: Layout },
    { name: "Withdrawals", href: "/dashboard/withdrawals", icon: Gift },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Help", href: "/help", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex h-screen flex-col border-r bg-white">
            <div className="flex h-16 items-center px-4">
              <h1 className="text-xl font-bold">Reward Hub</h1>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">
              <nav className="flex-1 space-y-2 px-2 py-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-2",
                          location === item.href && "bg-gray-100"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
                  onClick={() => window.location.href = "/"}
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          <main className="flex-1 p-4 md:p-8">
            <Card className="p-6">
              {children}
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}