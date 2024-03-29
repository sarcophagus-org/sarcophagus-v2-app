import { History, Transition } from 'history';
import { useContext, useEffect } from 'react';
import { Navigator } from 'react-router';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

type ExtendNavigator = Navigator & Pick<History, 'block'>;

function useBlocker(blocker: (tx: Transition) => void) {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    const unblock = (navigator as ExtendNavigator).block((tx: Transition) => {
      const autoUnblockingTx: Transition = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker]);
}

export default function usePrompt(route: (nextLocation: Transition) => boolean) {
  const blocker = (tx: Transition) => {
    return route(tx) && tx.retry();
  };

  useBlocker(blocker);
}
