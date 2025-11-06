'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/success`,
            },
        });

        if (error) {
            setMessage(error.message || 'An error occurred');
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg">
            <PaymentElement className="mb-6 bg-card" />

            <button
                disabled={isLoading || !stripe || !elements}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
                {isLoading ? 'Processing...' : 'Pay Now'}
            </button>

            {message && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                    {message}
                </div>
            )}
        </form>
    );
}

export default function StripeCheckout({ clientSecret }: { clientSecret: string }) {
    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe' as const,
        },
    };
    return (
        <div className="max-h-[80vh]  bg-card py-12">
            <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
        </div>
    );
}