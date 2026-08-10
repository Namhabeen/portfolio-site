import { useEffect, useRef, useState } from 'react';

let sharedObserver;
const callbacks = new WeakMap();

function getObserver() {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const onReveal = callbacks.get(entry.target);
          if (!onReveal) return;
          onReveal();
          sharedObserver.unobserve(entry.target);
          callbacks.delete(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
  }
  return sharedObserver;
}

/**
 * Reveals an element (fade-in + slide-up) the first time it scrolls into
 * view, via a single shared IntersectionObserver instance reused by every
 * caller. Once revealed, the element is unobserved and stays visible.
 *
 * @returns {[import('react').RefCallback<Element>, boolean]} A ref to attach to the target element, and whether it has been revealed.
 */
export function useScrollReveal() {
  const elRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = getObserver();
    callbacks.set(el, () => setVisible(true));
    observer.observe(el);

    return () => {
      observer.unobserve(el);
      callbacks.delete(el);
    };
  }, []);

  return [elRef, visible];
}
