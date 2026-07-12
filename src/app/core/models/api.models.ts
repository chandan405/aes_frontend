// ── API Models ─────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
}

// ── Auth ───────────────────────────────────────────────────────────────────
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// ── Banner ─────────────────────────────────────────────────────────────────
export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

// ── About ──────────────────────────────────────────────────────────────────
export interface AboutContent {
  _id: string;
  companyProfile: string;
  vision: string;
  mission: string[];
  industries: string[];
  stats: {
    experience: string;
    customers: string;
    projects: string;
    engineers: string;
  };
  aboutImageUrl?: string;
  visionImageUrl?: string;
}

// ── Team ───────────────────────────────────────────────────────────────────
export interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  qualification?: string;
  experience?: string;
  description?: string;
  skills: string[];
  imageUrl?: string;
  order: number;
  status: 'ACTIVE' | 'INACTIVE';
}

// ── Service ────────────────────────────────────────────────────────────────
export interface ServiceImage {
  imageUrl: string;
  publicId?: string;
  caption?: string;
}

export interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  applications: string[];
  images: ServiceImage[];
  icon?: string;
  order: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

// ── Training ───────────────────────────────────────────────────────────────
export interface Training {
  _id: string;
  name: string;
  duration: string;
  fees: number;
  startDate?: string;
  endDate?: string;
  trainerName: string;
  mode: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  description: string;
  syllabus: string[];
  certificateInfo?: string;
  imageUrl?: string;
  maxStudents?: number;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  createdAt: string;
}

// ── Training Registration ───────────────────────────────────────────────────
export interface TrainingRegistration {
  _id: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  company: string;
  trainingId: string;
  trainingName: string;
  message?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  createdAt: string;
}

// ── Industry ───────────────────────────────────────────────────────────────
export interface Industry {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  order: number;
  status: 'ACTIVE' | 'INACTIVE';
}

// ── Client ─────────────────────────────────────────────────────────────────
export interface Client {
  _id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  website?: string;
  order: number;
  status: 'ACTIVE' | 'INACTIVE';
}

// ── Gallery ────────────────────────────────────────────────────────────────
export type GalleryCategory =
  | 'NDT Inspection'
  | 'Advanced Testing'
  | 'Civil Testing'
  | 'Training Gallery'
  | 'Equipment Gallery'
  | 'Client Projects'
  | 'Company Events';

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'NDT Inspection',
  'Advanced Testing',
  'Civil Testing',
  'Training Gallery',
  'Equipment Gallery',
  'Client Projects',
  'Company Events',
];

export interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  category: GalleryCategory;
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  displayOrder: number;
  isFeatured: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

// ── Contact ────────────────────────────────────────────────────────────────
export interface ContactEnquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  serviceRequired?: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'CLOSED';
  adminNotes?: string;
  createdAt: string;
}

// ── Dashboard ──────────────────────────────────────────────────────────────
export interface DashboardStats {
  stats: {
    totalServices: number;
    totalTrainings: number;
    totalRegistrations: number;
    pendingRegistrations: number;
    totalEnquiries: number;
    newEnquiries: number;
    totalGallery: number;
    totalTeam: number;
    totalClients: number;
  };
  recentRegistrations: Partial<TrainingRegistration>[];
  recentEnquiries: Partial<ContactEnquiry>[];
  recentGallery: Partial<GalleryImage>[];
}

// ── User ───────────────────────────────────────────────────────────────────
export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}
