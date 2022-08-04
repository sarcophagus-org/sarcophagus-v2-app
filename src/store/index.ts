import React, { createContext, Dispatch } from 'react';


interface InitialState {
  archaeologists: Archaeologist[];
  someNumber: number;
}

const initialState: InitialState = {
  archaeologists: [], 
  someNumber: 0
};

const AppContext = createContext<{ state: InitialState; dispatch: Dispatch<DispatchActions> }>({
  state: initialState,
  dispatch: () => null
});