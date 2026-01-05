import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Tourists, Guides } from '@/entities';

/**
 * Hook to redirect users based on their role after login
 * Guides go to guide-onboarding or guide-dashboard
 * Tourists go to tours or tourist-dashboard
 */
export function useRoleRedirect() {
  const { member, isAuthenticated, isLoading } = useMember();
  const navigate = useNavigate();

  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      if (!isAuthenticated || !member?.loginEmail || isLoading) {
        return;
      }

      try {
        // Check if user is a guide
        const { items: guides } = await BaseCrudService.getAll<Guides>('guides');
        const guideUser = guides.find(g => g.email === member.loginEmail || g.memberEmail === member.loginEmail);

        if (guideUser) {
          // User is a guide - redirect to guide onboarding if not completed, otherwise to dashboard
          if (!guideUser.isActive) {
            navigate('/guide-onboarding');
          } else {
            navigate('/guide-dashboard');
          }
          return;
        }

        // Check if user is a tourist
        const { items: tourists } = await BaseCrudService.getAll<Tourists>('tourists');
        const touristUser = tourists.find(t => t.email === member.loginEmail || t.memberEmail === member.loginEmail);

        if (touristUser) {
          // User is a tourist - redirect to tours
          navigate('/tours');
          return;
        }

        // User not found in either collection - they need to choose their role
        // This shouldn't happen in normal flow, but handle it gracefully
        navigate('/');
      } catch (error) {
        console.error('Error checking user role for redirect:', error);
      }
    };

    if (!isLoading) {
      checkRoleAndRedirect();
    }
  }, [isAuthenticated, member?.loginEmail, isLoading, navigate]);
}
