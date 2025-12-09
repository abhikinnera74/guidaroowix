import { useMember } from '@/integrations';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User } from 'lucide-react';

export default function LoginPage() {
  const { isAuthenticated, actions } = useMember();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tours');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-lavenderaccent rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="text-primary" size={40} />
            </div>
            <h1 className="font-heading text-4xl font-bold text-primary mb-4">
              Tourist Login
            </h1>
            <p className="font-paragraph text-base text-foreground">
              Sign in to explore and book amazing tours
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10">
            <button
              onClick={actions.login}
              className="w-full px-8 py-4 bg-primary text-primary-foreground font-paragraph text-lg rounded-full hover:bg-primary/90 transition-all"
            >
              Sign In as Tourist
            </button>

            <div className="mt-8 pt-8 border-t border-primary/10 text-center">
              <p className="font-paragraph text-sm text-foreground mb-4">
                Are you a guide?
              </p>
              <button
                onClick={() => navigate('/guide-login')}
                className="font-paragraph text-base text-secondary hover:text-secondary/80 transition-colors underline"
              >
                Sign in as a Guide
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
