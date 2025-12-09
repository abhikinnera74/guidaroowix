import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Guides } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { CheckCircle, ArrowRight, Upload } from 'lucide-react';

const INDIAN_CITIES = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Jaipur',
  'Goa',
  'Kolkata',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Agra',
  'Varanasi',
  'Udaipur',
  'Kochi',
  'Ahmedabad',
];

const SPECIALTIES = [
  'Heritage',
  'Adventure',
  'Food',
  'Culture',
  'Nature',
  'Photography',
  'Spiritual',
  'Shopping',
];

export default function GuideOnboardingPage() {
  const navigate = useNavigate();
  const { member } = useMember();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: member?.contact?.firstName || '',
    email: member?.loginEmail || '',
    phoneNumber: '',
    city: '',
    specialty: '',
    bio: '',
    languagesSpoken: '',
    yearsOfExperience: 0,
    hourlyRate: 500,
    profilePicture: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearsOfExperience' || name === 'hourlyRate' ? Number(value) : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create guide profile
      const guideId = crypto.randomUUID();
      await BaseCrudService.create('guides', {
        _id: guideId,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        city: formData.city,
        specialty: formData.specialty,
        bio: formData.bio,
        languagesSpoken: formData.languagesSpoken,
        yearsOfExperience: formData.yearsOfExperience,
        hourlyRate: formData.hourlyRate,
        profilePicture: formData.profilePicture,
        averageRating: 0,
        isVerified: false, // Pending verification
        isActive: false,   // Not active until verified
      });

      // Show success and redirect
      alert('Your profile has been submitted for verification! You will be notified once approved.');
      navigate('/guide-dashboard');
    } catch (error) {
      console.error('Error creating guide profile:', error);
      alert('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Your personal details' },
    { number: 2, title: 'Professional Info', description: 'Experience & expertise' },
    { number: 3, title: 'Pricing & Availability', description: 'Rates and languages' },
    { number: 4, title: 'Review & Submit', description: 'Confirm your details' },
  ];

  const isStep1Valid = formData.fullName && formData.email && formData.phoneNumber && formData.city;
  const isStep2Valid = formData.specialty && formData.bio && formData.yearsOfExperience > 0;
  const isStep3Valid = formData.hourlyRate > 0 && formData.languagesSpoken;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-5xl font-bold text-primary mb-4">
            Become a Guide
          </h1>
          <p className="font-paragraph text-lg text-foreground/70 max-w-2xl mx-auto">
            Join our community of verified local guides and start earning by sharing your expertise
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center flex-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-heading font-bold text-lg transition-all ${
                    step >= s.number
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {step > s.number ? <CheckCircle size={24} /> : s.number}
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition-all ${
                      step > s.number ? 'bg-primary' : 'bg-primary/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold text-primary mb-1">
              {steps[step - 1].title}
            </h2>
            <p className="font-paragraph text-foreground/70">
              {steps[step - 1].description}
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-primary/10 max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                    className="font-paragraph"
                  />
                </div>

                <div>
                  <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    Email *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    className="font-paragraph"
                    disabled
                  />
                </div>

                <div>
                  <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    required
                    className="font-paragraph"
                  />
                </div>

                <div>
                  <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-primary/20 rounded-lg font-paragraph text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a city</option>
                    {INDIAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    Profile Picture
                  </label>
                  <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-pic"
                    />
                    <label htmlFor="profile-pic" className="cursor-pointer">
                      <Upload size={32} className="text-primary/50 mx-auto mb-2" />
                      <p className="font-paragraph text-sm text-foreground/70">
                        Click to upload your profile picture
                      </p>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Professional Info */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    Specialty *
                  </label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-primary/20 rounded-lg font-paragraph text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select your specialty</option>
                    {SPECIALTIES.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    Bio *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself and your guiding experience..."
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-primary/20 rounded-lg font-paragraph text-base focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    Years of Experience *
                  </label>
                  <Input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    min="0"
                    max="60"
                    required
                    className="font-paragraph"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Pricing & Languages */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    Hourly Rate (₹) *
                  </label>
                  <Input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    min="100"
                    step="100"
                    required
                    className="font-paragraph"
                  />
                  <p className="font-paragraph text-xs text-foreground/70 mt-1">
                    Recommended: ₹500 - ₹2000 per hour
                  </p>
                </div>

                <div>
                  <label className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                    Languages Spoken *
                  </label>
                  <Input
                    type="text"
                    name="languagesSpoken"
                    value={formData.languagesSpoken}
                    onChange={handleInputChange}
                    placeholder="e.g., Hindi, English, Tamil"
                    required
                    className="font-paragraph"
                  />
                  <p className="font-paragraph text-xs text-foreground/70 mt-1">
                    Separate multiple languages with commas
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-lavenderaccent/20 rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70">Full Name</p>
                      <p className="font-heading text-lg font-bold text-primary">{formData.fullName}</p>
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70">Email</p>
                      <p className="font-heading text-lg font-bold text-primary">{formData.email}</p>
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70">Phone</p>
                      <p className="font-heading text-lg font-bold text-primary">{formData.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70">City</p>
                      <p className="font-heading text-lg font-bold text-primary">{formData.city}</p>
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70">Specialty</p>
                      <p className="font-heading text-lg font-bold text-primary">{formData.specialty}</p>
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-foreground/70">Hourly Rate</p>
                      <p className="font-heading text-lg font-bold text-secondary">₹{formData.hourlyRate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-paragraph text-sm text-foreground/70 mb-2">Bio</p>
                    <p className="font-paragraph text-base text-foreground">{formData.bio}</p>
                  </div>
                  <div>
                    <p className="font-paragraph text-sm text-foreground/70 mb-2">Languages</p>
                    <p className="font-paragraph text-base text-foreground">{formData.languagesSpoken}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-paragraph text-sm text-blue-900">
                    ℹ️ Your profile will be reviewed by our team. You'll receive an email once it's verified and approved.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6 border-t border-primary/10">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border border-primary text-primary font-paragraph text-base rounded-full hover:bg-primary/5 transition-all"
                >
                  Previous
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && !isStep1Valid) {
                      alert('Please fill in all required fields');
                      return;
                    }
                    if (step === 2 && !isStep2Valid) {
                      alert('Please fill in all required fields');
                      return;
                    }
                    if (step === 3 && !isStep3Valid) {
                      alert('Please fill in all required fields');
                      return;
                    }
                    setStep(step + 1);
                  }}
                  className="ml-auto px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base rounded-full hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  Next
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-8 py-3 bg-secondary text-secondary-foreground font-paragraph text-base rounded-full hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit for Verification'}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
