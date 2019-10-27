import axios from "axios";
import { FETCH_USER, FETCH_TRACKS, FETCH_ARTISTS } from "./types";

export const fetchUser = () => async dispatch => {
  const res = await axios.get("/api/current_user");
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchTracks = time_range => async dispatch => {
  const res = await axios.get("/api/tracks", { params: { time_range } });
  dispatch({ type: FETCH_TRACKS, payload: res.data });
};

export const fetchArtists = time_range => async dispatch => {
  const res = await axios.get("/api/artists", { params: { time_range } });
  dispatch({ type: FETCH_ARTISTS, payload: res.data });
};
