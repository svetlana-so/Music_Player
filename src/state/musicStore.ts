import { create } from 'zustand'
import { produce } from 'immer'
import { persist, devtools } from 'zustand/middleware'
import { loadSongs } from '../utils/loadSongs'

export interface Song {
  id: string
  title: string
  artist: string
  artCover: string
  duration: number
  src: string
  isFavorite: boolean
}

interface MusicState {
  currentSong: Song | null
  playlist: Song[]
  volume: number
  playPause: () => void
  skipTrack: (direction: 'next' | 'previous') => void
  adjustVolume: (level: number) => void
  toggleFavorite: (songId: string) => void
  setCurrentSong: (song: Song) => void
  isPlaying: boolean
  favoriteSongs: Song[]
}

const useMusicStore = create<MusicState>()(
  devtools(
    persist(
      (set, get) => ({
        currentSong: null,
        playlist: [],
        volume: 1,
        isPlaying: false,
        favoriteSongs: [],
        playPause: () => {
          const { isPlaying, currentSong } = get()
          if (currentSong) {
            set({ isPlaying: !isPlaying })
          }
        },
        skipTrack: (direction: string) => {
          const { playlist, currentSong } = get();
          const currentIndex = playlist.findIndex(song => song.id === currentSong?.id);
          const newIndex = (currentIndex + (direction === 'next' ? 1 : -1) + playlist.length) % playlist.length;
          const newSong = playlist[newIndex];
          set({ currentSong: newSong, isPlaying: true });
        },
        adjustVolume: level => {
          set({ volume: level })
        },
        toggleFavorite: (songId: string) => {
          set(
            produce((draft: MusicState) => {
              const song = draft.playlist.find(song => song.id === songId)
              if (song) {
                song.isFavorite = !song.isFavorite
                const favoriteIndex = draft.favoriteSongs.findIndex(
                  favSong => favSong.id === songId,
                )
                if (song.isFavorite && favoriteIndex === -1) {
                  draft.favoriteSongs.push(song)
                }
                if (!song.isFavorite && favoriteIndex !== -1) {
                  draft.favoriteSongs.splice(favoriteIndex, 1)
                }
              }
            }),
          )
        },
        setCurrentSong: song => {
          set({ currentSong: song, isPlaying: true })
        },
      }),
      {
        name: 'music-store',
      },
    ),
  ),
)

const setPlaylist = async () => {
  const { playlist } = useMusicStore.getState()

  // Only set the playlist if it is empty (prevents overwriting persisted state)
  // I dont know if its the right way to fix the bug
  if (!playlist || playlist.length === 0) {
    const songs = await loadSongs()
    useMusicStore.setState({ playlist: songs })
  }
}

setPlaylist()

export default useMusicStore
