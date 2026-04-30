export const haptics = {
  vibrate: (pattern: number | number[]) => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignore devices or browsers that don't support vibrate
      }
    }
  },
  click: () => haptics.vibrate(10),
  shutter: () => haptics.vibrate(40),
  success: () => haptics.vibrate([30, 50, 30]),
  error: () => haptics.vibrate([50, 100, 50, 100]),
};
