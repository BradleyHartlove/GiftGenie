'use client';
// import { SignInPage } from '@toolpad/core/SignInPage';
import LinearProgress from '@mui/material/LinearProgress';
import { Navigate, useNavigate } from 'react-router';
import { useSession, type Session } from '../SessionContext';
import {
  signInWithCredentials,
} from '../firebase/auth';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
// import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import * as React from 'react';

export default function SignIn() {
  const { session, setSession, loading } = useSession();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  if (loading) {
    return <LinearProgress />;
  }

  if (session) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="w-full min-h-screen">
      <div className="w-full min-h-screen flex justify-center items-center">
        <Card sx={{ width: 400, boxShadow: 5 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" align="center">
              Sign In
            </Typography>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                setError(null);
                const formData = new FormData(event.currentTarget);
                const email = formData.get('email') as string;
                const password = formData.get('password') as string;

                if (!email || !password) {
                  setError('Email and password are required');
                  return;
                }

                try {
                  const result = await signInWithCredentials(email, password);
                  if (result?.success && result?.user) {
                    const userSession: Session = {
                      user: {
                        id: result.user.uid,
                        name: result.user.displayName || '',
                        email: result.user.email || '',
                      },
                    };
                    setSession(userSession);
                    navigate('/home', { replace: true });
                  } else {
                    setError(result?.error || 'Failed to sign in');
                  }
                } catch (error) {
                  setError(error instanceof Error ? error.message : 'An error occurred');
                }
              }}
            >
              <div className="flex flex-col gap-4 mt-4">
                <TextField name="email" label="Email" variant="outlined" type="email" fullWidth required />
                <TextField name="password" label="Password" variant="outlined" type="password" fullWidth required />
              </div>
              {error && (
                <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Sign In
              </Button>
              <div>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  Don't have an account? <Button color="primary" onClick={() => navigate('/sign-up')}>Sign Up</Button>
                </Typography>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}