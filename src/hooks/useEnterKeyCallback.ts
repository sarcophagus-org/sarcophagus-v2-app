import { useEffect } from 'react';

/**
 * Adds an "Enter" keydown event listener
 */
export function useEnterKeyCallback(callback: Function) {
  useEffect(() => {
    const keyDownHandler = (event: any) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [callback]);
}
