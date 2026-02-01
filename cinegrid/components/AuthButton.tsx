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
        <span className="text-sm text-text-secondary truncate max-w-[150px]">
          {user.email}
        </span>
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm rounded-md glass border border-border-subtle hover:bg-bg-tertiary/50 transition-colors disabled:opacity-50 text-text-primary"
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
          className="px-3 py-1.5 text-sm rounded-md border border-border-subtle bg-bg-tertiary/30 text-text-primary placeholder:text-text-muted w-40 focus:outline-none focus:ring-2 focus:ring-border-focus"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="px-3 py-1.5 text-sm rounded-md border border-border-subtle bg-bg-tertiary/30 text-text-primary placeholder:text-text-muted w-32 focus:outline-none focus:ring-2 focus:ring-border-focus"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-3 py-1.5 text-sm rounded-md bg-text-primary text-bg-primary hover:opacity-90 transition-opacity disabled:opacity-50"
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
          className="text-text-secondary hover:text-text-primary"
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
      className="px-4 py-1.5 text-sm rounded-md glass border border-border-subtle text-text-primary hover:bg-bg-tertiary/50 transition-colors"
    >
      by vversio
    </button>
  );
}
