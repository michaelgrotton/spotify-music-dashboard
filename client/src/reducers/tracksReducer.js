import { FETCH_TRACKS } from "../actions/types";

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_TRACKS:
      return action.payload || false;
    default:
      return state;
  }
}
