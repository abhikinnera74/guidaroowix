import { useMember } from '@/integrations';
import { TouristHeader } from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { User, Mail, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TouristProfilePage() {
  const { member } = useMember();

  return (
    <div className="min-h-screen bg-background">
      <TouristHeader />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-heading text-5xl font-bold text-primary mb-12 text-center">
            My Profile
          </h1>

          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-primary/10">
            <div className="flex flex-col items-center mb-8">
              {member?.profile?.photo?.url ? (
                <Image
                  src={member.profile.photo.url}
                  alt={member.profile.nickname || 'Profile'}
                  className="w-32 h-32 rounded-full object-cover mb-6"
                  width={128}
                />
              ) : (
                <div className="w-32 h-32 bg-lavenderaccent rounded-full flex items-center justify-center mb-6">
                  <User size={64} className="text-primary" />
                </div>
              )}

              <h2 className="font-heading text-3xl font-bold text-primary mb-2">
                {member?.profile?.nickname || member?.contact?.firstName || 'User'}
              </h2>
              
              {member?.profile?.title && (
                <p className="font-paragraph text-lg text-foreground/70">
                  {member.profile.title}
                </p>
              )}
            </div>

            <div className="space-y-6">
              {member?.contact?.firstName && member?.contact?.lastName && (
                <div className="flex items-start gap-4 p-4 bg-background rounded-xl">
                  <div className="w-10 h-10 bg-lavenderaccent rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-paragraph text-sm text-foreground/70 mb-1">Full Name</p>
                    <p className="font-paragraph text-lg text-foreground font-semibold">
                      {member.contact.firstName} {member.contact.lastName}
                    </p>
                  </div>
                </div>
              )}

              {member?.loginEmail && (
                <div className="flex items-start gap-4 p-4 bg-background rounded-xl">
                  <div className="w-10 h-10 bg-lavenderaccent rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-paragraph text-sm text-foreground/70 mb-1">Email</p>
                    <p className="font-paragraph text-lg text-foreground font-semibold">
                      {member.loginEmail}
                    </p>
                  </div>
                </div>
              )}

              {member?._createdDate && (
                <div className="flex items-start gap-4 p-4 bg-background rounded-xl">
                  <div className="w-10 h-10 bg-lavenderaccent rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-paragraph text-sm text-foreground/70 mb-1">Member Since</p>
                    <p className="font-paragraph text-lg text-foreground font-semibold">
                      {new Date(member._createdDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
