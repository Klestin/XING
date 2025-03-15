import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // For now, we'll just render the children
  // In a real app, we would check the authentication state here
  return <>{children}</>;
} 