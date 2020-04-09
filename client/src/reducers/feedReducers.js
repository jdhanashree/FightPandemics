import {
  ADD_OPTION,
  REMOVE_OPTION,
  REMOVE_ALL_OPTIONS,
  TOGGLE_MODAL,
  SET_ACTIVE_PANEL,
  SET_LOCATION,
} from "../actions/feedActions";

export const feedReducer = (oldState, action) => {
  let newState = Object.assign({}, oldState);
  const { value } = action;
  switch (action.type) {
    case TOGGLE_MODAL:
      newState.modal = !newState.modal;
      return newState;
    case SET_ACTIVE_PANEL:
      newState.activePanel = value;
      return newState;
    case SET_LOCATION:
      newState.location = value;
      return newState;
    default:
      return newState;
  }
};

export const optionsReducer = (oldState, action) => {
  const { option, label } = action.payload;
  let newState = Object.assign({}, oldState);
  newState[label] = newState[label] || [];
  switch (action.type) {
    case ADD_OPTION:
      newState[label].push(option);
      return newState;
    case REMOVE_OPTION:
      newState[label] = newState[label].filter((o) => o !== option);
      if (!newState[label].length) delete newState[label];
      return newState;
    case REMOVE_ALL_OPTIONS:
      return {};
    default:
      return oldState;
  }
};
