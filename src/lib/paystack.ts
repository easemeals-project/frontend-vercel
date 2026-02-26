"use client";

/**
 * Paystack script loading and payment initialization utility
 */
export const loadPaystackScript = (): Promise<void> => {
    return new Promise((resolve) => {
        if ((window as any).PaystackPop) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
    });
};

interface PaystackOptions {
    key: string;
    email: string;
    amount: number; // In Kobo (amount * 100)
    currency?: string;
    ref: string;
    onSuccess: (response: any) => void;
    onCancel: () => void;
}

export const initializePaystack = (options: PaystackOptions) => {
    const handler = (window as any).PaystackPop.setup({
        key: options.key,
        email: options.email,
        amount: Math.round(options.amount * 100), // Convert to Kobo
        currency: options.currency || "NGN",
        ref: options.ref,
        callback: (response: any) => {
            options.onSuccess(response);
        },
        onClose: () => {
            options.onCancel();
        },
    });
    handler.openIframe();
};
