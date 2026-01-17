'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || '';

interface AuthButtonProps {
  user: User | null;
  onAuthChange: () => void;
}

export default function AuthButton({ user, onAuthChange }: AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;
  
  // Hide completely for non-admin visitors (but allow admin to sign in)
  // Show button if: not authenticated (admin can sign in) OR authenticated admin
  if (user && !isAdmin) {
    return null; // Hide for authenticated non-admin users
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Only allow admin email to sign in
    if (email !== ADMIN_EMAIL) {
      setError('Access denied. Only admin can sign in.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setShowForm(false);
      setEmail('');
      setPassword('');
      onAuthChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    onAuthChange();
    setIsLoading(false);
  };

  if (user && isAdmin) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-filmic-rose truncate max-w-[150px]">
          {user.email}
        </span>
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm rounded-md glass border border-glass-border hover:bg-filmic-seduction/30 transition-colors disabled:opacity-50 text-filmic-beige"
        >
          {isLoading ? '...' : 'Sign Out'}
        </button>
      </div>
    );
  }

  if (showForm) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-1.5 text-sm rounded-md border border-glass-border bg-filmic-seduction/15 text-filmic-beige placeholder:text-filmic-rose/50 w-40 focus:outline-none focus:ring-2 focus:ring-filmic-lavender"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="px-3 py-1.5 text-sm rounded-md border border-glass-border bg-filmic-seduction/15 text-filmic-beige placeholder:text-filmic-rose/50 w-32 focus:outline-none focus:ring-2 focus:ring-filmic-lavender"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-3 py-1.5 text-sm rounded-md bg-filmic-lavender text-filmic-beige hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? '...' : 'Sign In'}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowForm(false);
            setEmail('');
            setPassword('');
            setError('');
          }}
          className="text-filmic-rose hover:text-filmic-beige"
        >
          x
        </button>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </form>
    );
  }

  // Only show admin button if not authenticated
  return (
    <button
      onClick={() => setShowForm(true)}
      className="px-4 py-1.5 text-sm rounded-md glass border border-glass-border text-filmic-beige hover:bg-filmic-seduction/30 transition-colors"
    >
      vversio
    </button>
  );
}
