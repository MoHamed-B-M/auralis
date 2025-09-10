
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  currentlyPlayingId = signal<number | null>(null);

  playTrack(id: number) {
    if (this.currentlyPlayingId() === id) {
      // If the same track is clicked, pause it
      this.currentlyPlayingId.set(null);
    } else {
      this.currentlyPlayingId.set(id);
    }
  }

  stopAll() {
    this.currentlyPlayingId.set(null);
  }
}