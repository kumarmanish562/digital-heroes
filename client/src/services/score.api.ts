import api, { unwrap } from "../lib/api";
import type { Score } from "../types";

export const scoreApi = {
  list() {
    return unwrap<Score[]>(api.get("/scores"));
  },
  create(payload: { score: number; scoreDate: string }) {
    return unwrap<Score>(api.post("/scores", payload));
  },
  update(id: string, payload: { score: number; scoreDate: string }) {
    return unwrap<Score>(api.put(`/scores/${id}`, payload));
  },
  remove(id: string) {
    return unwrap<Score>(api.delete(`/scores/${id}`));
  }
};
