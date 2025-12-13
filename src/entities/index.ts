/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: bookings
 * Interface for Bookings
 */
export interface Bookings {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType number */
  pickupLongitude?: number;
  /** @wixFieldType text */
  pickupAddress?: string;
  /** @wixFieldType text */
  paymentMethod?: string;
  /** @wixFieldType number */
  pickupLatitude?: number;
  /** @wixFieldType date */
  bookingDate?: Date | string;
  /** @wixFieldType time */
  bookingTime?: any;
  /** @wixFieldType number */
  durationHours?: number;
  /** @wixFieldType number */
  totalPrice?: number;
  /** @wixFieldType text */
  guideReference?: string;
  /** @wixFieldType text */
  touristReference?: string;
  /** @wixFieldType text */
  bookingStatus?: string;
  /** @wixFieldType text */
  guideMemberEmail?: string;
  /** @wixFieldType text */
  touristMemberEmail?: string;
}


/**
 * Collection ID: guidereviews
 * Interface for GuideReviews
 */
export interface GuideReviews {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType number */
  rating?: number;
  /** @wixFieldType text */
  reviewText?: string;
  /** @wixFieldType date */
  reviewDate?: Date | string;
  /** @wixFieldType text */
  touristName?: string;
  /** @wixFieldType text */
  guideName?: string;
}


/**
 * Collection ID: guides
 * Interface for Guides
 */
export interface Guides {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType boolean */
  isVerified?: boolean;
  /** @wixFieldType text */
  role?: string;
  /** @wixFieldType boolean */
  isActive?: boolean;
  /** @wixFieldType text */
  city?: string;
  /** @wixFieldType number */
  averageRating?: number;
  /** @wixFieldType text */
  specialty?: string;
  /** @wixFieldType number */
  hourlyRate?: number;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType image */
  profilePicture?: string;
  /** @wixFieldType text */
  bio?: string;
  /** @wixFieldType text */
  languagesSpoken?: string;
  /** @wixFieldType number */
  yearsOfExperience?: number;
  /** @wixFieldType text */
  memberEmail?: string;
}


/**
 * Collection ID: messages
 * Interface for Messages
 */
export interface Messages {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  senderEmail?: string;
  /** @wixFieldType text */
  receiverEmail?: string;
  /** @wixFieldType text */
  message?: string;
  /** @wixFieldType datetime */
  timestamp?: Date | string;
  /** @wixFieldType text */
  bookingId?: string;
  /** @wixFieldType text */
  senderType?: string;
}


/**
 * Collection ID: notifications
 * Interface for Notifications
 */
export interface Notifications {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  notificationType?: string;
  /** @wixFieldType text */
  message?: string;
  /** @wixFieldType boolean */
  isRead?: boolean;
  /** @wixFieldType datetime */
  createdAt?: Date | string;
  /** @wixFieldType text */
  touristName?: string;
  /** @wixFieldType date */
  bookingDate?: Date | string;
  /** @wixFieldType time */
  bookingTime?: any;
  /** @wixFieldType number */
  bookingDuration?: number;
  /** @wixFieldType number */
  bookingPrice?: number;
}


/**
 * Collection ID: tourists
 * Interface for Tourists
 */
export interface Tourists {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  role?: string;
  /** @wixFieldType text */
  firstName?: string;
  /** @wixFieldType text */
  lastName?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType image */
  profilePicture?: string;
  /** @wixFieldType datetime */
  dateJoined?: Date | string;
  /** @wixFieldType text */
  memberEmail?: string;
}


/**
 * Collection ID: tours
 * Interface for Tours
 */
export interface Tours {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  tourName?: string;
  /** @wixFieldType text */
  tourDescription?: string;
  /** @wixFieldType text */
  location?: string;
  /** @wixFieldType number */
  pricePerPerson?: number;
  /** @wixFieldType image */
  mainImage?: string;
  /** @wixFieldType number */
  durationHours?: number;
  /** @wixFieldType date */
  nextAvailableDate?: Date | string;
  /** @wixFieldType text */
  whatsIncluded?: string;
}
