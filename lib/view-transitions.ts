"use client";

type Handler = () => void | Promise<void>;

export function startViewTransition(update: Handler) {
  // Fallback: if the browser doesn't support it, just run the update.
  const doc = document as Document & {
    startViewTransition?: (cb: Handler) => { finished: Promise<void> };
  };
  if (typeof doc.startViewTransition !== "function") {
    return Promise.resolve(update());
  }
  const transition = doc.startViewTransition(update);
  return transition.finished.catch(() => undefined);
}
