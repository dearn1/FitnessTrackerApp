import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/apiClient';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await authApi.updateProfile(data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details and settings</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="mr-2 h-4 w-4" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-muted">
            <div className="rounded-full bg-gradient-to-br from-primary to-info p-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{user.first_name} {user.last_name}</h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input id="first_name" {...form.register('first_name')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input id="last_name" {...form.register('last_name')} />
                </div>
              </div>
              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Username</Label>
                <p className="text-lg font-medium">{user.username}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">First Name</Label>
                  <p className="text-lg font-medium">{user.first_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Name</Label>
                  <p className="text-lg font-medium">{user.last_name}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Current API endpoint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-4">
            <code className="text-sm break-all">{import.meta.env.VITE_API_BASE_URL || 'https://vercel.com/endra-sims-projects/fitness-tracker-app-backend'}</code>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            To change the API URL, set the <code className="bg-muted px-1 rounded">VITE_API_BASE_URL</code> environment variable
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
