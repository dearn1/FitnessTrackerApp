import { useEffect, useState } from 'react';
import { Activity, Dumbbell, Target, Utensils, Footprints } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { workoutsApi, goalsApi, mealsApi, stepsApi } from '@/lib/apiClient';
import { toast } from 'sonner';

export default function Dashboard() {
  const [stats, setStats] = useState({
    workouts: { total: 0, today: 0 },
    goals: { total: 0, completed: 0 },
    meals: { total: 0, calories: 0 },
    steps: { total: 0, today: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [workoutSummary, goalsSummary, mealsSummary, stepsSummary] = await Promise.all([
          workoutsApi.summary().catch(() => ({ total_workouts: 0, today_workouts: 0 })),
          goalsApi.summary().catch(() => ({ total_goals: 0, completed_goals: 0 })),
          mealsApi.summary().catch(() => ({ total_meals: 0, total_calories: 0 })),
          stepsApi.summary().catch(() => ({ total_steps: 0, today_steps: 0 })),
        ]);

        setStats({
          workouts: { total: workoutSummary.total_workouts || 0, today: workoutSummary.today_workouts || 0 },
          goals: { total: goalsSummary.total_goals || 0, completed: goalsSummary.completed_goals || 0 },
          meals: { total: mealsSummary.total_meals || 0, calories: mealsSummary.total_calories || 0 },
          steps: { total: stepsSummary.total_steps || 0, today: stepsSummary.today_steps || 0 },
        });
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Workouts',
      description: 'Total workouts completed',
      value: stats.workouts.total,
      subValue: `${stats.workouts.today} today`,
      icon: Dumbbell,
      gradient: 'from-primary to-info',
    },
    {
      title: 'Goals',
      description: 'Goals in progress',
      value: stats.goals.total,
      subValue: `${stats.goals.completed} completed`,
      icon: Target,
      gradient: 'from-secondary to-secondary',
    },
    {
      title: 'Nutrition',
      description: 'Total calories tracked',
      value: stats.meals.calories.toLocaleString(),
      subValue: `${stats.meals.total} meals`,
      icon: Utensils,
      gradient: 'from-accent to-warning',
    },
    {
      title: 'Steps',
      description: 'Total steps taken',
      value: stats.steps.total.toLocaleString(),
      subValue: `${stats.steps.today.toLocaleString()} today`,
      icon: Footprints,
      gradient: 'from-info to-primary',
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Track your fitness journey in one place</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className="overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`rounded-lg bg-gradient-to-br ${card.gradient} p-2`}>
                  <card.icon className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.subValue}</p>
              <CardDescription className="mt-2">{card.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Get started with tracking your fitness</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4 hover:border-primary transition-colors cursor-pointer">
            <h3 className="font-semibold mb-1">Log a Workout</h3>
            <p className="text-sm text-muted-foreground">Record your latest exercise session</p>
          </div>
          <div className="rounded-lg border p-4 hover:border-primary transition-colors cursor-pointer">
            <h3 className="font-semibold mb-1">Track a Meal</h3>
            <p className="text-sm text-muted-foreground">Log your nutrition and calories</p>
          </div>
          <div className="rounded-lg border p-4 hover:border-primary transition-colors cursor-pointer">
            <h3 className="font-semibold mb-1">Set a Goal</h3>
            <p className="text-sm text-muted-foreground">Create a new fitness target</p>
          </div>
          <div className="rounded-lg border p-4 hover:border-primary transition-colors cursor-pointer">
            <h3 className="font-semibold mb-1">Log Steps</h3>
            <p className="text-sm text-muted-foreground">Record your daily step count</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
