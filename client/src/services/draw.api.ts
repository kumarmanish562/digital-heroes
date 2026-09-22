import api, { unwrap } from "../lib/api";
import type { Draw, Winner } from "../types";

export const drawApi = {
  list() {
    return unwrap<Draw[]>(api.get("/draws"));
  },
  current() {
    return unwrap<Draw | null>(api.get("/draws/current"));
  },
  details(id: string) {
    return unwrap<Draw>(api.get(`/draws/${id}`));
  },
  winnings() {
    return unwrap<Winner[]>(api.get("/draws/winnings"));
  }
};
