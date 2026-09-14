import { RazorpayOrder } from "./types";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

/**
 * Dynamically loads the official Razorpay Checkout SDK (checkout.js)
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay Checkout SDK script.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export interface RazorpayCheckoutOptions {
  order: RazorpayOrder;
  userEmail?: string;
  userName?: string;
  onPaymentSuccess: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => Promise<void> | void;
  onDismiss?: () => void;
  onError?: (error: any) => void;
}

/**
 * Opens standard Razorpay Checkout Popup modal
 */
export async function openRazorpayModal({
  order,
  userEmail,
  userName,
  onPaymentSuccess,
  onDismiss,
  onError,
}: RazorpayCheckoutOptions): Promise<void> {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded || !window.Razorpay) {
    if (onError) {
      onError(new Error("Razorpay Checkout SDK is unavailable. Please check your internet connection."));
    }
    return;
  }

  const options = {
    key: order.key_id,
    amount: order.amount,
    currency: order.currency,
    name: order.name || "SEOSensing",
    description: order.description || "AI Search & SEO Sensing Operating System",
    order_id: order.order_id,
    prefill: {
      email: userEmail || order.user_email || "",
      name: userName || "",
    },
    theme: {
      color: "#1D63FF",
      backdrop_color: "rgba(12, 20, 36, 0.8)",
    },
    modal: {
      ondismiss: () => {
        if (onDismiss) onDismiss();
      },
      confirm_close: true,
    },
    handler: async (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => {
      try {
        await onPaymentSuccess(response);
      } catch (err) {
        if (onError) onError(err);
      }
    },
  };

  const rzpInstance = new window.Razorpay(options);
  rzpInstance.on("payment.failed", (response: any) => {
    if (onError) onError(response.error);
  });

  rzpInstance.open();
}
