/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: guides
 * Interface for Guides
 */
export interface Guides {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
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
