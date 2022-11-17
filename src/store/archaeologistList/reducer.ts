import { Actions } from '..';
import { ActionType, SortDirection } from './actions';

export interface ArchaeologistListState {
  diggingFeesSortDirection: SortDirection;
  unwrapsSortDirection: SortDirection;
  failsSortDirection: SortDirection;
  archsSortDirection: SortDirection;
  diggingFeesFilter: string;
  unwrapsFilter: string;
  failsFilter: string;
  archAddressSearch: string;
  showSelectedArchaeologists: boolean;
}

export const archaeologistListInitialState: ArchaeologistListState = {
  diggingFeesSortDirection: SortDirection.NONE,
  unwrapsSortDirection: SortDirection.NONE,
  failsSortDirection: SortDirection.NONE,
  archsSortDirection: SortDirection.NONE,
  diggingFeesFilter: '',
  unwrapsFilter: '',
  failsFilter: '',
  archAddressSearch: '',
  showSelectedArchaeologists: false,
};

export function archaeologistListReducer(
  state: ArchaeologistListState,
  action: Actions
): ArchaeologistListState {
  switch (action.type) {
    case ActionType.SetDiggingFeesSortDirection:
      return { ...state, diggingFeesSortDirection: action.payload.direction };

    case ActionType.SetUnwrapsSortDirection:
      return { ...state, unwrapsSortDirection: action.payload.direction };

    case ActionType.SetFailsSortDirection:
      return { ...state, failsSortDirection: action.payload.direction };

    case ActionType.SetArchsSortDirection:
      return { ...state, archsSortDirection: action.payload.direction };

    case ActionType.SetDiggingFeesFilter:
      return { ...state, diggingFeesFilter: action.payload.filter };

    case ActionType.SetUnwrapsFilter:
      return { ...state, unwrapsFilter: action.payload.filter };

    case ActionType.SetFailsFilter:
      return { ...state, failsFilter: action.payload.filter };

    case ActionType.SetArchAddressSearch:
      return { ...state, archAddressSearch: action.payload.search };

    case ActionType.SetShowSelectedArchaeologists:
      return { ...state, showSelectedArchaeologists: action.payload.selected };

    default:
      return state;
  }
}
