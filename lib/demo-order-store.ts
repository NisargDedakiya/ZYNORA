import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface DemoCustomerInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}

export interface DemoRingDetails {
    settingId: string;
    settingName: string;
    settingPrice: number;
    settingImage: string | null;
    settingCategory: string;
    diamondId: string;
    diamondShape: string;
    diamondCarat: number;
    diamondCut: string;
    diamondClarity: string;
    diamondColor: string;
    diamondCertification: string;
    diamondPrice: number;
    metalType: string;
    metalPriceAdjustment: number;
    totalPrice: number;
    ringConfigurationId?: string;
}

export interface DemoOrderResult {
    orderId: string;
    displayOrderId: string;
    status: string;
}

interface DemoOrderStore {
    ring: DemoRingDetails | null;
    customer: DemoCustomerInfo | null;
    orderResult: DemoOrderResult | null;
    paymentMethod: string;
    setRing: (ring: DemoRingDetails) => void;
    setCustomer: (customer: DemoCustomerInfo) => void;
    setOrderResult: (result: DemoOrderResult) => void;
    setPaymentMethod: (method: string) => void;
    resetOrder: () => void;
}

export const useDemoOrderStore = create<DemoOrderStore>()(
    persist(
        (set) => ({
            ring: null,
            customer: null,
            orderResult: null,
            paymentMethod: 'upi',
            setRing: (ring) => set({ ring }),
            setCustomer: (customer) => set({ customer }),
            setOrderResult: (result) => set({ orderResult: result }),
            setPaymentMethod: (method) => set({ paymentMethod: method }),
            resetOrder: () => set({ ring: null, customer: null, orderResult: null, paymentMethod: 'upi' }),
        }),
        {
            name: 'demo-order-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
