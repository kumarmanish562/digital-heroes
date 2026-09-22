import api, { unwrap } from "../lib/api";
import type { AdminDashboard, Charity, Draw, User, Winner } from "../types";

export const adminApi = {
  dashboard() {
    return unwrap<AdminDashboard>(api.get("/admin/dashboard"));
  },
  users() {
    return unwrap<User[]>(api.get("/admin/users"));
  },
  createDraw(payload: { drawDate: string; prizePoolAmount: number }) {
    return unwrap<Draw>(api.post("/admin/draws", payload));
  },
  simulateDraw(id: string, prizePoolAmount: number) {
    return unwrap<Draw>(api.post(`/admin/draws/${id}/simulate`, { prizePoolAmount }));
  },
  publishDraw(id: string) {
    return unwrap<Draw>(api.post(`/admin/draws/${id}/publish`));
  },
  charities() {
    return unwrap<Charity[]>(api.get("/admin/charities"));
  },
  createCharity(payload: Partial<Charity>) {
    return unwrap<Charity>(api.post("/admin/charities", payload));
  },
  updateCharity(id: string, payload: Partial<Charity>) {
    return unwrap<Charity>(api.put(`/admin/charities/${id}`, payload));
  },
  deleteCharity(id: string) {
    return unwrap<Charity>(api.delete(`/admin/charities/${id}`));
  },
  winners() {
    return unwrap<Winner[]>(api.get("/admin/winners"));
  },
  approveWinner(id: string) {
    return unwrap<Winner>(api.post(`/admin/winners/${id}/approve`));
  },
  rejectWinner(id: string, reason: string) {
    return unwrap<Winner>(api.post(`/admin/winners/${id}/reject`, { reason }));
  },
  payWinner(id: string) {
    return unwrap<Winner>(api.post(`/admin/winners/${id}/pay`));
  }
};
