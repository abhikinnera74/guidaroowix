import { useMember } from '@/integrations';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { GuidePremiumHeader } from '@/components/PremiumHeader';
import Footer from '@/components/Footer';
import { Compass } from 'lucide-react';
import { useRoleRedirect } from '@/hooks/use-role-redirect';

export default function GuideLoginPage() {
  const { isAuthenticated, actions } = useMember();
  const navigate = useNavigate();
  useRoleRedirect();

  useEffect(() => {
    if (isAuthenticated) {
      // Role redirect hook will handle the navigation
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GuidePremiumHeader />
      
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Compass className="text-secondary" size={40} />
            </div>
            <h1 className="font-heading text-4xl font-bold text-primary mb-4">
              Guide Login
            </h1>
            <p className="font-paragraph text-base text-foreground">
              Sign in to manage your tours and connect with travelers
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10">
            <button
              onClick={actions.login}
              className="w-full px-8 py-4 bg-secondary text-secondary-foreground font-paragraph text-lg rounded-full hover:bg-secondary/90 transition-all"
            >
              Sign In as Guide
            </button>

            <p className="font-paragraph text-xs text-foreground/70 text-center mt-4">
              New guide? Sign in to create your profile and start earning!
            </p>

            <div className="mt-8 pt-8 border-t border-primary/10 text-center">
              <p className="font-paragraph text-sm text-foreground mb-4">
                Are you a tourist?
              </p>
            <button
              onClick={() => navigate('/login')}
              className="font-paragraph text-base text-primary hover:text-primary/80 transition-colors underline"
            >
              Sign in as a Tourist
            </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
