import { Actions } from '..';
import { ActionType, SortDirection, SortFilterType } from './actions';

export interface ArchaeologistListState {
  sortDirection: SortDirection;
  sortType: SortFilterType;
  diggingFeesFilter: string;
  unwrapsFilter: string;
  failsFilter: string;
  archAddressSearch: string;
  showSelectedArchaeologists: boolean;
}

export const archaeologistListInitialState: ArchaeologistListState = {
  sortDirection: SortDirection.NONE,
  sortType: SortFilterType.NONE,
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
    case ActionType.SetSortDirection:
      return {
        ...state,
        sortDirection: action.payload.direction,
        sortType: action.payload.sortType,
      };

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
