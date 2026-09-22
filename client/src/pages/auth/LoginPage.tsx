import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LogIn, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getApiError } from "../../lib/api";

export function LoginPage() {
  const { login } = useAuth(); const navigate = useNavigate();
  const [form,setForm]=useState({email:"",password:""}); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();setError("");setLoading(true);try{await login(form.email,form.password);navigate("/dashboard",{replace:true});}catch(err){setError(getApiError(err,"Invalid email or password"));}finally{setLoading(false)}}
  return <AuthShell title="Welcome back" subtitle="Sign in to continue your Digital Heroes journey."><form className="form" onSubmit={submit}>{error&&<div className="alert error">{error}</div>}<label>Email<input type="email" required placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Password<input type="password" required minLength={6} placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label><button className="btn btn-primary full" disabled={loading}><LogIn size={17}/>{loading?"Signing in...":"Sign in"}<ArrowRight size={15}/></button><p className="form-footer">Don't have an account? <Link to="/register">Create one</Link></p></form></AuthShell>
}
function AuthShell({title,subtitle,children}:{title:string;subtitle:string;children:React.ReactNode}){return <div className="auth-page"><div className="auth-visual"><div className="auth-visual-copy"><span className="section-index">DIGITAL HEROES · MEMBER EXPERIENCE</span><h2>Play your game.<br/><em>Give it purpose.</em></h2><p>One place for your scores, monthly draws, membership and the causes you care about.</p><div className="hero-proof"><span className="proof-avatars"><i>R</i><i>A</i><i>M</i><i>+</i></span><span><strong>Premium golf community</strong><small>Secure · purposeful · built to grow</small></span></div></div></div><div className="auth-side"><Link to="/" className="auth-brand"><span className="brand-mark">DH</span><strong>Digital Heroes</strong></Link><div className="auth-card"><h1>{title}</h1><p>{subtitle}</p>{children}</div></div></div>}
