import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AboutContent, TeamMember } from '../../core/models/api.models';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
  private api = inject(ApiService);

  about = signal<AboutContent | null>(null);
  team = signal<TeamMember[]>([]);

  stats = [
    { value: '20+', label: 'Years Experience' },
    { value: '500+', label: 'Clients Served' },
    { value: '1000+', label: 'Projects Done' },
    { value: '50+', label: 'Certified Engineers' },
  ];

  certifications = ['ASNT Level III', 'ISO 9001:2015', 'NABL Accredited', 'PCN Certified'];

  industries = [
    { icon: '✈️', name: 'Aerospace' },
    { icon: '🛡️', name: 'Defense' },
    { icon: '⛽', name: 'Oil & Gas' },
    { icon: '⚡', name: 'Power Plant' },
    { icon: '🏭', name: 'Steel Plant' },
    { icon: '🏗️', name: 'Cement Plant' },
    { icon: '🚂', name: 'Railway' },
    { icon: '⚓', name: 'Marine' },
    { icon: '⛏️', name: 'Mining' },
    { icon: '🌉', name: 'Infrastructure' },
  ];

  ngOnInit(): void {
    this.api.getAbout().subscribe({ next: r => r.data && this.about.set(r.data) });
    this.api.getTeam().subscribe({ next: r => r.data && this.team.set(r.data) });
  }
}
