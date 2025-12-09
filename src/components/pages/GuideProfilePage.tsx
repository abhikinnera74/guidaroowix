import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Guides, GuideReviews } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { Star, MapPin, Globe, Zap, ArrowLeft, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GuideProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<Guides | null>(null);
  const [reviews, setReviews] = useState<GuideReviews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadGuideData(id);
    }
  }, [id]);

  const loadGuideData = async (guideId: string) => {
    setLoading(true);
    const guideData = await BaseCrudService.getById<Guides>('guides', guideId);
    setGuide(guideData);

    // Load reviews for this guide
    const { items } = await BaseCrudService.getAll<GuideReviews>('guidereviews');
    const guideReviews = items.filter(review => review.guideName === guideData.fullName);
    setReviews(guideReviews);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-paragraph text-base text-foreground">Loading guide profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <p className="font-paragraph text-lg text-foreground mb-6">Guide not found</p>
            <button
              onClick={() => navigate('/find-guide')}
              className="px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base rounded-full hover:bg-primary/90 transition-all"
            >
              Back to Guides
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/find-guide')}
          className="flex items-center gap-2 font-paragraph text-base text-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Guides
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Profile */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10 sticky top-24">
              {/* Profile Picture */}
              {guide.profilePicture ? (
                <div className="rounded-xl overflow-hidden mb-6">
                  <Image
                    src={guide.profilePicture}
                    alt={guide.fullName || 'Guide'}
                    className="w-full aspect-square object-cover"
                    width={400}
                  />
                </div>
              ) : (
                <div className="w-full aspect-square bg-lavenderaccent rounded-xl flex items-center justify-center mb-6">
                  <span className="font-heading text-8xl text-primary/30">
                    {guide.fullName?.charAt(0) || 'G'}
                  </span>
                </div>
              )}

              <h1 className="font-heading text-3xl font-bold text-primary mb-2">
                {guide.fullName}
              </h1>

              {guide.specialty && (
                <p className="font-paragraph text-lg text-secondary mb-4">
                  {guide.specialty}
                </p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6 pb-6 border-b border-primary/10">
                <Star size={20} className="text-secondary fill-secondary" />
                <span className="font-heading text-2xl font-bold text-primary">
                  {guide.averageRating?.toFixed(1) || 'N/A'}
                </span>
                <span className="font-paragraph text-sm text-foreground/70">
                  ({reviews.length} reviews)
                </span>
              </div>

              {/* Info */}
              <div className="space-y-4 mb-8">
                {guide.city && (
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70">Location</p>
                      <p className="font-paragraph text-base font-semibold text-foreground">{guide.city}</p>
                    </div>
                  </div>
                )}

                {guide.languagesSpoken && (
                  <div className="flex items-start gap-3">
                    <Globe size={20} className="text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70">Languages</p>
                      <p className="font-paragraph text-base font-semibold text-foreground">{guide.languagesSpoken}</p>
                    </div>
                  </div>
                )}

                {guide.yearsOfExperience && (
                  <div className="flex items-start gap-3">
                    <Zap size={20} className="text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70">Experience</p>
                      <p className="font-paragraph text-base font-semibold text-foreground">{guide.yearsOfExperience} years</p>
                    </div>
                  </div>
                )}

                {guide.hourlyRate && (
                  <div className="flex items-start gap-3">
                    <span className="font-paragraph text-sm text-foreground/70">Hourly Rate</span>
                    <p className="font-heading text-2xl font-bold text-secondary">${guide.hourlyRate}</p>
                  </div>
                )}
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => navigate(`/booking/${guide._id}`)}
                className="w-full px-6 py-4 bg-secondary text-secondary-foreground font-paragraph text-lg rounded-full hover:bg-secondary/90 transition-all"
              >
                Book Now
              </button>
            </div>
          </motion.div>

          {/* Right Column - Bio and Reviews */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {/* Bio */}
            {guide.bio && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10 mb-8">
                <h2 className="font-heading text-2xl font-bold text-primary mb-4">About</h2>
                <p className="font-paragraph text-lg text-foreground leading-relaxed">
                  {guide.bio}
                </p>
              </div>
            )}

            {/* Skills */}
            {guide.specialty && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10 mb-8">
                <h2 className="font-heading text-2xl font-bold text-primary mb-4">Specialties</h2>
                <div className="flex flex-wrap gap-3">
                  {guide.specialty.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-lavenderaccent text-primary font-paragraph text-sm rounded-full"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10">
              <h2 className="font-heading text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <MessageSquare size={24} />
                Reviews ({reviews.length})
              </h2>

              {reviews.length === 0 ? (
                <p className="font-paragraph text-base text-foreground/70 text-center py-8">
                  No reviews yet. Be the first to review this guide!
                </p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="pb-6 border-b border-primary/10 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-heading text-lg font-semibold text-primary">
                            {review.touristName}
                          </p>
                          <p className="font-paragraph text-sm text-foreground/70">
                            {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < (review.rating || 0) ? 'text-secondary fill-secondary' : 'text-primary/20'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="font-paragraph text-base text-foreground">
                        {review.reviewText}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
