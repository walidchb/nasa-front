import { create } from 'zustand';

import { fetchData } from '../services/api.ts';

interface AppState {
  images: any;

  errorGetImages: string | null;

  loadingImages: boolean;
  globalAlertManage: {
    message: string;
    type: 'success' | 'error' | null;
  };
  setImages: (images: any) => void;
  setGlobalAlertManage: (
    message: string,
    type: 'success' | 'error' | null
  ) => void;

  fetchDataImages: (endpoint: string) => Promise<void>;
}

const MarsRoverStore = create<AppState>(set => ({
  images: [],
  errorGetImages: null,
  loadingImages: false,
  globalAlertManage: {
    message: '',
    type: null,
  },
  fetchDataImages: async endpoint => {
    try {
      set({ loadingImages: true, errorGetImages: null });
      const response = await fetchData(endpoint);
      set({ images: response.data, loadingImages: false });
    } catch (error: any) {
      set({
        globalAlertManage: { message: error.message, type: 'error' },
        errorGetImages: error.message,
        loadingImages: false,
      });
      setTimeout(() => {
        set({
          globalAlertManage: { message: '', type: null },
        });
      }, 2000);
    }
  },

  setGlobalAlertManage: (message: string, type: 'success' | 'error' | null) => {
    set({ globalAlertManage: { message, type } });
  },
  setImages(images) {
    set({ images: images });
  },
}));

export default MarsRoverStore;
