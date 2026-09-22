import api, { unwrap } from "../lib/api";
import type { Charity, CharitySelection } from "../types";

export const charityApi = {
  list() {
    return unwrap<Charity[]>(api.get("/charities"));
  },
  mine() {
    return unwrap<CharitySelection | null>(api.get("/charities/me"));
  },
  select(payload: { charityId: string; contributionPercentage: number }) {
    return unwrap<CharitySelection>(api.post("/charities/select", payload));
  }
};
