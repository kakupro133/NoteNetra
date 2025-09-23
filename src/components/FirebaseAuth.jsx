import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

const FirebaseAuth = () => {
  const [currentUser, setCurrentUser] = useState(null); // Renamed from 'user' to avoid conflict if 'user' is used elsewhere
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Simulate a user being logged in or out locally
  const handleSignInSuccess = (dummyEmail) => {
    setCurrentUser({ email: dummyEmail, uid: 'dummy-uid' });
    setError('');
    navigate('/dashboard'); // Navigate to dashboard on successful dummy login
  };

  const handleSignOutSuccess = () => {
    setCurrentUser(null);
    setError('');
    navigate('/'); // Navigate to home on successful dummy logout
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'test@example.com' && password === 'password') {
      handleSignInSuccess(email);
    } else {
      setError('Invalid credentials for dummy auth.');
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    handleSignOutSuccess();
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center p-4 text-foreground">Loading...</div>;
  }

  if (currentUser) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-card rounded-lg shadow-lg border border-border text-foreground">
        <h2 className="text-2xl font-bold mb-4 text-green-500">Welcome!</h2>
        <p className="mb-4 text-muted-foreground">You are signed in as: <strong className="text-foreground">{currentUser.email}</strong></p>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
        >
          Sign Out (Dummy)
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-card rounded-lg shadow-lg border border-border text-foreground">
      <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
        {isSignUp ? 'Create Account (Dummy)' : 'Sign In (Dummy)'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors"
        >
          {isSignUp ? 'Sign Up (Dummy)' : 'Sign In (Dummy)'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary hover:text-primary/80 text-sm transition-colors"
        >
          {isSignUp ? 'Already have an account? Sign In (Dummy)' : "Don't have an account? Sign Up (Dummy)"}
        </button>
      </div>
    </div>
  );
};

export default FirebaseAuth;
