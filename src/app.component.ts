
import { Component, ChangeDetectionStrategy, signal, Renderer2, afterNextRender, effect, inject } from '@angular/core';
import { Track } from './models/track.model';
import { TrackCardComponent } from './components/track-card/track-card.component';
import { FeedbackModalComponent } from './components/feedback-modal/feedback-modal.component';
import { AnimateOnVisibleDirective } from './directives/animate-on-visible.directive';
import { IconComponent } from './components/icon/icon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TrackCardComponent, FeedbackModalComponent, AnimateOnVisibleDirective, IconComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onWindowScroll()'
  },
})
export class AppComponent {
  private renderer = inject(Renderer2);
  
  isDarkTheme = signal(false);
  isScrollTopVisible = signal(false);
  isFeedbackModalOpen = signal(false);
  currentColor = signal('#6C5BE5');
  
  private themeModule: any = null;

  tracks = signal<Track[]>([
    {
      id: 1,
      title: 'A Song for a Friend',
      description: 'A melancholic piano piece with deep bass and sound textures.',
      imageUrl: 'https://picsum.photos/seed/friend/600/400',
      audioUrl: 'https://cdn.pixabay.com/audio/2022/11/23/audio_852f205563.mp3',
      videoUrl: 'https://videos.pexels.com/video-files/853874/853874-hd_1280_720_25fps.mp4',
    },
    {
      id: 2,
      title: 'Cyberpunk Drive',
      description: 'A synthwave anthem with a pulsating beat, perfect for a neon-lit cruise.',
      imageUrl: 'https://picsum.photos/seed/cyberpunk/600/400',
      audioUrl: 'https://cdn.pixabay.com/audio/2024/05/08/audio_651911a196.mp3',
      videoUrl: 'https://videos.pexels.com/video-files/3129578/3129578-hd_1280_720_30fps.mp4',
      downloadUrl: 'https://cdn.pixabay.com/audio/2024/05/08/audio_651911a196.mp3',
    },
    {
      id: 3,
      title: 'Calm Sea',
      description: 'A serene track with field recordings of waves and gentle piano chords.',
      imageUrl: 'https://picsum.photos/seed/sea/600/400',
      audioUrl: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2dee682a12.mp3',
      videoUrl: 'https://videos.pexels.com/video-files/3248384/3248384-hd_1280_720_24fps.mp4',
    },
    {
      id: 4,
      title: 'Forest Whispers',
      description: 'A tranquil ambient piece with sounds of a forest and an ethereal synth pad.',
      imageUrl: 'https://picsum.photos/seed/forest/600/400',
      audioUrl: 'https://cdn.pixabay.com/audio/2022/08/27/audio_574e95155f.mp3',
      videoUrl: 'https://videos.pexels.com/video-files/1586562/1586562-hd_1280_720_30fps.mp4',
    },
    {
      id: 5,
      title: 'Lofi Study Beats',
      description: 'A classic lofi hip-hop track with a chill, head-nodding beat.',
      imageUrl: 'https://picsum.photos/seed/lofi/600/400',
      audioUrl: 'https://cdn.pixabay.com/audio/2022/05/23/audio_5a17dc71a2.mp3',
      videoUrl: 'https://videos.pexels.com/video-files/7127450/7127450-hd_1280_720_25fps.mp4',
    },
    {
      id: 6,
      title: 'Cosmic Journey',
      description: 'A sprawling, atmospheric soundscape perfect for a journey through space.',
      imageUrl: 'https://picsum.photos/seed/cosmic/600/400',
      audioUrl: 'https://cdn.pixabay.com/audio/2022/03/22/audio_61614713c7.mp3',
      videoUrl: 'https://videos.pexels.com/video-files/3014029/3014029-hd_1280_720_24fps.mp4',
    },
  ]);

  constructor() {
    this.isDarkTheme.set(window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false);
    
    afterNextRender(async () => {
      try {
        this.themeModule = await import('https://cdn.jsdelivr.net/npm/@material/material-color-utilities@0.2.1/+esm');
        this.updateTheme(this.currentColor(), this.isDarkTheme());
      } catch (e) {
        console.error('Could not load theme module', e);
      }
    });

    effect(() => {
      this.updateTheme(this.currentColor(), this.isDarkTheme());
    });
  }

  toggleTheme() {
    this.isDarkTheme.update(value => !value);
  }

  setPrimaryColor(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.currentColor.set(color);
  }

  private hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }

  private updateTheme(color: string, isDark: boolean) {
    if (isDark) {
      this.renderer.addClass(document.documentElement, 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
    }

    if (!this.themeModule) {
      document.documentElement.style.setProperty('--md-sys-color-primary', color);
      document.documentElement.style.setProperty('--primary-rgb', this.hexToRgb(color));
      return;
    }
    
    const { argbFromHex, themeFromSourceColor, applyTheme, hexFromArgb } = this.themeModule;
    const sourceColor = argbFromHex(color);
    const theme = themeFromSourceColor(sourceColor);
    applyTheme(theme, { target: document.documentElement, dark: isDark });

    const scheme = isDark ? theme.schemes.dark : theme.schemes.light;
    
    const primaryHex = hexFromArgb(scheme.primary);
    const tertiaryHex = hexFromArgb(scheme.tertiary);
    const backgroundHex = hexFromArgb(scheme.background);
    const onBackgroundHex = hexFromArgb(scheme.onBackground);

    document.documentElement.style.setProperty('--primary-rgb', this.hexToRgb(primaryHex));
    document.documentElement.style.setProperty('--tertiary-rgb', this.hexToRgb(tertiaryHex));
    document.documentElement.style.setProperty('--background-rgb', this.hexToRgb(backgroundHex));
    document.documentElement.style.setProperty('--on-background-rgb', this.hexToRgb(onBackgroundHex));
  }

  onWindowScroll() {
    const visible = window.scrollY > 300;
    if(this.isScrollTopVisible() !== visible){
      this.isScrollTopVisible.set(visible);
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openFeedbackModal() {
    this.isFeedbackModalOpen.set(true);
  }

  closeFeedbackModal() {
    this.isFeedbackModalOpen.set(false);
  }
}
