import { Component, ChangeDetectionStrategy, input, viewChild, ElementRef, effect, signal, inject, afterNextRender } from '@angular/core';
import { Track } from '../../models/track.model';
import { AudioPlayerService } from '../../services/audio-player.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-track-card',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './track-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackCardComponent {
  track = input.required<Track>();
  
  audioEl = viewChild.required<ElementRef<HTMLAudioElement>>('audioPlayer');
  videoEl = viewChild.required<ElementRef<HTMLVideoElement>>('videoPlayer');
  wavyPath = viewChild.required<ElementRef<SVGPathElement>>('wavyProgress');

  isPlaying = signal(false);
  progress = signal(0);
  downloadState = signal<'idle' | 'downloading' | 'downloaded'>('idle');
  downloadProgress = signal(0);
  pathLength = signal(0);
  
  private audioPlayerService = inject(AudioPlayerService);

  constructor() {
    effect(() => {
      const currentlyPlayingId = this.audioPlayerService.currentlyPlayingId();
      const myId = this.track().id;

      if (currentlyPlayingId === myId) {
        if (!this.isPlaying()) {
          this.play();
        }
      } else {
        if (this.isPlaying()) {
          this.pause();
        }
      }
    });

    effect(() => {
      const progressValue = this.progress();
      const length = this.pathLength();
      if (length > 0) {
        const offset = length - (progressValue / 100) * length;
        this.wavyPath().nativeElement.style.strokeDashoffset = `${offset}`;
      }
    });
    
    afterNextRender(() => {
      const length = this.wavyPath().nativeElement.getTotalLength();
      this.pathLength.set(length);
      this.wavyPath().nativeElement.style.strokeDasharray = `${length}`;
      this.wavyPath().nativeElement.style.strokeDashoffset = `${length}`;
    });
  }

  togglePlay() {
    this.audioPlayerService.playTrack(this.track().id);
  }

  private play() {
    this.isPlaying.set(true);
    this.audioEl().nativeElement.play();
    this.videoEl().nativeElement.play();
  }

  private pause() {
    this.isPlaying.set(false);
    this.audioEl().nativeElement.pause();
    this.videoEl().nativeElement.pause();
  }

  onTimeUpdate() {
    const audio = this.audioEl().nativeElement;
    if (audio.duration) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      this.progress.set(progressPercent);
    }
  }

  onAudioEnded() {
    this.pause();
    this.progress.set(0);
    this.audioEl().nativeElement.currentTime = 0;
    this.videoEl().nativeElement.currentTime = 0;
    // Let the service know we are done
    if(this.audioPlayerService.currentlyPlayingId() === this.track().id) {
        this.audioPlayerService.stopAll();
    }
  }

  startDownload(event: Event) {
    event.preventDefault();
    if (this.downloadState() !== 'idle') {
      return;
    }

    this.downloadState.set('downloading');
    this.downloadProgress.set(0);
    
    // Trigger actual download if URL exists
    if (this.track().downloadUrl) {
      const link = document.createElement('a');
      link.href = this.track().downloadUrl!;
      link.setAttribute('download', `${this.track().title}.mp3`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Simulate progress
    const interval = setInterval(() => {
      this.downloadProgress.update(p => {
        const newProgress = p + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          this.downloadState.set('downloaded');
          return 100;
        }
        return newProgress;
      });
    }, 100);
  }
}