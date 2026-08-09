import React, { useEffect } from 'react';

const REGISTER_URL = 'https://ignite-8.vercel.app/register-stock';

export function Login() {
  useEffect(() => {
    // Automatically redirect /login to the main registration page
    window.location.href = REGISTER_URL;
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <p className="text-sm text-slate-400">Redirecting to Equity Arena registration...</p>
    </div>
  );
}

export default Login;
