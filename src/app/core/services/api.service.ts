import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse, Banner, AboutContent, TeamMember, Service, Training,
  TrainingRegistration, Industry, Client, GalleryImage, ContactEnquiry,
  DashboardStats, AdminUser, GalleryCategory
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── Banners ────────────────────────────────────────────────────────────────
  getBanners(): Observable<ApiResponse<Banner[]>> {
    return this.http.get<ApiResponse<Banner[]>>(`${this.api}/banners`);
  }
  getAllBanners(): Observable<ApiResponse<Banner[]>> {
    return this.http.get<ApiResponse<Banner[]>>(`${this.api}/banners/all`);
  }
  createBanner(data: FormData): Observable<ApiResponse<Banner>> {
    return this.http.post<ApiResponse<Banner>>(`${this.api}/banners`, data);
  }
  updateBanner(id: string, data: FormData): Observable<ApiResponse<Banner>> {
    return this.http.put<ApiResponse<Banner>>(`${this.api}/banners/${id}`, data);
  }
  deleteBanner(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/banners/${id}`);
  }
  toggleBannerStatus(id: string): Observable<ApiResponse<Banner>> {
    return this.http.patch<ApiResponse<Banner>>(`${this.api}/banners/${id}/toggle`, {});
  }

  // ── About ──────────────────────────────────────────────────────────────────
  getAbout(): Observable<ApiResponse<AboutContent>> {
    return this.http.get<ApiResponse<AboutContent>>(`${this.api}/about`);
  }
  updateAbout(data: FormData): Observable<ApiResponse<AboutContent>> {
    return this.http.put<ApiResponse<AboutContent>>(`${this.api}/about`, data);
  }

  // ── Team ───────────────────────────────────────────────────────────────────
  getTeam(): Observable<ApiResponse<TeamMember[]>> {
    return this.http.get<ApiResponse<TeamMember[]>>(`${this.api}/team`);
  }
  getAllTeam(): Observable<ApiResponse<TeamMember[]>> {
    return this.http.get<ApiResponse<TeamMember[]>>(`${this.api}/team/all`);
  }
  createTeamMember(data: FormData): Observable<ApiResponse<TeamMember>> {
    return this.http.post<ApiResponse<TeamMember>>(`${this.api}/team`, data);
  }
  updateTeamMember(id: string, data: FormData): Observable<ApiResponse<TeamMember>> {
    return this.http.put<ApiResponse<TeamMember>>(`${this.api}/team/${id}`, data);
  }
  deleteTeamMember(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/team/${id}`);
  }

  // ── Services ───────────────────────────────────────────────────────────────
  getServices(): Observable<ApiResponse<Service[]>> {
    return this.http.get<ApiResponse<Service[]>>(`${this.api}/services`);
  }
  getAllServices(): Observable<ApiResponse<Service[]>> {
    return this.http.get<ApiResponse<Service[]>>(`${this.api}/services/all`);
  }
  getServiceBySlug(slug: string): Observable<ApiResponse<Service>> {
    return this.http.get<ApiResponse<Service>>(`${this.api}/services/slug/${slug}`);
  }
  createService(data: FormData): Observable<ApiResponse<Service>> {
    return this.http.post<ApiResponse<Service>>(`${this.api}/services`, data);
  }
  updateService(id: string, data: FormData): Observable<ApiResponse<Service>> {
    return this.http.put<ApiResponse<Service>>(`${this.api}/services/${id}`, data);
  }
  deleteService(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/services/${id}`);
  }
  toggleServiceStatus(id: string): Observable<ApiResponse<Service>> {
    return this.http.patch<ApiResponse<Service>>(`${this.api}/services/${id}/toggle`, {});
  }

  // ── Trainings ──────────────────────────────────────────────────────────────
  getTrainings(): Observable<ApiResponse<Training[]>> {
    return this.http.get<ApiResponse<Training[]>>(`${this.api}/trainings`);
  }
  getAllTrainings(): Observable<ApiResponse<Training[]>> {
    return this.http.get<ApiResponse<Training[]>>(`${this.api}/trainings/admin/all`);
  }
  getTrainingById(id: string): Observable<ApiResponse<Training>> {
    return this.http.get<ApiResponse<Training>>(`${this.api}/trainings/${id}`);
  }
  createTraining(data: FormData): Observable<ApiResponse<Training>> {
    return this.http.post<ApiResponse<Training>>(`${this.api}/trainings`, data);
  }
  updateTraining(id: string, data: FormData): Observable<ApiResponse<Training>> {
    return this.http.put<ApiResponse<Training>>(`${this.api}/trainings/${id}`, data);
  }
  deleteTraining(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/trainings/${id}`);
  }
  toggleTrainingStatus(id: string): Observable<ApiResponse<Training>> {
    return this.http.patch<ApiResponse<Training>>(`${this.api}/trainings/${id}/toggle`, {});
  }

  // ── Registrations ──────────────────────────────────────────────────────────
  registerForTraining(data: Partial<TrainingRegistration>): Observable<ApiResponse<{ id: string }>> {
    return this.http.post<ApiResponse<{ id: string }>>(`${this.api}/registrations`, data);
  }
  getRegistrations(filters?: { status?: string; trainingId?: string }): Observable<ApiResponse<TrainingRegistration[]>> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.trainingId) params = params.set('trainingId', filters.trainingId);
    return this.http.get<ApiResponse<TrainingRegistration[]>>(`${this.api}/registrations`, { params });
  }
  getRegistrationById(id: string): Observable<ApiResponse<TrainingRegistration>> {
    return this.http.get<ApiResponse<TrainingRegistration>>(`${this.api}/registrations/${id}`);
  }
  updateRegistrationStatus(id: string, status: string, adminNotes?: string): Observable<ApiResponse<TrainingRegistration>> {
    return this.http.patch<ApiResponse<TrainingRegistration>>(`${this.api}/registrations/${id}/status`, { status, adminNotes });
  }

  // ── Industries ─────────────────────────────────────────────────────────────
  getIndustries(): Observable<ApiResponse<Industry[]>> {
    return this.http.get<ApiResponse<Industry[]>>(`${this.api}/industries`);
  }
  getAllIndustries(): Observable<ApiResponse<Industry[]>> {
    return this.http.get<ApiResponse<Industry[]>>(`${this.api}/industries/all`);
  }
  createIndustry(data: FormData): Observable<ApiResponse<Industry>> {
    return this.http.post<ApiResponse<Industry>>(`${this.api}/industries`, data);
  }
  updateIndustry(id: string, data: FormData): Observable<ApiResponse<Industry>> {
    return this.http.put<ApiResponse<Industry>>(`${this.api}/industries/${id}`, data);
  }
  deleteIndustry(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/industries/${id}`);
  }

  // ── Clients ────────────────────────────────────────────────────────────────
  getClients(): Observable<ApiResponse<Client[]>> {
    return this.http.get<ApiResponse<Client[]>>(`${this.api}/clients`);
  }
  getAllClients(): Observable<ApiResponse<Client[]>> {
    return this.http.get<ApiResponse<Client[]>>(`${this.api}/clients/all`);
  }
  createClient(data: FormData): Observable<ApiResponse<Client>> {
    return this.http.post<ApiResponse<Client>>(`${this.api}/clients`, data);
  }
  updateClient(id: string, data: FormData): Observable<ApiResponse<Client>> {
    return this.http.put<ApiResponse<Client>>(`${this.api}/clients/${id}`, data);
  }
  deleteClient(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/clients/${id}`);
  }

  // ── Gallery ────────────────────────────────────────────────────────────────
  getGallery(category?: GalleryCategory): Observable<ApiResponse<GalleryImage[]>> {
    const params = category ? new HttpParams().set('category', category) : undefined;
    return this.http.get<ApiResponse<GalleryImage[]>>(`${this.api}/gallery`, { params });
  }
  getFeaturedGallery(): Observable<ApiResponse<GalleryImage[]>> {
    return this.http.get<ApiResponse<GalleryImage[]>>(`${this.api}/gallery/featured`);
  }
  getAllGallery(filters?: { category?: string; status?: string }): Observable<ApiResponse<GalleryImage[]>> {
    let params = new HttpParams();
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.status) params = params.set('status', filters.status);
    return this.http.get<ApiResponse<GalleryImage[]>>(`${this.api}/gallery/admin/all`, { params });
  }
  uploadGalleryImage(data: FormData): Observable<ApiResponse<GalleryImage>> {
    return this.http.post<ApiResponse<GalleryImage>>(`${this.api}/gallery/upload`, data);
  }
  updateGalleryImage(id: string, data: FormData): Observable<ApiResponse<GalleryImage>> {
    return this.http.put<ApiResponse<GalleryImage>>(`${this.api}/gallery/${id}`, data);
  }
  deleteGalleryImage(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/gallery/${id}`);
  }
  toggleGalleryStatus(id: string): Observable<ApiResponse<GalleryImage>> {
    return this.http.patch<ApiResponse<GalleryImage>>(`${this.api}/gallery/${id}/toggle`, {});
  }

  // ── Contact ────────────────────────────────────────────────────────────────
  submitContact(data: Partial<ContactEnquiry>): Observable<ApiResponse<{ id: string }>> {
    return this.http.post<ApiResponse<{ id: string }>>(`${this.api}/contact`, data);
  }
  getEnquiries(status?: string): Observable<ApiResponse<ContactEnquiry[]>> {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get<ApiResponse<ContactEnquiry[]>>(`${this.api}/contact`, { params });
  }
  updateEnquiryStatus(id: string, status: string, adminNotes?: string): Observable<ApiResponse<ContactEnquiry>> {
    return this.http.patch<ApiResponse<ContactEnquiry>>(`${this.api}/contact/${id}/status`, { status, adminNotes });
  }
  deleteEnquiry(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/contact/${id}`);
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.api}/dashboard/stats`);
  }

  // ── Users ──────────────────────────────────────────────────────────────────
  getUsers(): Observable<ApiResponse<AdminUser[]>> {
    return this.http.get<ApiResponse<AdminUser[]>>(`${this.api}/users`);
  }
  createUser(data: Partial<AdminUser> & { password: string }): Observable<ApiResponse<AdminUser>> {
    return this.http.post<ApiResponse<AdminUser>>(`${this.api}/users`, data);
  }
  updateUser(id: string, data: Partial<AdminUser>): Observable<ApiResponse<AdminUser>> {
    return this.http.put<ApiResponse<AdminUser>>(`${this.api}/users/${id}`, data);
  }
  deleteUser(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/users/${id}`);
  }
}
