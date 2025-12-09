import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Tours } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { Plus, Edit, Trash2, MapPin, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function GuideDashboardPage() {
  const [tours, setTours] = useState<Tours[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTour, setEditingTour] = useState<Tours | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Omit<Tours, 'nextAvailableDate'>> & { nextAvailableDate?: string }>({
    tourName: '',
    tourDescription: '',
    location: '',
    pricePerPerson: 0,
    mainImage: '',
    durationHours: 0,
    nextAvailableDate: '',
    whatsIncluded: '',
  });

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    setLoading(true);
    const { items } = await BaseCrudService.getAll<Tours>('tours');
    setTours(items);
    setLoading(false);
  };

  const handleCreateTour = () => {
    setEditingTour(null);
    setFormData({
      tourName: '',
      tourDescription: '',
      location: '',
      pricePerPerson: 0,
      mainImage: '',
      durationHours: 0,
      nextAvailableDate: '',
      whatsIncluded: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditTour = (tour: Tours) => {
    setEditingTour(tour);
    setFormData({
      tourName: tour.tourName || '',
      tourDescription: tour.tourDescription || '',
      location: tour.location || '',
      pricePerPerson: tour.pricePerPerson || 0,
      mainImage: tour.mainImage || '',
      durationHours: tour.durationHours || 0,
      nextAvailableDate: tour.nextAvailableDate ? new Date(tour.nextAvailableDate).toISOString().split('T')[0] : '',
      whatsIncluded: tour.whatsIncluded || '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteTour = async (tourId: string) => {
    if (confirm('Are you sure you want to delete this tour?')) {
      await BaseCrudService.delete('tours', tourId);
      loadTours();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTour) {
      await BaseCrudService.update<Tours>('tours', {
        _id: editingTour._id,
        ...formData,
      });
    } else {
      await BaseCrudService.create('tours', {
        _id: crypto.randomUUID(),
        ...formData,
      });
    }
    
    setIsDialogOpen(false);
    loadTours();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-paragraph text-base text-foreground">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-5xl font-bold text-primary mb-4"
            >
              Guide Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-paragraph text-lg text-foreground"
            >
              Manage your tours and connect with travelers
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button
                  onClick={handleCreateTour}
                  className="px-6 py-3 bg-secondary text-secondary-foreground font-paragraph text-base rounded-full hover:bg-secondary/90 transition-all inline-flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create New Tour
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl font-bold text-primary">
                    {editingTour ? 'Edit Tour' : 'Create New Tour'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  <div>
                    <Label htmlFor="tourName" className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                      Tour Name
                    </Label>
                    <Input
                      id="tourName"
                      value={formData.tourName}
                      onChange={(e) => setFormData({ ...formData, tourName: e.target.value })}
                      required
                      className="font-paragraph"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tourDescription" className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                      Description
                    </Label>
                    <Textarea
                      id="tourDescription"
                      value={formData.tourDescription}
                      onChange={(e) => setFormData({ ...formData, tourDescription: e.target.value })}
                      rows={4}
                      required
                      className="font-paragraph"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location" className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                        className="font-paragraph"
                      />
                    </div>

                    <div>
                      <Label htmlFor="pricePerPerson" className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                        Price per Person ($)
                      </Label>
                      <Input
                        id="pricePerPerson"
                        type="number"
                        value={formData.pricePerPerson}
                        onChange={(e) => setFormData({ ...formData, pricePerPerson: Number(e.target.value) })}
                        required
                        className="font-paragraph"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="durationHours" className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                        Duration (hours)
                      </Label>
                      <Input
                        id="durationHours"
                        type="number"
                        value={formData.durationHours}
                        onChange={(e) => setFormData({ ...formData, durationHours: Number(e.target.value) })}
                        required
                        className="font-paragraph"
                      />
                    </div>

                    <div>
                      <Label htmlFor="nextAvailableDate" className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                        Next Available Date
                      </Label>
                      <Input
                        id="nextAvailableDate"
                        type="date"
                        value={formData.nextAvailableDate}
                        onChange={(e) => setFormData({ ...formData, nextAvailableDate: e.target.value })}
                        required
                        className="font-paragraph"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="mainImage" className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                      Main Image URL
                    </Label>
                    <Input
                      id="mainImage"
                      value={formData.mainImage}
                      onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                      placeholder="https://static.wixstatic.com/media/70fb72_ac625057124b48eab5f8ac29a51883db~mv2.png?originWidth=256&originHeight=192"
                      className="font-paragraph"
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsIncluded" className="font-paragraph text-sm font-semibold text-foreground mb-2 block">
                      What's Included (one item per line)
                    </Label>
                    <Textarea
                      id="whatsIncluded"
                      value={formData.whatsIncluded}
                      onChange={(e) => setFormData({ ...formData, whatsIncluded: e.target.value })}
                      rows={4}
                      placeholder="Professional guide&#10;Transportation&#10;Entrance fees&#10;Refreshments"
                      className="font-paragraph"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-paragraph text-base rounded-full hover:bg-primary/90 transition-all"
                    >
                      {editingTour ? 'Update Tour' : 'Create Tour'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      className="px-6 py-3 border border-primary text-primary font-paragraph text-base rounded-full hover:bg-primary/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Tours List */}
        {tours.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-primary/10">
            <p className="font-paragraph text-lg text-foreground mb-6">You haven't created any tours yet.</p>
            <button
              onClick={handleCreateTour}
              className="px-6 py-3 bg-secondary text-secondary-foreground font-paragraph text-base rounded-full hover:bg-secondary/90 transition-all inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create Your First Tour
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {tours.map((tour, index) => (
              <motion.div
                key={tour._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10 hover:shadow-md transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Tour Image */}
                  {tour.mainImage && (
                    <div className="lg:col-span-3">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden">
                        <Image
                          src={tour.mainImage}
                          alt={tour.tourName || 'Tour'}
                          className="w-full h-full object-cover"
                          width={300}
                        />
                      </div>
                    </div>
                  )}

                  {/* Tour Details */}
                  <div className={tour.mainImage ? 'lg:col-span-7' : 'lg:col-span-10'}>
                    <h3 className="font-heading text-2xl font-bold text-primary mb-3">
                      {tour.tourName}
                    </h3>
                    
                    <p className="font-paragraph text-base text-foreground mb-4 line-clamp-2">
                      {tour.tourDescription}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      {tour.location && (
                        <div className="flex items-center gap-2 text-foreground">
                          <MapPin size={16} className="text-secondary" />
                          <span className="font-paragraph text-sm">{tour.location}</span>
                        </div>
                      )}
                      
                      {tour.durationHours && (
                        <div className="flex items-center gap-2 text-foreground">
                          <Clock size={16} className="text-secondary" />
                          <span className="font-paragraph text-sm">{tour.durationHours} hours</span>
                        </div>
                      )}
                      
                      {tour.pricePerPerson && (
                        <div className="flex items-center gap-2 text-foreground">
                          <DollarSign size={16} className="text-secondary" />
                          <span className="font-paragraph text-sm font-semibold">{tour.pricePerPerson} per person</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-2 flex lg:flex-col gap-2 justify-end">
                    <button
                      onClick={() => handleEditTour(tour)}
                      className="px-4 py-2 border border-primary text-primary font-paragraph text-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-all inline-flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTour(tour._id)}
                      className="px-4 py-2 border border-destructive text-destructive font-paragraph text-sm rounded-full hover:bg-destructive hover:text-destructiveforeground transition-all inline-flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
