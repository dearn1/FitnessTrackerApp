import { useEffect, useState } from 'react';
import { Plus, Footprints, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { stepsApi, DailySteps } from '@/lib/apiClient';
import { stepsSchema } from '@/lib/api';
import { toast } from 'sonner';

export default function Steps() {
  const [steps, setSteps] = useState<DailySteps[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [quickLogDialogOpen, setQuickLogDialogOpen] = useState(false);
  const [quickSteps, setQuickSteps] = useState('');

  const form = useForm({
    resolver: zodResolver(stepsSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      steps: 0,
      distance_km: 0,
      calories_burned: 0,
      active_minutes: 0,
      source: 'manual' as const,
    },
  });

  const fetchSteps = async () => {
    try {
      const data = await stepsApi.list();
      setSteps(data);
    } catch (error) {
      toast.error('Failed to load steps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await stepsApi.create(data);
      toast.success('Steps logged successfully!');
      setDialogOpen(false);
      form.reset();
      fetchSteps();
    } catch (error: any) {
      toast.error(error.message || 'Failed to log steps');
    }
  };

  const handleQuickLog = async () => {
    if (!quickSteps || isNaN(Number(quickSteps))) {
      toast.error('Please enter a valid number');
      return;
    }
    try {
      await stepsApi.quickLog(Number(quickSteps));
      toast.success('Steps logged!');
      setQuickLogDialogOpen(false);
      setQuickSteps('');
      fetchSteps();
    } catch (error) {
      toast.error('Failed to log steps');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await stepsApi.delete(id);
      toast.success('Steps entry deleted');
      fetchSteps();
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Steps</h1>
          <p className="text-muted-foreground">Track your daily step count</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={quickLogDialogOpen} onOpenChange={setQuickLogDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Quick Log
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Quick Log Steps</DialogTitle>
                <DialogDescription>Quickly log today's steps</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quick-steps">Steps</Label>
                  <Input
                    id="quick-steps"
                    type="number"
                    placeholder="10000"
                    value={quickSteps}
                    onChange={(e) => setQuickSteps(e.target.value)}
                  />
                </div>
                <Button onClick={handleQuickLog} className="w-full">Log Steps</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Detailed Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Daily Steps</DialogTitle>
                <DialogDescription>Record detailed step information</DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" {...form.register('date')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="steps">Steps</Label>
                  <Input id="steps" type="number" {...form.register('steps', { valueAsNumber: true })} />
                  {form.formState.errors.steps && <p className="text-sm text-destructive">{form.formState.errors.steps.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance_km">Distance (km)</Label>
                    <Input id="distance_km" type="number" step="0.1" {...form.register('distance_km', { valueAsNumber: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="calories_burned">Calories</Label>
                    <Input id="calories_burned" type="number" {...form.register('calories_burned', { valueAsNumber: true })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="active_minutes">Active Minutes</Label>
                  <Input id="active_minutes" type="number" {...form.register('active_minutes', { valueAsNumber: true })} />
                </div>
                <Button type="submit" className="w-full">Log Entry</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((entry) => (
          <Card key={entry.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{new Date(entry.date).toLocaleDateString()}</CardTitle>
                  <CardDescription className="capitalize">{entry.source || 'manual'} entry</CardDescription>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-primary to-info p-2">
                  <Footprints className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-3xl font-bold text-primary">{entry.steps.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">steps</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {entry.distance_km && (
                  <div className="text-center">
                    <p className="text-muted-foreground">Distance</p>
                    <p className="font-medium">{entry.distance_km} km</p>
                  </div>
                )}
                {entry.calories_burned && (
                  <div className="text-center">
                    <p className="text-muted-foreground">Calories</p>
                    <p className="font-medium">{entry.calories_burned}</p>
                  </div>
                )}
                {entry.active_minutes && (
                  <div className="text-center">
                    <p className="text-muted-foreground">Active</p>
                    <p className="font-medium">{entry.active_minutes} min</p>
                  </div>
                )}
              </div>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(entry.id)} className="w-full">
                <Trash2 className="mr-1 h-3 w-3" /> Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {steps.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Footprints className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No steps logged</h3>
            <p className="text-muted-foreground mb-4">Start tracking your daily steps</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setQuickLogDialogOpen(true)} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Quick Log
              </Button>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Detailed Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
