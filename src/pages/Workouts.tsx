import { useEffect, useState } from 'react';
import { Plus, Dumbbell, Trash2, Edit, Play, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { workoutsApi, Workout } from '@/lib/apiClient';
import { workoutSchema } from '@/lib/api';
import { toast } from 'sonner';

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      workout_type: '',
      title: '',
      description: '',
      duration: 30,
      calories_burned: 0,
      distance: 0,
      intensity: 'medium' as const,
      status: 'planned' as const,
      workout_date: new Date().toISOString().split('T')[0],
    },
  });

  const fetchWorkouts = async () => {
    try {
      const data = await workoutsApi.list();
      setWorkouts(data);
    } catch (error) {
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await workoutsApi.create(data);
      toast.success('Workout created successfully!');
      setDialogOpen(false);
      form.reset();
      fetchWorkouts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create workout');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await workoutsApi.delete(id);
      toast.success('Workout deleted');
      fetchWorkouts();
    } catch (error) {
      toast.error('Failed to delete workout');
    }
  };

  const handleStart = async (id: number) => {
    try {
      await workoutsApi.start(id);
      toast.success('Workout started!');
      fetchWorkouts();
    } catch (error) {
      toast.error('Failed to start workout');
    }
  };

  const handleComplete = async (id: number, duration: number, calories: number) => {
    try {
      await workoutsApi.complete(id, { duration, calories_burned: calories });
      toast.success('Workout completed! 🎉');
      fetchWorkouts();
    } catch (error) {
      toast.error('Failed to complete workout');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planned: 'bg-info/10 text-info border-info/20',
      in_progress: 'bg-warning/10 text-warning border-warning/20',
      completed: 'bg-success/10 text-success border-success/20',
      skipped: 'bg-muted text-muted-foreground border-border',
    };
    return colors[status as keyof typeof colors] || colors.planned;
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
          <p className="text-muted-foreground">Manage your exercise sessions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Workout</DialogTitle>
              <DialogDescription>Add a new workout to your fitness plan</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...form.register('title')} />
                  {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workout_type">Type</Label>
                  <Input id="workout_type" placeholder="running, cycling, etc." {...form.register('workout_type')} />
                  {form.formState.errors.workout_type && <p className="text-sm text-destructive">{form.formState.errors.workout_type.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register('description')} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input id="duration" type="number" {...form.register('duration', { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calories_burned">Calories</Label>
                  <Input id="calories_burned" type="number" step="0.01" {...form.register('calories_burned', { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input id="distance" type="number" step="0.1" {...form.register('distance', { valueAsNumber: true })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Intensity</Label>
                  <Select onValueChange={(value) => form.setValue('intensity', value as any)} defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workout_date">Date</Label>
                  <Input id="workout_date" type="date" {...form.register('workout_date')} />
                </div>
              </div>
              <Button type="submit" className="w-full">Create Workout</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workouts.map((workout) => (
          <Card key={workout.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{workout.title}</CardTitle>
                  <CardDescription className="capitalize">{workout.workout_type}</CardDescription>
                </div>
                <Badge className={getStatusColor(workout.status)} variant="outline">
                  {workout.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{workout.duration} min</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Calories</p>
                  <p className="font-medium">{workout.calories_burned}</p>
                </div>
                {workout.distance && (
                  <div>
                    <p className="text-muted-foreground">Distance</p>
                    <p className="font-medium">{workout.distance} km</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Intensity</p>
                  <p className="font-medium capitalize">{workout.intensity}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {workout.status === 'planned' && (
                  <Button size="sm" variant="secondary" onClick={() => handleStart(workout.id)} className="flex-1">
                    <Play className="mr-1 h-3 w-3" /> Start
                  </Button>
                )}
                {workout.status === 'in_progress' && (
                  <Button size="sm" onClick={() => handleComplete(workout.id, workout.duration, workout.calories_burned)} className="flex-1">
                    <CheckCircle className="mr-1 h-3 w-3" /> Complete
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => handleDelete(workout.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {workouts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No workouts yet</h3>
            <p className="text-muted-foreground mb-4">Start by creating your first workout</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Workout
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
