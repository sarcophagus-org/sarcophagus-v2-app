import { DependencyList, useEffect } from 'react';

type Destructor = () => void;
type EffectCallbackAsync = () => Promise<void | Destructor>;

/**
 * Allows an async function to be passed in as an effect for a useEffect hook. useEffectAsync is
 * intended to be used with asynchronous calls (transactions, api calls, etc).
 * WARNING: Destruction is included but is not guaranteed. When setting up a listener, subscriber,
 * etc. it would be best to use a normal useEffect hook.
 * NOTE: The exhaustive deps check may or may not work.
 *
 * This is the same as doing the following:
 * useEffect(() => {
 *   (async () => {
 *     // do something
 *   })();
 * }, [])
 */
export function useAsyncEffect(effect: EffectCallbackAsync, deps?: DependencyList): void {
  useEffect(() => {
    let destructor: void | Destructor;

    (async () => {
      destructor = await effect();
    })();

    // Destroy on unmount
    return () => {
      if (destructor) {
        destructor();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
