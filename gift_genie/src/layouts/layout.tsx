import LinearProgress from '@mui/material/LinearProgress';
import { Outlet, Navigate, useLocation } from 'react-router';
import { useSession } from '../SessionContext';

export default function Layout() {
  const { session, loading } = useSession();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ width: '100%' }}>
        <LinearProgress />
      </div>
    );
  }

  if (!session) {
    // Add the `callbackUrl` search parameter
    const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(location.pathname)}`;

    return <Navigate to={redirectTo} replace />;
  }
  return (
        <div>
            <Outlet/>
        </div>
  );
}
