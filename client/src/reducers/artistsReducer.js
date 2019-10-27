import { FETCH_ARTISTS } from "../actions/types";

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_ARTISTS:
      return action.payload || false;
    default:
      return state;
  }
}
