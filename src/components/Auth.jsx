import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { useAuditLogger } from '@/hooks/useAuditLogger';

const Auth = ({ setActiveTab }) => {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const { logActivity } = useAuditLogger();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const action = isLoginView ? signIn : signUp;
    const { error } = await action(email, password);

    if (!error) {
      toast({
        title: isLoginView ? "Sign In Successful" : "Sign Up Successful",
        description: isLoginView ? "Welcome back!" : "Please check your email to verify your account.",
      });
      if (isLoginView) {
        await logActivity('login', 'User logged in successfully');
      } else {
        await logActivity('signup', 'User signed up');
      }
      setActiveTab('dashboard');
    }
    
    setIsSubmitting(false);
  };

  useEffect(() => {
    // Prefill for easy testing
    if (process.env.NODE_ENV === 'development') {
      setEmail('kingslotenterprises@gmail.com');
      setPassword('Test1!');
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto mt-10"
    >
      <div className="harmony-card p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{isLoginView ? 'Welcome Back!' : 'Create an Account'}</h1>
          <p className="text-gray-600 mt-2">{isLoginView ? 'Sign in to continue your wellness journey.' : 'Join us to start improving your well-being.'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full harmony-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              isLoginView ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />
            )}
            {isLoginView ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div className="text-center">
          <Button variant="link" onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Auth;