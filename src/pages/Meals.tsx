import { useEffect, useState } from 'react';
import { Plus, Utensils, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { mealsApi, Meal } from '@/lib/apiClient';
import { mealSchema } from '@/lib/api';
import { toast } from 'sonner';

export default function Meals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      meal_type: 'breakfast' as const,
      name: '',
      meal_date: new Date().toISOString().split('T')[0],
      meal_time: '08:00:00',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    },
  });

  const fetchMeals = async () => {
    try {
      const data = await mealsApi.list();
      setMeals(data);
    } catch (error) {
      toast.error('Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      await mealsApi.create(data);
      toast.success('Meal logged successfully!');
      setDialogOpen(false);
      form.reset();
      fetchMeals();
    } catch (error: any) {
      toast.error(error.message || 'Failed to log meal');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await mealsApi.delete(id);
      toast.success('Meal deleted');
      fetchMeals();
    } catch (error) {
      toast.error('Failed to delete meal');
    }
  };

  const getMealTypeColor = (type: string) => {
    const colors = {
      breakfast: 'bg-warning/10 text-warning border-warning/20',
      lunch: 'bg-success/10 text-success border-success/20',
      dinner: 'bg-info/10 text-info border-info/20',
      snack: 'bg-accent/10 text-accent border-accent/20',
    };
    return colors[type as keyof typeof colors] || colors.breakfast;
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meals</h1>
          <p className="text-muted-foreground">Track your nutrition and calories</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Meal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log New Meal</DialogTitle>
              <DialogDescription>Record your meal and nutritional information</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Meal Name</Label>
                <Input id="name" {...form.register('name')} />
                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Meal Type</Label>
                <Select onValueChange={(value) => form.setValue('meal_type', value as any)} defaultValue="breakfast">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meal_date">Date</Label>
                  <Input id="meal_date" type="date" {...form.register('meal_date')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meal_time">Time</Label>
                  <Input id="meal_time" type="time" {...form.register('meal_time')} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input id="calories" type="number" {...form.register('calories', { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input id="protein" type="number" step="0.1" {...form.register('protein', { valueAsNumber: true })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input id="carbs" type="number" step="0.1" {...form.register('carbs', { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fats">Fats (g)</Label>
                  <Input id="fats" type="number" step="0.1" {...form.register('fats', { valueAsNumber: true })} />
                </div>
              </div>
              <Button type="submit" className="w-full">Log Meal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {meals.map((meal) => (
          <Card key={meal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{meal.name}</CardTitle>
                  <CardDescription>{new Date(meal.meal_date).toLocaleDateString()} at {meal.meal_time}</CardDescription>
                </div>
                <Badge className={getMealTypeColor(meal.meal_type)} variant="outline">
                  {meal.meal_type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-muted p-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{meal.calories}</p>
                  <p className="text-xs text-muted-foreground">calories</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">Protein</p>
                  <p className="font-medium">{meal.protein}g</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Carbs</p>
                  <p className="font-medium">{meal.carbs}g</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Fats</p>
                  <p className="font-medium">{meal.fats}g</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(meal.id)} className="w-full">
                <Trash2 className="mr-1 h-3 w-3" /> Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {meals.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No meals logged</h3>
            <p className="text-muted-foreground mb-4">Start tracking your nutrition</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Log Meal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
