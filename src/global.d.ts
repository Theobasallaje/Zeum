declare global {
    interface Window {
      nostr?: {
        async getPublicKey(): string;
        async signEvent(event: { created_at: number, kind: number, tags: string[][], content: string }): Event
        async getRelays(): { [url: string]: {read: boolean, write: boolean} }
      }
    }
  }
  
  export {};