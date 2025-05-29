import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import Container from '@/components/layout/Container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Login() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const login = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Credenziali non valide');
      }

      const { token } = await response.json();
      localStorage.setItem('adminToken', token);
      return token;
    },
    onSuccess: () => {
      toast.success('Login effettuato con successo');
      setLocation('/articles');
    },
    onError: () => {
      toast.error('Credenziali non valide');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(formData);
  };

  return (
    <div className="py-20 bg-black">
      <Container>
        <Card className="max-w-md mx-auto bg-zinc-900 border-primary/20">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">
              Login Admin
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-black/50 border-primary/30"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-black/50 border-primary/30"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={login.isPending}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {login.isPending ? 'Accesso in corso...' : 'Accedi'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
} 