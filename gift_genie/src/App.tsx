import * as React from 'react';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet } from 'react-router';
import {
  onAuthStateChanged,
} from './firebase/auth';
import SessionContext, { type Session } from './SessionContext';
import type { User } from 'firebase/auth';
export default function App() {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  const sessionContextValue = React.useMemo(
    () => ({
      session,
      setSession,
      loading,
    }),
    [session, loading],
  );

  React.useEffect(() => {
    // Returns an `unsubscribe` function to be called during teardown
    const unsubscribe = onAuthStateChanged((user: User | null) => {
      if (user) {
        setSession({
          user: {
            name: user.displayName || '',
            email: user.email || '',
            image: user.photoURL || '',
          },
        });
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ReactRouterAppProvider
      session={session}
      // authentication={AUTHENTICATION}
    >
      <SessionContext.Provider value={sessionContextValue}>
        <Outlet />
      </SessionContext.Provider>
    </ReactRouterAppProvider>
  );
}