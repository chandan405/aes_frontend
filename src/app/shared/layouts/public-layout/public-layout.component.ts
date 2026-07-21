import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './public-layout.component.html',
})
export class PublicLayoutComponent implements OnInit {
  private router = inject(Router);
  private seo = inject(SeoService);

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.updateMetadataForUrl(url);
    });

    // Set initial tags
    this.updateMetadataForUrl(this.router.url);
  }

  private updateMetadataForUrl(url: string) {
    // Avoid overriding if we are on a parameterized service detail page (let the component handle it)
    if (url.startsWith('/services/')) {
      const segments = url.split('/');
      if (segments.length > 2 && segments[2] !== '') {
        return;
      }
    }

    let title = 'AES - Professional NDT Inspection & Training Services';
    let description = 'Abinash Engineering Services (AES) is a leading provider of Non-Destructive Testing (NDT) inspection, training, and engineering consultancy in India. Level II and Level III certified.';
    let keywords = 'NDT testing, radiographic testing, ultrasonic testing, magnetic particle testing, dye penetrant testing, NDT training, ASNT Level II, Abinash Engineering Services';

    if (url.includes('/about')) {
      title = 'About Us - Abinash Engineering Services';
      description = 'Learn about Abinash Engineering Services (AES), our vision, mission, quality policy, and our certified team of ASNT NDT experts.';
      keywords = 'about AES, NDT experts, ASNT Level III, quality assurance, Abinash Engineering Services';
    } else if (url.includes('/services') && !url.startsWith('/services/')) {
      title = 'NDT Services - Abinash Engineering Services';
      description = 'Explore our comprehensive range of NDT inspection services, including RT, UT, MPT, DPT, thickness measurement, and corrosion mapping.';
      keywords = 'NDT services, radiographic inspection, ultrasonic inspection, crack detection, metal inspection';
    } else if (url.includes('/training')) {
      title = 'NDT Training - Abinash Engineering Services';
      description = 'Join our professional NDT training courses. Get certified in ASNT Level I & II in RT, UT, MT, PT, VT, and ET. Highly experienced trainers.';
      keywords = 'NDT training, ASNT certification, NDT courses, Level II certification, UT training, RT training';
    } else if (url.includes('/gallery')) {
      title = 'Gallery - Abinash Engineering Services';
      description = 'View our gallery of on-site NDT testing inspections, training batches, lab facilities, and certified testing projects.';
      keywords = 'NDT testing photos, training gallery, engineering project pictures, AES gallery';
    } else if (url.includes('/clients')) {
      title = 'Our Clients - Abinash Engineering Services';
      description = 'AES serves leading companies in petrochemicals, power, manufacturing, and heavy engineering across India.';
      keywords = 'AES clients, NDT inspection clients, engineering partners, corporate clients';
    } else if (url.includes('/contact')) {
      title = 'Contact Us - Abinash Engineering Services';
      description = 'Get in touch with AES for NDT inspection services, training inquiries, quotes, or support. Office located in Odisha, India.';
      keywords = 'contact AES, NDT quote, training inquiry, contact details, Bhubaneswar office';
    }

    this.seo.updateMetaTags(title, description, keywords);
  }
}
