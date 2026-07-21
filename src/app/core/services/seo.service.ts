import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  /**
   * Updates page title and key SEO meta tags (Description, Keywords, Open Graph)
   * @param title The page title
   * @param description The page meta description
   * @param keywords Comma-separated keyword string
   * @param ogImage Optional OG Image URL
   */
  updateMetaTags(title: string, description: string, keywords: string, ogImage?: string) {
    // 1. Title
    this.titleService.setTitle(title);

    // 2. Standard Meta Tags
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: keywords });

    // 3. Open Graph (OG) tags for social sharing
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    if (ogImage) {
      this.metaService.updateTag({ property: 'og:image', content: ogImage });
    } else {
      this.metaService.removeTag("property='og:image'");
    }

    // 4. Twitter Card tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    if (ogImage) {
      this.metaService.updateTag({ name: 'twitter:image', content: ogImage });
    } else {
      this.metaService.removeTag("name='twitter:image'");
    }
  }
}
