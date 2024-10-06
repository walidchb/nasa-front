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

  fetchDataImages: (endpoint: string) => Promise<void>;
  setGlobalAlertManage: (
    message: string,
    type: 'success' | 'error' | null
  ) => void;
}

const ApodStore = create<AppState>(set => ({
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
      set({ errorGetImages: error.message, loadingImages: false });
    }
  },
  setImages(images) {
    set({ images: images });
  },

  setGlobalAlertManage: (message: string, type: 'success' | 'error' | null) => {
    set({ globalAlertManage: { message, type } });
  },
}));

export default ApodStore;
