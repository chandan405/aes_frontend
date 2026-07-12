import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  certifications = ['ASNT', 'ISO', 'NDT'];

  quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Training', path: '/training' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  services = [
    'Radiographic Testing (RT)',
    'Ultrasonic Testing (UT)',
    'Magnetic Particle Testing (MT)',
    'Dye Penetrant Testing (PT)',
    'Phased Array (PAUT)',
    'Corrosion Mapping',
  ];
}
