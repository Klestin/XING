import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // For now, we'll just render the children
  // In a real app, we would check the authentication state here
  return <>{children}</>;
} 