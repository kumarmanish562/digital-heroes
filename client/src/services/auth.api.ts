import api, { unwrap } from "../lib/api";
import type { AuthResult, User } from "../types";

export const authApi = {
  register(payload: { name: string; email: string; password: string }) {
    return unwrap<AuthResult>(api.post("/auth/register", payload));
  },
  login(payload: { email: string; password: string }) {
    return unwrap<AuthResult>(api.post("/auth/login", payload));
  },
  me() {
    return unwrap<{ userId: string; role: "USER" | "ADMIN" }>(api.get("/auth/me"));
  },
  profile() {
    return unwrap<User>(api.get("/user/me"));
  },
  updateProfile(name: string) {
    return unwrap<User>(api.put("/user/me", { name }));
  },
  logout() {
    return unwrap<void>(api.post("/auth/logout"));
  }
};
