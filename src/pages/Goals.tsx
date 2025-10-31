import { useEffect, useState } from 'react';
import { Plus, Target, Trash2, TrendingUp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { goalsApi, Goal } from '@/lib/apiClient';
import { goalSchema } from '@/lib/api';
import { toast } from 'sonner';

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      goal_type: '',
      title: '',
      target_value: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
    },
  });

  const fetchGoals = async () => {
    try {
      const data = await goalsApi.list();
      setGoals(data);
    } catch (error) {
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await goalsApi.create(data);
      toast.success('Goal created successfully!');
      setDialogOpen(false);
      form.reset();
      fetchGoals();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create goal');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await goalsApi.delete(id);
      toast.success('Goal deleted');
      fetchGoals();
    } catch (error) {
      toast.error('Failed to delete goal');
    }
  };

  const handleUpdateProgress = async (id: number) => {
    const increment = prompt('Enter progress increment:');
    if (increment && !isNaN(Number(increment))) {
      try {
        await goalsApi.updateProgress(id, Number(increment));
        toast.success('Progress updated!');
        fetchGoals();
      } catch (error) {
        toast.error('Failed to update progress');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground">Track your fitness objectives</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>Set a new fitness target to achieve</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...form.register('title')} />
                {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal_type">Type</Label>
                <Input id="goal_type" placeholder="running, weight loss, etc." {...form.register('goal_type')} />
                {form.formState.errors.goal_type && <p className="text-sm text-destructive">{form.formState.errors.goal_type.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_value">Target Value</Label>
                <Input id="target_value" type="number" step="0.01" {...form.register('target_value', { valueAsNumber: true })} />
                {form.formState.errors.target_value && <p className="text-sm text-destructive">{form.formState.errors.target_value.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input id="start_date" type="date" {...form.register('start_date')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input id="end_date" type="date" {...form.register('end_date')} />
                </div>
              </div>
              <Button type="submit" className="w-full">Create Goal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <Card key={goal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <CardDescription className="capitalize">{goal.goal_type}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{goal.completion_percentage}%</div>
                  <p className="text-xs text-muted-foreground">complete</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{goal.current_value} / {goal.target_value}</span>
                </div>
                <Progress value={goal.completion_percentage} className="h-2" />
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">
                  {new Date(goal.start_date).toLocaleDateString()} - {new Date(goal.end_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => handleUpdateProgress(goal.id)} className="flex-1">
                  <TrendingUp className="mr-1 h-3 w-3" /> Update Progress
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(goal.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {goals.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-4">Set your first fitness goal to get started</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
