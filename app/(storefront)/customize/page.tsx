import { redirect } from 'next/navigation';

export const metadata = {
    title: "Design Your Diamond Ring | ZYNORA LUXE",
    description: "Create your own custom engagement ring with certified diamonds and premium gold.",
};

export default function CustomizePage() {
    redirect('/customizer/step-1-setting');
}
