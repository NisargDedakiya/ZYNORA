import Link from "next/link";
import { Button } from "@/components/Button";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
    return (
        <div className="bg-primary min-h-[80vh] flex items-center justify-center p-6">
            <div className="bg-white p-10 max-w-lg w-full text-center shadow-sm border border-gray-100">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-heading text-text-dark mb-4">Payment Successful!</h1>
                <p className="text-gray-600 mb-8">
                    Your order has been placed successfully. You will receive an email confirmation shortly with your order details.
                </p>
                <Link href="/shop">
                    <Button fullWidth>Continue Shopping</Button>
                </Link>
            </div>
        </div>
    );
}
