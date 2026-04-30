import { useEffect, useState } from 'react';
import { AUTH_REQUIRED } from '../config';

export default function AuthGuard({ children }) {
  const [ready, setReady] = useState(!AUTH_REQUIRED);

  useEffect(() => {
    if (!AUTH_REQUIRED) return;

    const identity = window.netlifyIdentity;
    if (!identity) {
      console.error('Netlify Identity widget not loaded');
      return;
    }

    const user = identity.currentUser();
    if (user) {
      setReady(true);
    } else {
      identity.open('login');
      identity.on('login', () => {
        identity.close();
        setReady(true);
      });
    }
  }, []);

  if (!ready) return null;
  return children;
}
