import { ArrowRight, Check, ChevronRight, CircleDollarSign, HeartHandshake, Menu, ShieldCheck, Sparkles, Target, Trophy, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const objectives = [
  { tag: "ENGINE", title: "Subscription", text: "Flexible monthly and yearly plans with a secure payment flow.", icon: CircleDollarSign },
  { tag: "EXPERIENCE", title: "Score entry", text: "A clean score workflow that makes every round easy to record.", icon: Target },
  { tag: "ENGINE", title: "Custom draw", text: "Monthly draw mechanics built around transparent, auditable entries.", icon: Sparkles },
  { tag: "IMPACT", title: "Charity", text: "Turn participation into meaningful support for a cause you choose.", icon: HeartHandshake },
  { tag: "CONTROL", title: "Admin", text: "A focused command center for draws, charities, winners and users.", icon: ShieldCheck },
  { tag: "DESIGN", title: "Premium UI/UX", text: "A distinctive golf-inspired experience instead of a generic dashboard.", icon: Trophy },
];

const steps = [
  ["01", "Create your profile", "Join the community and set up your player profile."],
  ["02", "Track your scores", "Save up to five scores and keep your history ready."],
  ["03", "Choose your cause", "Select a charity and decide your contribution percentage."],
  ["04", "Enter the monthly draw", "Your eligible scores become part of the monthly experience."],
];

export function LandingPage() {
  const [menu, setMenu] = useState(false);
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <Link to="/" className="landing-brand" onClick={() => setMenu(false)}>
          <span className="brand-mark landing-mark">DH</span>
          <span><strong>Digital Heroes</strong><small>PLAY · IMPACT · WIN</small></span>
        </Link>
        <nav className={menu ? "landing-links open" : "landing-links"}>
          <a href="#experience" onClick={() => setMenu(false)}>Experience</a>
          <a href="#objectives" onClick={() => setMenu(false)}>How it works</a>
          <a href="#impact" onClick={() => setMenu(false)}>Impact</a>
          <a href="#about" onClick={() => setMenu(false)}>About</a>
          <Link to="/login" className="landing-login" onClick={() => setMenu(false)}>Sign in</Link>
          <Link to="/register" className="btn btn-accent" onClick={() => setMenu(false)}>Start playing <ArrowRight size={16}/></Link>
        </nav>
        <button className="landing-menu" onClick={() => setMenu(!menu)} aria-label="Toggle menu">
          {menu ? <X/> : <Menu/>}
        </button>
      </header>

      <main>
        <section className="landing-hero" id="experience">
          <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
          <div className="hero-copy">
            <div className="kicker"><span/> THE GOLF COMMUNITY WITH PURPOSE</div>
            <h1>Play your round.<br/><em>Make it count.</em></h1>
            <p>Digital Heroes brings golf, monthly rewards and charitable impact together in one premium experience.</p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-accent btn-large">Join Digital Heroes <ArrowRight size={18}/></Link>
              <a href="#objectives" className="text-link">Explore the experience <ChevronRight size={16}/></a>
            </div>
            <div className="hero-proof"><span className="proof-avatars"><i>R</i><i>A</i><i>M</i><i>+</i></span><span><strong>Built for modern golfers</strong><small>Play better. Give back. Stay in the game.</small></span></div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun-glow"/>
            <div className="course">
              <div className="fairway fairway-a"/><div className="fairway fairway-b"/><div className="green"/><div className="flag"><span/><b/></div>
              <div className="hero-ball"/>
            </div>
            <div className="floating-card score-float"><span className="mini-label">YOUR ROUND</span><strong>+12</strong><small>Great progress</small><div className="mini-bars"><i/><i/><i/><i/><i/></div></div>
            <div className="floating-card impact-float"><span className="impact-icon"><HeartHandshake size={18}/></span><span><b>Cause supported</b><small>10% of your plan</small></span><Check size={17}/></div>
          </div>
        </section>

        <section className="trust-strip"><div><span>ONE PLATFORM</span><strong>Score tracking</strong></div><div><span>ONE PURPOSE</span><strong>Community impact</strong></div><div><span>ONE MOMENT</span><strong>Monthly draws</strong></div><div><span>ONE STANDARD</span><strong>Premium experience</strong></div></section>

        <section className="section section-light" id="objectives">
          <div className="section-heading"><div><span className="section-index">01 · CORE OBJECTIVES</span><h2>Everything you need.<br/><em>Nothing you don't.</em></h2></div><p>A complete digital experience designed around the rhythm of the game — from your scorecard to your impact.</p></div>
          <div className="objective-grid">{objectives.map(({tag,title,text,icon:Icon}, i) => <article className={`objective-card objective-${i}`} key={title}><div className="objective-top"><span>{tag}</span><Icon size={20}/></div><h3>{title}</h3><p>{text}</p><span className="card-arrow"><ArrowRight size={17}/></span></article>)}</div>
        </section>

        <section className="section process-section" id="about">
          <div className="section-heading compact"><div><span className="section-index">02 · THE JOURNEY</span><h2>Four simple steps.<br/><em>One better game.</em></h2></div><p>Your experience stays simple while the platform handles the complexity behind it.</p></div>
          <div className="steps-grid">{steps.map(([num,title,text]) => <article key={num} className="step-card"><span className="step-num">{num}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowRight size={18}/></article>)}</div>
        </section>

        <section className="impact-section" id="impact">
          <div className="impact-copy"><span className="section-index light">03 · PLAY WITH PURPOSE</span><h2>Your game can<br/><em>do more.</em></h2><p>Choose a charity, set your contribution and make every subscription mean something beyond the leaderboard.</p><Link to="/register" className="btn btn-light">Choose your cause <ArrowRight size={17}/></Link></div>
          <div className="impact-visual"><div className="impact-ring"><HeartHandshake size={48}/><span>10%</span></div><div className="impact-note note-one">Your choice matters</div><div className="impact-note note-two">Transparent contribution</div></div>
        </section>

        <section className="section cta-section"><div className="cta-card"><div><span className="section-index">04 · YOUR NEXT ROUND</span><h2>Ready to make<br/><em>your mark?</em></h2></div><div><p>Create your account, save your first score and step into a new kind of golf community.</p><Link to="/register" className="btn btn-accent btn-large">Create your account <ArrowRight size={18}/></Link></div></div></section>
      </main>

      <footer className="landing-footer"><div className="footer-brand"><span className="brand-mark">DH</span><div><strong>Digital Heroes</strong><small>Play · Impact · Win</small></div></div><p>Golf, community and purpose — designed as one experience.</p><div className="footer-links"><Link to="/login">Sign in</Link><Link to="/register">Create account</Link></div></footer>
    </div>
  );
}
