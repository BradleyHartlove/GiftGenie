'use client';
import LinearProgress from '@mui/material/LinearProgress';
import { Navigate, useNavigate } from 'react-router';
import { useSession, type Session } from '../SessionContext';
import {
  signUpWithCredentials,
} from '../firebase/auth';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { setDoc, doc } from "firebase/firestore";
import db from '../firebase/database';

export default function SignUpPage() {
  const { session, setSession, loading } = useSession();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  if (loading) {
    return <LinearProgress />;
  }

  if (session) {
    return <Navigate to="/home" />;
  }

  async function createUserInFirestore(uid: string, username: string) {
    try {
      await setDoc(doc(db, "users", uid), {
        username: username,
        uid: uid
      });
      console.log("Document written with ID: ", uid);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <div className="w-full min-h-screen">
      <div className="w-full min-h-screen flex justify-center items-center">
        <Card sx={{ width: 400, boxShadow: 5 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" align="center">
              Sign Up
            </Typography>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                setError(null);
                const formData = new FormData(event.currentTarget);
                const email = formData.get('email') as string;
                const username = formData.get('username') as string;
                const password = formData.get('password') as string;
                const verifyPassword = formData.get('verifyPassword') as string;

                if (!email || !username || !password || !verifyPassword) {
                  setError('All fields are required');
                  return;
                }
                if (password !== verifyPassword) {
                  setError('Passwords do not match');
                  return;
                }

                try {
                  const result = await signUpWithCredentials(email, password, username);
                  if (result?.success && result?.user) {
                    const userSession: Session = {
                      user: {
                        id: result.user.uid,
                        name: result.user.displayName || username,
                        email: result.user.email || email
                      },
                    };
                    setSession(userSession);

                    // Create user in firebase cloud firestore
                    await createUserInFirestore(result.user.uid, username);

                    navigate('/home', { replace: true });
                  } else {
                    setError(result?.error || 'Failed to sign up');
                  }
                } catch (error) {
                  setError(error instanceof Error ? error.message : 'An error occurred');
                }
              }}
            >
              <div className="flex flex-col gap-4 mt-4">
                <TextField name="email" label="Email" variant="outlined" type="email" fullWidth required />
                <TextField name="username" label="Username" variant="outlined" type="text" fullWidth required />
                <TextField name="password" label="Password" variant="outlined" type="password" fullWidth required />
                <TextField name="verifyPassword" label="Verify Password" variant="outlined" type="password" fullWidth required />
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
                Sign Up
              </Button>
              <div>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  Already have an account? <Button color="primary" onClick={() => navigate('/sign-in')}>Sign In</Button>
                </Typography>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}