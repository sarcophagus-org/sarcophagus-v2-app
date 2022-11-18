import { ActionMap } from '../ActionMap';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  SetSortDirection = 'EMBALM_SET_SORT_DIRECTION',
  SetShowSelectedArchaeologists = 'EMBALM_SET_SHOW_SELECTED_ARCHAEOLOGISTS',
  SetDiggingFeesFilter = 'EMBALM_SET_DIGGING_FEES_FILTER',
  SetUnwrapsFilter = 'EMBALM_SET_UNWRAPS_FILTER',
  SetFailsFilter = 'EMBALM_SET_FAILS_FILTER',
  SetArchAddressSearch = 'EMBALM_SET_ARCH_ADDRESS_SEARCH',
}

export enum SortDirection {
  ASC,
  DESC,
  NONE,
}

export enum SortFilterType {
  ADDRESS_SEARCH,
  DIGGING_FEES,
  UNWRAPS,
  FAILS,
  NONE,
}

type ArchaeologistListPayload = {
  [ActionType.SetSortDirection]: { sortType: SortFilterType; direction: SortDirection };
  [ActionType.SetDiggingFeesFilter]: { filter: string };
  [ActionType.SetUnwrapsFilter]: { filter: string };
  [ActionType.SetFailsFilter]: { filter: string };
  [ActionType.SetArchAddressSearch]: { search: string };
  [ActionType.SetShowSelectedArchaeologists]: { selected: boolean };
};

export function setSortDirection(
  sortType: SortFilterType,
  direction: SortDirection
): ArchaeologistListActions {
  return {
    type: ActionType.SetSortDirection,
    payload: {
      sortType,
      direction,
    },
  };
}

export function setDiggingFeesFilter(filter: string): ArchaeologistListActions {
  return {
    type: ActionType.SetDiggingFeesFilter,
    payload: {
      filter,
    },
  };
}

export function setUnwrapsFilter(filter: string): ArchaeologistListActions {
  return {
    type: ActionType.SetUnwrapsFilter,
    payload: {
      filter,
    },
  };
}

export function setFailsFilter(filter: string): ArchaeologistListActions {
  return {
    type: ActionType.SetFailsFilter,
    payload: {
      filter,
    },
  };
}

export function setArchAddressSearch(search: string): ArchaeologistListActions {
  return {
    type: ActionType.SetArchAddressSearch,
    payload: {
      search,
    },
  };
}

export function setShowSelectedArchaeologists(selected: boolean): ArchaeologistListActions {
  return {
    type: ActionType.SetShowSelectedArchaeologists,
    payload: {
      selected,
    },
  };
}

export type ArchaeologistListActions =
  ActionMap<ArchaeologistListPayload>[keyof ActionMap<ArchaeologistListPayload>];
