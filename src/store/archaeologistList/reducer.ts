import { Actions } from '..';
import { ActionType, SortDirection, SortFilterType } from './actions';

export interface ArchaeologistListState {
  archaeologistFilterSort: { sortDirection: SortDirection; sortType: SortFilterType };
  diggingFeesFilter: string;
  unwrapsFilter: string;
  failsFilter: string;
  archAddressSearch: string;
  showOnlySelectedArchaeologists: boolean;
  showHiddenArchaeologists: boolean;
}

export const archaeologistListInitialState: ArchaeologistListState = {
  archaeologistFilterSort: { sortDirection: SortDirection.NONE, sortType: SortFilterType.NONE },
  diggingFeesFilter: '',
  unwrapsFilter: '',
  failsFilter: '',
  archAddressSearch: '',
  showOnlySelectedArchaeologists: false,
  showHiddenArchaeologists: false,
};

export function archaeologistListReducer(
  state: ArchaeologistListState,
  action: Actions
): ArchaeologistListState {
  switch (action.type) {
    case ActionType.SetSortDirection:
      return {
        ...state,
        archaeologistFilterSort: {
          sortDirection: action.payload.direction,
          sortType: action.payload.sortType,
        },
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
      return { ...state, showOnlySelectedArchaeologists: action.payload.selected };

    case ActionType.ToggleShowHiddenArchaeologists:
      return { ...state, showHiddenArchaeologists: !state.showHiddenArchaeologists };

    default:
      return state;
  }
}
