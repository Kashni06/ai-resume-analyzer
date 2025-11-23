import { create } from "zustand";

// ---------- TYPES ----------
interface PuterUser {
  id: string;
  name: string;
  email: string;
}

interface FSItem {
  path: string;
  name: string;
}

interface ChatMessage {
  role: string;
  content: any;
}

interface PuterChatOptions {
  model?: string;
}

interface AIResponse {
  message: { content: any };
}

interface KVItem {
  key: string;
  value: string;
}

interface PuterStore {
  isLoading: boolean;
  error: string | null;
  puterReady: boolean;

  auth: {
    user: PuterUser | null;
    isAuthenticated: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    checkAuthStatus: () => Promise<boolean>;
    getUser: () => PuterUser | null;
  };

  fs: {
    write: (path: string, data: string | File | Blob) => Promise<File | undefined>;
    read: (path: string) => Promise<Blob | undefined>;
    readDir: (path: string) => Promise<FSItem[] | undefined>;
    upload: (file: File[] | Blob[]) => Promise<FSItem | undefined>;
    delete: (path: string) => Promise<void>;
  };

  ai: {
    chat: (
      prompt: string | ChatMessage[],
      imageURL?: string | PuterChatOptions,
      testMode?: boolean,
      options?: PuterChatOptions
    ) => Promise<AIResponse | undefined>;

    feedback: (path: string, message: string) => Promise<AIResponse | undefined>;

    img2txt: (image: string | File | Blob, testMode?: boolean) => Promise<string | undefined>;
  };

  kv: {
    get: (key: string) => Promise<string | null | undefined>;
    set: (key: string, value: string) => Promise<boolean | undefined>;
    delete: (key: string) => Promise<boolean | undefined>;
    list: (pattern: string, returnValues?: boolean) => Promise<string[] | KVItem[] | undefined>;
    flush: () => Promise<boolean | undefined>;
  };

  init: () => void;
  clearError: () => void;
}


// ---------- GLOBAL DECLARATION ----------
declare global {
  interface Window {
    puter: any;
  }
}


// ---------- SAFELY GET PUTER ----------
const getPuter = () => {
  if (typeof window === "undefined") return null;
  return window.puter ?? null;
};


// ---------- STORE ----------
export const usePuterStore = create<PuterStore>((set, get) => {
  const setError = (msg: string) => {
    set({
      error: msg,
      isLoading: false,
      auth: {
        ...get().auth,
        user: null,
        isAuthenticated: false,
      },
    });
  };

  const checkAuthStatus = async () => {
    const puter = getPuter();
    if (!puter) return false;

    set({ isLoading: true, error: null });

    try {
      const signed = await puter.auth.isSignedIn();

      if (signed) {
        const user = await puter.auth.getUser();
        set({
          auth: {
            ...get().auth,
            user,
            isAuthenticated: true,
            getUser: () => user,
          },
          isLoading: false,
        });
        return true;
      }

      set({
        auth: {
          ...get().auth,
          user: null,
          isAuthenticated: false,
          getUser: () => null,
        },
        isLoading: false,
      });

      return false;
    } catch {
      setError("Failed to check auth status");
      return false;
    }
  };

  const signIn = async () => {
    const puter = getPuter();
    if (!puter) return setError("Puter.js not ready");

    try {
      await puter.auth.signIn();
      await checkAuthStatus();
    } catch {
      setError("Sign in failed");
    }
  };

  const signOut = async () => {
    const puter = getPuter();
    if (!puter) return setError("Puter.js not ready");

    try {
      await puter.auth.signOut();

      set({
        auth: {
          ...get().auth,
          user: null,
          isAuthenticated: false,
        },
        isLoading: false,
      });
    } catch {
      setError("Sign out failed");
    }
  };

  const refreshUser = async () => {
    const puter = getPuter();
    if (!puter) return setError("Puter.js not ready");

    try {
      const user = await puter.auth.getUser();
      set({
        auth: {
          ...get().auth,
          user,
          isAuthenticated: true,
          getUser: () => user,
        },
      });
    } catch {
      setError("Failed to refresh user");
    }
  };

  const init = () => {
    const puter = getPuter();
    if (puter) {
      set({ puterReady: true });
      checkAuthStatus();
      return;
    }

    const interval = setInterval(() => {
      if (getPuter()) {
        clearInterval(interval);
        set({ puterReady: true });
        checkAuthStatus();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      if (!getPuter()) setError("Puter.js failed to load");
    }, 10000);
  };

  return {
    isLoading: true,
    error: null,
    puterReady: false,

    auth: {
      user: null,
      isAuthenticated: false,
      signIn,
      signOut,
      refreshUser,
      checkAuthStatus,
      getUser: () => null,
    },

    fs: {
      write: (p, d) => getPuter()?.fs.write(p, d),
      read: (p) => getPuter()?.fs.read(p),
      readDir: (p) => getPuter()?.fs.readdir(p),
      upload: (f) => getPuter()?.fs.upload(f),
      delete: (p) => getPuter()?.fs.delete(p),
    },

    ai: {
      chat: (...args) => getPuter()?.ai.chat(...args),
      feedback: (path, message) =>
        getPuter()?.ai.chat(
          [
            {
              role: "user",
              content: [
                { type: "file", puter_path: path },
                { type: "text", text: message },
              ],
            },
          ],
          { model: "claude-3-7-sonnet" }
        ),
      img2txt: (img, t) => getPuter()?.ai.img2txt(img, t),
    },

    kv: {
      get: (k) => getPuter()?.kv.get(k),
      set: (k, v) => getPuter()?.kv.set(k, v),
      delete: (k) => getPuter()?.kv.delete(k),
      list: (p, rv) => getPuter()?.kv.list(p, rv),
      flush: () => getPuter()?.kv.flush(),
    },

    init,
    clearError: () => set({ error: null }),
  };
});
