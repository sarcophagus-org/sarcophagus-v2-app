import { ActionMap } from '../ActionMap';

// NOTE: Prefix each action with this namespace. Duplicate action names in other reducers will cause
// unexpected behavior.
export enum ActionType {
  SetDiggingFeesSortDirection = 'EMBALM_SET_DIGGING_FEES_SORT_DIRECTION',
  SetUnwrapsSortDirection = 'EMBALM_UNWRAPS_SORT_DIRECTION',
  SetFailsSortDirection = 'EMBALM_FAILS_SORT_DIRECTION',
  SetArchsSortDirection = 'EMBALM_ARCHS_SORT_DIRECTION',
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

type ArchaeologistListPayload = {
  [ActionType.SetDiggingFeesSortDirection]: { direction: SortDirection };
  [ActionType.SetUnwrapsSortDirection]: { direction: SortDirection };
  [ActionType.SetFailsSortDirection]: { direction: SortDirection };
  [ActionType.SetArchsSortDirection]: { direction: SortDirection };
  [ActionType.SetDiggingFeesFilter]: { filter: string };
  [ActionType.SetUnwrapsFilter]: { filter: string };
  [ActionType.SetFailsFilter]: { filter: string };
  [ActionType.SetArchAddressSearch]: { search: string };
  [ActionType.SetShowSelectedArchaeologists]: { selected: boolean };
};

export function setDiggingFeesSortDirection(direction: SortDirection): ArchaeologistListActions {
  return {
    type: ActionType.SetDiggingFeesSortDirection,
    payload: {
      direction,
    },
  };
}

export function setFailsSortDirection(direction: SortDirection): ArchaeologistListActions {
  return {
    type: ActionType.SetFailsSortDirection,
    payload: {
      direction,
    },
  };
}

export function setArchsSortDirection(direction: SortDirection): ArchaeologistListActions {
  return {
    type: ActionType.SetArchsSortDirection,
    payload: {
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

export function setUnwrapsSortDirection(direction: SortDirection): ArchaeologistListActions {
  return {
    type: ActionType.SetUnwrapsSortDirection,
    payload: {
      direction,
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
