import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Diamond, Setting } from '@prisma/client';

export type MetalType = "18K Yellow Gold" | "18K White Gold" | "18K Rose Gold" | "Platinum";

export interface RingConfiguration {
    setting: Setting | null;
    diamond: Diamond | null;
    metalType: MetalType;
    metalPriceAdjustment: number;
}

interface CustomizerStore {
    config: RingConfiguration;
    setSetting: (setting: Setting) => void;
    setDiamond: (diamond: Diamond) => void;
    setMetalType: (metalType: MetalType, priceAdjustment: number) => void;
    getTotalPrice: () => number;
    resetConfig: () => void;
    isSubmitting: boolean;
    setIsSubmitting: (val: boolean) => void;
    isSaved: boolean;
    setIsSaved: (val: boolean) => void;
}

const initialConfig: RingConfiguration = {
    setting: null,
    diamond: null,
    metalType: "18K White Gold",
    metalPriceAdjustment: 0,
};

export const useCustomizerStore = create<CustomizerStore>()(
    persist(
        (set, get) => ({
            config: initialConfig,
            setSetting: (setting) => set((state) => ({ config: { ...state.config, setting } })),
            setDiamond: (diamond) => set((state) => ({ config: { ...state.config, diamond } })),
            setMetalType: (metalType, metalPriceAdjustment) => set((state) => ({ config: { ...state.config, metalType, metalPriceAdjustment } })),
            getTotalPrice: () => {
                const { setting, diamond, metalPriceAdjustment } = get().config;
                const settingPrice = setting?.price || 0;
                const diamondPrice = diamond?.price || 0;
                return settingPrice + diamondPrice + metalPriceAdjustment;
            },
            resetConfig: () => set({ config: initialConfig, isSubmitting: false, isSaved: false }),
            isSubmitting: false,
            setIsSubmitting: (val) => set({ isSubmitting: val }),
            isSaved: false,
            setIsSaved: (val) => set({ isSaved: val }),
        }),
        {
            name: 'ring-customizer-storage',
        }
    )
);
