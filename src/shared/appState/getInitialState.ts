import {version} from "../../../package.json";
import {AppState} from "./types";

export const getInitialState = (): AppState => ({
  debug: true,
  version,
  state: 'NONE',
  src: 'NONE',
  search: null,
  offsetTime: {
    time: 0,
    applied: true
  }
});