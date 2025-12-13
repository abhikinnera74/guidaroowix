import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Tourists, Guides } from '@/entities';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: ('tourist' | 'guide')[];
  messageToSignIn?: string;
}

export function RoleProtectedRoute({
  children,
  allowedRoles,
  messageToSignIn = 'Sign in to access this page',
}: RoleProtectedRouteProps) {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isAuthenticated || !member?.loginEmail) {
        setIsCheckingRole(false);
        return;
      }

      try {
        // Try to find user in tourists collection
        const { items: tourists } = await BaseCrudService.getAll<Tourists>('tourists');
        const touristUser = tourists.find(t => t.email === member.loginEmail);
        
        if (touristUser && touristUser.role) {
          setUserRole(touristUser.role.toLowerCase());
          setIsCheckingRole(false);
          return;
        }

        // Try to find user in guides collection
        const { items: guides } = await BaseCrudService.getAll<Guides>('guides');
        const guideUser = guides.find(g => g.email === member.loginEmail);
        
        if (guideUser && guideUser.role) {
          setUserRole(guideUser.role.toLowerCase());
          setIsCheckingRole(false);
          return;
        }

        // User not found in either collection
        setUserRole(null);
        setIsCheckingRole(false);
      } catch (error) {
        console.error('Error checking user role:', error);
        setUserRole(null);
        setIsCheckingRole(false);
      }
    };

    if (!isLoading) {
      checkUserRole();
    }
  }, [isAuthenticated, member?.loginEmail, isLoading]);

  // Show loading spinner while checking authentication and role
  if (isLoading || isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  // Not authenticated - show sign in prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-md">
          <h1 className="font-heading text-3xl font-bold text-primary mb-4">
            Sign In Required
          </h1>
          <p className="font-paragraph text-lg text-foreground/70 mb-8">
            {messageToSignIn}
          </p>
          <button
            onClick={actions.login}
            className="px-8 py-4 bg-primary text-primary-foreground font-paragraph text-lg rounded-full hover:bg-primary/90 transition-all"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Authenticated but role not found
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-md">
          <h1 className="font-heading text-3xl font-bold text-primary mb-4">
            Profile Not Set Up
          </h1>
          <p className="font-paragraph text-lg text-foreground/70 mb-8">
            Please complete your profile setup to continue.
          </p>
          <button
            onClick={() => navigate('/guide-onboarding')}
            className="px-8 py-4 bg-primary text-primary-foreground font-paragraph text-lg rounded-full hover:bg-primary/90 transition-all"
          >
            Complete Setup
          </button>
        </div>
      </div>
    );
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(userRole as 'tourist' | 'guide')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-md">
          <h1 className="font-heading text-3xl font-bold text-primary mb-4">
            Access Denied
          </h1>
          <p className="font-paragraph text-lg text-foreground/70 mb-8">
            You don't have permission to access this page. This page is only for {allowedRoles.join(' and ')}.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-primary text-primary-foreground font-paragraph text-lg rounded-full hover:bg-primary/90 transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and has the correct role
  return <>{children}</>;
}
