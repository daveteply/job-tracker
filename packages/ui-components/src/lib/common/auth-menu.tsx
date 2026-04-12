'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { SyncIndicator } from './sync-indicator';

export function AuthMenu() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <span className="loading loading-spinner loading-xs text-white"></span>
        <span className="text-sm">...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <SyncIndicator />
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-white">
            <div className="w-10 rounded-full">
              {session.user?.image ? (
                <img alt={session.user.name ?? 'User'} src={session.user.image} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-blue-500 text-white font-bold">
                  {session.user?.name?.[0] ?? '?'}
                </div>
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-base-content"
          >
            <li>
              <div className="flex flex-col items-start px-2 py-1">
                <span className="font-bold">{session.user?.name}</span>
                <span className="text-xs text-gray-500">{session.user?.email}</span>
              </div>
            </li>
            <div className="divider my-0"></div>
            <li>
              <button onClick={() => signOut()} className="text-error">
                Sign out
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        className="btn btn-ghost btn-sm text-white border-white"
        onClick={() => signIn('google')}
      >
        Sign In
      </button>
    </div>
  );
}

export default AuthMenu;
