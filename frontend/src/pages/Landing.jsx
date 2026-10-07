import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiPieChart,
  FiPercent,
  FiHeart,
  FiLayers,
  FiCalendar,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";
import "./Landing.css";

const FEATURES = [
  {
    icon: FiBookOpen,
    title: "Trade Journal",
    desc: "Log every entry, exit, and screenshot. See the pattern in your wins before it repeats in your losses.",
  },
  {
    icon: FiPieChart,
    title: "Analytics",
    desc: "Win rate, drawdown, best session, best pair — the numbers that actually predict your next month.",
  },
  {
    icon: FiPercent,
    title: "Risk Calculator",
    desc: "Position size from your account balance and stop loss, before you click buy, not after.",
  },
  {
    icon: FiHeart,
    title: "Psychology Tracking",
    desc: "Confidence, stress, sleep, discipline — logged against every trade so emotional patterns stop hiding.",
  },
  {
    icon: FiLayers,
    title: "Strategy Library",
    desc: "Document your rules once. Measure which setups actually earn their keep.",
  },
  {
    icon: FiCalendar,
    title: "Economic Calendar",
    desc: "Every high-impact release, countdown included, filtered to the currencies you actually trade.",
  },
];

const STEPS = [
  { n: "01", title: "Log the trade", desc: "Pair, direction, levels, lot size — in under thirty seconds." },
  { n: "02", title: "Tag the context", desc: "Strategy used, emotion felt, session traded." },
  { n: "03", title: "Read the pattern", desc: "TradeFlow surfaces what's actually costing you money." },
];

// Generates a deterministic-looking candlestick series for the hero animation
const CANDLES = [
  { h: 38, body: 22, bull: true }, { h: 52, body: 30, bull: true }, { h: 30, body: 14, bull: false },
  { h: 60, body: 38, bull: true }, { h: 44, body: 20, bull: false }, { h: 70, body: 46, bull: true },
  { h: 36, body: 18, bull: false }, { h: 58, body: 34, bull: true }, { h: 48, body: 26, bull: true },
  { h: 32, body: 16, bull: false }, { h: 64, body: 40, bull: true }, { h: 40, body: 22, bull: false },
  { h: 54, body: 28, bull: true }, { h: 28, body: 12, bull: false }, { h: 66, body: 42, bull: true },
  { h: 46, body: 24, bull: true }, { h: 34, body: 16, bull: false }, { h: 56, body: 32, bull: true },
];

const Landing = () => {
  return (
    <div className="landing">
      {/* ---- Nav ---- */}
      <nav className="landing-nav">
        <div className="landing-nav__inner">
          <div className="landing-nav__brand">
            <span className="landing-nav__mark">T</span>
            <span>TradeFlow</span>
          </div>
          <div className="landing-nav__links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
          </div>
          <div className="landing-nav__actions">
            <Link to="/login" className="landing-nav__login">Log in</Link>
            <Link to="/signup" className="landing-nav__cta">Get started</Link>
          </div>
        </div>
      </nav>

      {/* ---- Hero ---- */}
      <header className="hero">
        <div className="hero__candles" aria-hidden="true">
          {CANDLES.map((c, i) => (
            <div
              key={i}
              className={`hero__candle ${c.bull ? "hero__candle--bull" : "hero__candle--bear"}`}
              style={{
                "--wick-h": `${c.h}px`,
                "--body-h": `${c.body}px`,
                "--delay": `${i * 0.12}s`,
              }}
            >
              <span className="hero__candle-wick" />
              <span className="hero__candle-body" />
            </div>
          ))}
        </div>

        <div className="hero__content">
          <motion.span
            className="hero__eyebrow"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            For traders who journal, not just trade
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Your edge isn't the strategy.
            <br />
            It's <span className="hero__highlight">knowing your numbers.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            TradeFlow is the trading workspace that journals your trades, tracks your
            discipline, and shows you — in numbers, not vibes — what's actually working.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/signup" className="hero__primary-btn">
              Start journaling free <FiArrowRight />
            </Link>
            <Link to="/login" className="hero__secondary-btn">
              I have an account
            </Link>
          </motion.div>

          <motion.div
            className="hero__proof"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span><FiCheck /> No credit card required</span>
            <span><FiCheck /> Free forever for solo traders</span>
          </motion.div>
        </div>
      </header>

      {/* ---- Features ---- */}
      <section className="features" id="features">
        <div className="section-head">
          <span className="section-eyebrow">The workspace</span>
          <h2>Everything between opening a chart and closing the month</h2>
        </div>
        <div className="features__grid">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              className="feature-card"
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <div className="feature-card__icon"><Icon /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-head">
          <span className="section-eyebrow">The loop</span>
          <h2>Three steps, every trading day</h2>
        </div>
        <div className="how-it-works__steps">
          {STEPS.map((step) => (
            <div className="step" key={step.n}>
              <span className="step__number">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="final-cta">
        <h2>Stop guessing why last month went the way it did.</h2>
        <p>Build the habit. Read the data. Trade what's working.</p>
        <Link to="/signup" className="hero__primary-btn">
          Create your free account <FiArrowRight />
        </Link>
      </section>

      <footer className="landing-footer">
        <div className="landing-nav__brand">
          <span className="landing-nav__mark">T</span>
          <span>TradeFlow</span>
        </div>
        <p>&copy; {new Date().getFullYear()} TradeFlow. Built for traders, by traders.</p>
      </footer>
    </div>
  );
};

export default Landing;
