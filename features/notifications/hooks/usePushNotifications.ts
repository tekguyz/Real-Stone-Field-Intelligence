"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export function usePushNotifications() {
  const [isSupported] = useState(() => 
    typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupported) {
      async function checkSubscription() {
        try {
          const registration = await navigator.serviceWorker.ready;
          const sub = await registration.pushManager.getSubscription();
          setSubscription(sub);
          setIsSubscribed(!!sub);
        } catch (err) {
          console.error("Failed to check subscription:", err);
        } finally {
          setLoading(false);
        }
      }

      checkSubscription();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [isSupported]);

  async function subscribeUser() {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const result = await Notification.requestPermission();
      if (result !== "granted") {
        toast.error("Permission denied for notifications");
        return;
      }

      // VAPID public key placeholder
      // In a real app, this is fetched from env or server
      const vapidPublicKey = "BPm7lF4vN_o7EwQ0vH9q0n-K9K8_K9K8_K9K8_K9K8_K9K8_K9K8_K9K8_K9K8_K9K8_K9";
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });

      setSubscription(sub);
      setIsSubscribed(true);
      
      toast.success("Push notifications enabled!");
    } catch (err) {
      console.error("Failed to subscribe:", err);
      toast.error("Failed to enable notifications. Network or browser error.");
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribeUser() {
    setLoading(true);
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        setIsSubscribed(false);
        toast.success("Notifications disabled.");
      }
    } catch (err) {
      console.error("Failed to unsubscribe:", err);
      toast.error("Failed to disable notifications.");
    } finally {
      setLoading(false);
    }
  }

  return {
    isSupported,
    isSubscribed,
    subscription,
    subscribeUser,
    unsubscribeUser,
    loading
  };
}
