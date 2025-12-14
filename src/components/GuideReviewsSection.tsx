import { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { GuideReviews } from '@/entities';

interface GuideReviewsSectionProps {
  guideName: string;
}

export function GuideReviewsSection({ guideName }: GuideReviewsSectionProps) {
  const [reviews, setReviews] = useState<GuideReviews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { items } = await BaseCrudService.getAll<GuideReviews>('guidereviews');
        const guideReviews = items.filter(r => r.guideName === guideName);
        setReviews(guideReviews.sort((a, b) => {
          const dateA = new Date(a.reviewDate || 0).getTime();
          const dateB = new Date(b.reviewDate || 0).getTime();
          return dateB - dateA;
        }));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (guideName) {
      fetchReviews();
    }
  }, [guideName]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0;

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-secondary/10"
    >
      <h3 className="font-heading text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
        <Star size={28} />
        Reviews & Ratings
      </h3>

      {loading ? (
        <div className="text-center py-12">
          <p className="font-paragraph text-foreground/70">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-background rounded-xl">
          <MessageSquare size={48} className="text-secondary/20 mx-auto mb-4" />
          <p className="font-paragraph text-lg text-foreground/70 mb-2">No reviews yet</p>
          <p className="font-paragraph text-sm text-foreground/50">
            Complete bookings to receive reviews from tourists
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Rating Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl border border-secondary/20"
            >
              <p className="font-heading text-5xl font-bold text-secondary mb-2">
                {averageRating.toFixed(1)}
              </p>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.round(averageRating) ? 'text-secondary fill-secondary' : 'text-secondary/20'}
                  />
                ))}
              </div>
              <p className="font-paragraph text-sm text-foreground/70">
                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </motion.div>

            {/* Rating Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3"
            >
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} size={14} className="text-secondary fill-secondary" />
                      ))}
                    </div>
                    <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="h-full bg-secondary rounded-full"
                      />
                    </div>
                    <span className="font-paragraph text-sm text-foreground/70 w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-secondary">Latest Reviews</h4>

            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-background rounded-xl border border-secondary/10 hover:border-secondary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-paragraph font-semibold text-foreground">
                      {review.touristName || 'Anonymous'}
                    </p>
                    <p className="font-paragraph text-xs text-foreground/50">
                      {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString('en-IN') : 'Recently'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < (review.rating || 0) ? 'text-secondary fill-secondary' : 'text-secondary/20'}
                      />
                    ))}
                  </div>
                </div>

                {review.reviewText && (
                  <p className="font-paragraph text-sm text-foreground leading-relaxed">
                    {review.reviewText}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
