import { useMember } from '@/integrations';
import { GuidePremiumHeader } from '@/components/PremiumHeader';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Guides } from '@/entities';
import { Image } from '@/components/ui/image';
import { User, Mail, Calendar, Star, MapPin, Globe, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function GuideProfilePageNew() {
  const { member } = useMember();
  const [guideData, setGuideData] = useState<Guides | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        if (member?.loginEmail) {
          const { items } = await BaseCrudService.getAll<Guides>('guides');
          const guide = items.find(g => g.email === member.loginEmail);
          setGuideData(guide || null);
        }
      } catch (error) {
        console.error('Error fetching guide data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuideData();
  }, [member?.loginEmail]);

  return (
    <div className="min-h-screen bg-background">
      <GuidePremiumHeader />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-heading text-5xl font-bold text-secondary mb-12 text-center">
            Guide Profile
          </h1>

          {loading ? (
            <div className="text-center py-12">
              <p className="font-paragraph text-foreground">Loading profile...</p>
            </div>
          ) : guideData ? (
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-secondary/10">
              <div className="flex flex-col items-center mb-8">
                {guideData.profilePicture ? (
                  <Image
                    src={guideData.profilePicture}
                    alt={guideData.fullName || 'Guide'}
                    className="w-32 h-32 rounded-full object-cover mb-6"
                    width={128}
                  />
                ) : (
                  <div className="w-32 h-32 bg-secondary/20 rounded-full flex items-center justify-center mb-6">
                    <User size={64} className="text-secondary" />
                  </div>
                )}

                <h2 className="font-heading text-3xl font-bold text-secondary mb-2">
                  {guideData.fullName || 'Guide'}
                </h2>
                
                {guideData.specialty && (
                  <p className="font-paragraph text-lg text-foreground/70 mb-4">
                    {guideData.specialty}
                  </p>
                )}

                {guideData.averageRating && (
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={i < Math.round(guideData.averageRating || 0) ? 'text-secondary fill-secondary' : 'text-secondary/20'}
                        />
                      ))}
                    </div>
                    <span className="font-heading font-bold text-secondary">
                      {guideData.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {guideData.bio && (
                  <div className="p-4 bg-background rounded-xl">
                    <p className="font-paragraph text-base text-foreground">
                      {guideData.bio}
                    </p>
                  </div>
                )}

                {/* Verification Status */}
                {(guideData.verificationStatus || guideData.isVerified) && (
                  <div className={`flex items-start gap-4 p-4 rounded-xl ${
                    guideData.isVerified 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      guideData.isVerified 
                        ? 'bg-green-200' 
                        : 'bg-yellow-200'
                    }`}>
                      {guideData.isVerified ? (
                        <CheckCircle size={20} className="text-green-700" />
                      ) : (
                        <Shield size={20} className="text-yellow-700" />
                      )}
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70 mb-1">Verification Status</p>
                      <p className={`font-heading text-lg font-bold ${
                        guideData.isVerified 
                          ? 'text-green-700' 
                          : 'text-yellow-700'
                      }`}>
                        {guideData.isVerified ? 'Verified' : 'Pending Verification'}
                      </p>
                    </div>
                  </div>
                )}

                {/* ... keep existing code (email, phone, city, languages, experience, hourly rate sections) ... */}
                {guideData.email && (
                  <div className="flex items-start gap-4 p-4 bg-background rounded-xl">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-secondary" />
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70 mb-1">Email</p>
                      <p className="font-paragraph text-lg text-foreground font-semibold">
                        {guideData.email}
                      </p>
                    </div>
                  </div>
                )}

                {guideData.phoneNumber && (
                  <div className="flex items-start gap-4 p-4 bg-background rounded-xl">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-secondary" />
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70 mb-1">Phone</p>
                      <p className="font-paragraph text-lg text-foreground font-semibold">
                        {guideData.phoneNumber}
                      </p>
                    </div>
                  </div>
                )}

                {guideData.city && (
                  <div className="flex items-start gap-4 p-4 bg-background rounded-xl">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-secondary" />
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70 mb-1">City</p>
                      <p className="font-paragraph text-lg text-foreground font-semibold">
                        {guideData.city}
                      </p>
                    </div>
                  </div>
                )}

                {guideData.languagesSpoken && (
                  <div className="flex items-start gap-4 p-4 bg-background rounded-xl">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Globe size={20} className="text-secondary" />
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70 mb-1">Languages</p>
                      <p className="font-paragraph text-lg text-foreground font-semibold">
                        {guideData.languagesSpoken}
                      </p>
                    </div>
                  </div>
                )}

                {guideData.yearsOfExperience && (
                  <div className="flex items-start gap-4 p-4 bg-background rounded-xl">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar size={20} className="text-secondary" />
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70 mb-1">Experience</p>
                      <p className="font-paragraph text-lg text-foreground font-semibold">
                        {guideData.yearsOfExperience} years
                      </p>
                    </div>
                  </div>
                )}

                {guideData.hourlyRate && (
                  <div className="flex items-start gap-4 p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                    <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-heading font-bold text-secondary">$</span>
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70 mb-1">Hourly Rate</p>
                      <p className="font-heading text-2xl font-bold text-secondary">
                        ${guideData.hourlyRate}/hr
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-secondary/10">
              <p className="font-paragraph text-lg text-foreground/70 mb-6">
                No guide profile found. Please complete your guide onboarding.
              </p>
              <a
                href="/guide-onboarding"
                className="inline-block px-8 py-4 bg-secondary text-secondary-foreground font-paragraph text-lg rounded-full hover:bg-secondary/90 transition-all"
              >
                Complete Profile
              </a>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
