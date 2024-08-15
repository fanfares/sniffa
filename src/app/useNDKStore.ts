import { create } from 'zustand';
import NDK, { NDKEvent, NDKFilter, NDKNip07Signer, NDKRelay } from '@nostr-dev-kit/ndk';
import type { NDKUser } from '@nostr-dev-kit/ndk';

// This declaration allows us to access window.nostr without TS errors.
// https://stackoverflow.com/a/47130953
declare global {
    interface Window {
      ndk: NDK;
    }
}

interface NDKState {
  ndk: NDK | null;
  isConnected: boolean;
  initNDK: (relayUrls: string[], useSigner: boolean) => Promise<void>;
  fetchEvent: (filter: NDKFilter) => Promise<NDKEvent | null>;
  fetchEvents: (filter: NDKFilter) => Promise<Set<NDKEvent>>;
  fetchUser: (pubkey: string) => Promise<NDKUser>;
  publish: (event: NDKEvent) => Promise<Set<NDKRelay>>;
  // Add more NDK methods and state types as needed
}

const useNDKStore = create<NDKState>((set, get) => ({
  ndk: null,
  isConnected: false,
  initNDK: async (relayUrls: string[], useSigner = true) => {
    let signer
    try {
      if (useSigner) {
        signer = new NDKNip07Signer(3000)
      }
    } catch (e) {
      // no signer available. 
      // TODO create a new key and store locally
    }
    const ndk = new NDK({ 
      signer,
      explicitRelayUrls: relayUrls,
      autoConnectUserRelays: true,
    });
    await ndk.connect();
    // DEBUG ONLY
    // window.ndk = ndk;
    set({ ndk, isConnected: true });
  },
  fetchEvent: async (filter: NDKFilter) => {
    if (!get().isConnected) throw new Error('NDK not initialized');
    const ndk = get().ndk;
    if (!ndk) throw new Error('NDK is null');
    return await ndk.fetchEvent(filter);
  },
  fetchEvents: async (filter: NDKFilter) => {
    if (!get().isConnected) throw new Error('NDK not initialized');
    const ndk = get().ndk;
    if (!ndk) throw new Error('NDK is null');
    console.log('yeet')
    return await ndk.fetchEvents(filter);
  },
  fetchUser: async (pubkey: string) => {
    if (!get().isConnected) throw new Error('NDK not initialized');
    const ndk = get().ndk;
    if (!ndk) throw new Error('NDK is null');
    const user = ndk.getUser({pubkey});
    const got = await user.fetchProfile();
    console.log('got', got, pubkey)
    return user
  },
  publish: async (event: NDKEvent) => {
    if (!get().isConnected) throw new Error('NDK not initialized');
    const ndk = get().ndk;
    if (!ndk) throw new Error('NDK is null');
    return await ndk.publish(event);
  },
  // Add more NDK methods and state as needed
}));

export default useNDKStore;