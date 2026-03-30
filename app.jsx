// ═══════════════════════════════════════════════════════
// app.jsx — MediCheck Symptom Health Predictor
// ReactJS — All UI Components, Hooks & State Management
// ═══════════════════════════════════════════════════════

// Destructure all React hooks we use
const {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useReducer
} = React;


// ══════════════════════════════════════════════════════
//  COMPONENT 1: Header
//  Shows the logo and app name at the top
// ══════════════════════════════════════════════════════
function Header() {
  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">🩺</div>
        <div>
          <div className="logo-text">MediCheck</div>
          <div className="logo-sub">Health Predictor</div>
        </div>
      </div>
    </header>
  );
}


// ══════════════════════════════════════════════════════
//  COMPONENT 2: Hero
//  Full-width banner at the top of the page
// ══════════════════════════════════════════════════════
function Hero() {
  return (
    <div className="hero">
      <div className="hero-grid"></div>
      <div className="hero-orb1"></div>
      <div className="hero-orb2"></div>
      <div style={{position:'relative', zIndex:1}}>
        <div className="hero-tag">
          <span className="hero-tag-dot"></span>
          🔬 Symptom Intelligence Engine
        </div>
        <h1>Check Your <em>Symptoms,</em><br/>Understand Your Health</h1>
        <p>Advanced symptom analysis using clinical pattern matching to help you identify possible health conditions.</p>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════
//  COMPONENT 3: StepsBar
//  Shows which step the user is on (1 of 4)
//  Props: step (number)
// ══════════════════════════════════════════════════════
function StepsBar({ step }) {
  const steps = ["Personal Info", "Select Symptoms", "Rate Severity", "Results"];
  return (
    <div className="steps-bar">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className={`step-item ${step === i ? 'active' : ''} ${step > i ? 'done' : ''}`}>
            <div className="step-circle">{step > i ? '✓' : i + 1}</div>
            <div className="step-label">{s}</div>
          </div>
          {i < steps.length - 1 && (
            <div className={`step-line ${step > i ? 'done' : ''}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}


// ══════════════════════════════════════════════════════
//  COMPONENT 4: PersonalInfo (Step 0)
//  Collects user profile data via controlled form inputs
//  Props: profile, setProfile, onNext
// ══════════════════════════════════════════════════════
function PersonalInfo({ profile, setProfile, onNext }) {

  // Generic change handler updates profile state for any field
  const handleChange = (e) => {
    setProfile(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  // Only enable Next if required fields are filled
  const valid = profile.name && profile.age && profile.gender;

  return (
    <div className="card fade-up">
      <div className="card-title">👤 Personal Information</div>
      <div className="card-sub">This helps us provide more accurate health predictions.</div>

      <div className="form-grid">
        <div className="form-group">
          <label>Full Name</label>
          <input
            name="name"
            placeholder="Your name"
            value={profile.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            name="age"
            type="number"
            min="1"
            max="120"
            placeholder="Years"
            value={profile.age}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Biological Sex</label>
          <select name="gender" value={profile.gender} onChange={handleChange}>
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>

        <div className="form-group">
          <label>Blood Group (optional)</label>
          <select name="blood" value={profile.blood} onChange={handleChange}>
            <option value="">Unknown</option>
            {["A+","A−","B+","B−","AB+","AB−","O+","O−"].map(b => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="form-group full">
          <label>Known Medical Conditions (optional)</label>
          <textarea
            name="existing"
            placeholder="e.g. Diabetes, Hypertension, Asthma..."
            value={profile.existing}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full">
          <label>Current Medications (optional)</label>
          <textarea
            name="meds"
            placeholder="e.g. Metformin 500mg, Aspirin..."
            value={profile.meds}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="btn-row">
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!valid}
          style={{opacity: valid ? 1 : 0.5}}
        >
          Continue → Select Symptoms
        </button>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════
//  COMPONENT 5: SymptomPicker (Step 1)
//  Search + filter + select symptoms
//  Uses useMemo for performance optimization
//  Props: selected, setSelected, onNext, onBack
// ══════════════════════════════════════════════════════
function SymptomPicker({ selected, setSelected, onNext, onBack }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // useMemo — only recomputes when search or category changes
  const filtered = useMemo(() => {
    let pool = activeCategory === 'All'
      ? ALL_SYMPTOMS
      : (SYMPTOM_CATEGORIES[activeCategory] || []);
    if (search) {
      pool = pool.filter(s => s.toLowerCase().includes(search.toLowerCase()));
    }
    return pool;
  }, [search, activeCategory]);

  // Toggle symptom selection on/off
  const toggle = (s) => {
    setSelected(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  return (
    <div className="card fade-up">
      <div className="card-title">🩺 Select Your Symptoms</div>
      <div className="card-sub">
        Choose any symptoms you're currently experiencing. Select at least one to continue.
      </div>

      {/* Live search input */}
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          placeholder="Search symptoms..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category filter tabs */}
      <div className="category-tabs">
        {Object.keys(SYMPTOM_CATEGORIES).map(cat => (
          <button
            key={cat}
            className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Symptom chips grid */}
      <div className="symptom-grid">
        {filtered.map(s => (
          <button
            key={s}
            className={`symptom-chip ${selected.includes(s) ? 'selected' : ''}`}
            onClick={() => toggle(s)}
          >
            <span className="chip-icon">{SYMPTOM_ICONS[s] || '•'}</span>
            {s}
          </button>
        ))}
        {!filtered.length && (
          <div className="empty">
            <div>🔍</div>
            <div style={{fontSize:13}}>No symptoms found</div>
          </div>
        )}
      </div>

      {/* Selected symptom tags */}
      {selected.length > 0 && (
        <div className="selected-wrap">
          <div className="selected-title">✅ Selected ({selected.length})</div>
          <div className="selected-tags">
            {selected.map(s => (
              <div key={s} className="sel-tag">
                {SYMPTOM_ICONS[s] || '•'} {s}
                <button onClick={() => toggle(s)}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={selected.length < 1}
          style={{opacity: selected.length >= 1 ? 1 : 0.5}}
        >
          Rate Severity → ({selected.length} selected)
        </button>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════
//  COMPONENT 6: SeverityRater (Step 2)
//  Range sliders for each selected symptom
//  Props: selected, severities, setSeverities, durations, setDurations, onNext, onBack
// ══════════════════════════════════════════════════════
function SeverityRater({ selected, severities, setSeverities, durations, setDurations, onNext, onBack }) {

  // Returns text label for severity value
  const sevLabel = (v) => v <= 3 ? 'Mild' : v <= 6 ? 'Moderate' : v <= 8 ? 'Severe' : 'Critical';

  // Returns CSS class for severity badge colour
  const sevClass = (v) => v <= 3 ? 'low' : v <= 6 ? 'medium' : 'high';

  return (
    <div className="card fade-up">
      <div className="card-title">📊 Rate Symptom Severity</div>
      <div className="card-sub">
        Rate each symptom on a scale of 1–10 and indicate how long you've had it.
      </div>

      <div className="severity-list">
        {selected.map(s => {
          const val = severities[s] ?? 5;
          return (
            <div key={s} className="sev-item">
              <div className="sev-header">
                <div className="sev-name">{SYMPTOM_ICONS[s] || '•'} {s}</div>
                <div className={`sev-val ${sevClass(val)}`}>
                  {sevLabel(val)} ({val}/10)
                </div>
              </div>

              {/* Range slider — updates severity state */}
              <input
                type="range"
                min="1"
                max="10"
                value={val}
                onChange={e => setSeverities(p => ({
                  ...p,
                  [s]: parseInt(e.target.value)
                }))}
                style={{
                  accentColor: val <= 3 ? '#00e5a0' : val <= 6 ? '#ffb800' : '#00c8ff'
                }}
              />

              {/* Duration dropdown */}
              <div className="sev-duration">
                <select
                  value={durations[s] || ''}
                  onChange={e => setDurations(p => ({ ...p, [s]: e.target.value }))}
                >
                  <option value="">Duration: Select...</option>
                  <option>Less than 24 hours</option>
                  <option>1–3 days</option>
                  <option>4–7 days</option>
                  <option>1–2 weeks</option>
                  <option>2–4 weeks</option>
                  <option>More than 1 month</option>
                  <option>Chronic / recurring</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext}>
          🔍 Analyze My Symptoms
        </button>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════
//  COMPONENT 7: Analyzing (Loading Screen)
//  useEffect with setInterval — rotates tip messages
//  Cleanup on unmount prevents memory leaks
// ══════════════════════════════════════════════════════
function Analyzing() {
  const [tip, setTip] = useState(0);
  const tips = [
    "Matching symptom patterns...",
    "Consulting condition database...",
    "Calculating probabilities...",
    "Generating health report..."
  ];

  // useEffect — lifecycle: runs on mount, clears on unmount
  useEffect(() => {
    const t = setInterval(() => setTip(p => (p + 1) % tips.length), 700);
    return () => clearInterval(t); // Cleanup prevents memory leak
  }, []);

  return (
    <div className="card analyzing">
      <div className="dna-wrap">🧬</div>
      <h2>Analyzing Your Symptoms</h2>
      <p>{tips[tip]}</p>
      <div className="progress-bar">
        <div className="progress-fill"></div>
      </div>
      <p style={{fontSize:12, marginTop:8, color:'var(--ink3)'}}>
        Using clinical pattern-matching algorithm
      </p>
    </div>
  );
}


// ══════════════════════════════════════════════════════
//  COMPONENT 8: ConditionCard
//  Expandable card for each matched condition
//  Local useState controls open/closed accordion
//  Props: cond (condition object), index (number)
// ══════════════════════════════════════════════════════
function ConditionCard({ cond, index }) {
  // First card opens by default (index === 0)
  const [open, setOpen] = useState(index === 0);

  const pct = cond.probability;
  const cls = pct >= 55 ? 'high-prob' : pct >= 35 ? 'med-prob' : 'low-prob';

  return (
    <div
      className="condition-card fade-up"
      style={{animationDelay: `${index * 0.07}s`}}
    >
      {/* Clickable header toggles accordion */}
      <div className="cond-header" onClick={() => setOpen(o => !o)}>
        <div className="cond-left">
          <div className="cond-icon">{cond.icon}</div>
          <div>
            <div className="cond-name">{cond.name}</div>
            <div className="cond-type">{cond.category}</div>
          </div>
        </div>

        <div style={{display:'flex', alignItems:'center', gap:12}}>
          {/* Probability bar */}
          <div className="prob-bar-wrap">
            <div className="prob-bar">
              <div
                className={`prob-fill ${cls}`}
                style={{width: `${pct}%`}}
              ></div>
            </div>
            <div
              className="prob-pct"
              style={{color: pct>=55 ? 'var(--accent)' : pct>=35 ? 'var(--amber)' : 'var(--green)'}}
            >
              {pct}%
            </div>
          </div>
          <span style={{color:'var(--ink3)', fontSize:12}}>{open ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expandable body */}
      <div className={`cond-body ${open ? 'open' : ''}`}>
        <p style={{fontSize:13, color:'var(--ink2)', marginBottom:14}}>
          {cond.descriptions}
        </p>

        {/* Matched symptoms tags */}
        <div style={{marginBottom:12}}>
          <div style={{fontSize:12, fontWeight:600, textTransform:'uppercase',
            letterSpacing:'0.8px', color:'var(--ink3)', marginBottom:6}}>
            Matched Symptoms
          </div>
          <div className="cond-tags">
            {cond.matchedSymptoms.map(s => (
              <span key={s} className="cond-tag">{s}</span>
            ))}
          </div>
        </div>

        {/* Detail grid: causes, treatments, when to seek help, prevention */}
        <div className="cond-detail-grid">
          <div className="cond-detail">
            <h4>Possible Causes</h4>
            <ul>{cond.causes.map((c,i) => <li key={i}>{c}</li>)}</ul>
          </div>
          <div className="cond-detail">
            <h4>Common Treatments</h4>
            <ul>{cond.treatments.map((t,i) => <li key={i}>{t}</li>)}</ul>
          </div>
          <div className="cond-detail">
            <h4>Seek Medical Help If</h4>
            <ul>{cond.when_to_seek.map((w,i) => <li key={i}>{w}</li>)}</ul>
          </div>
          <div className="cond-detail">
            <h4>Prevention</h4>
            <ul>{cond.prevention.map((p,i) => <li key={i}>{p}</li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════
//  COMPONENT 9: Results (Step 3)
//  Renders the full health analysis report
//  Props: results, profile, symptoms, onReset
// ══════════════════════════════════════════════════════
function Results({ results, profile, symptoms, onReset }) {
  const topUrgency = results[0]?.urgency || 'low';
  const riskLabel = topUrgency === 'high' ? 'High Risk'
    : topUrgency === 'moderate' ? 'Moderate Risk' : 'Low Risk';
  const riskClass = `risk-${topUrgency === 'high' ? 'high'
    : topUrgency === 'moderate' ? 'moderate' : 'low'}`;

  return (
    <div className="card fade-up">

      {/* Report header */}
      <div className="result-header">
        <h2>Health Analysis Report</h2>
        <p>
          For {profile.name} · {profile.age} years · {profile.gender} · {symptoms.length} symptoms analyzed
        </p>
        <div className={`risk-badge ${riskClass}`}>
          {topUrgency === 'high' ? '🔴' : topUrgency === 'moderate' ? '🟡' : '🟢'} {riskLabel}
        </div>
      </div>

      {/* Possible conditions list */}
      <div style={{marginBottom:28}}>
        <div className="card-title" style={{fontSize:18, marginBottom:4}}>
          🔬 Possible Conditions
        </div>
        <div className="card-sub">
          Sorted by symptom match probability. These are possibilities, not diagnoses.
        </div>

        {results.length
          ? results.map((c, i) => <ConditionCard key={c.id} cond={c} index={i}/>)
          : (
            <div className="empty">
              <div className="empty-icon">🔍</div>
              <p>No strong matches found. Please consult a doctor.</p>
            </div>
          )
        }
      </div>

      {/* General advice cards */}
      <div style={{marginBottom:24}}>
        <div className="card-title" style={{fontSize:18, marginBottom:16}}>
          💡 General Health Advice
        </div>
        <div className="advice-grid">
          <div className="advice-item warning">
            <div className="advice-icon">💊</div>
            <h4>Don't Self-Medicate</h4>
            <p>Always consult a qualified healthcare provider before starting any medication.</p>
          </div>
          <div className="advice-item info">
            <div className="advice-icon">💧</div>
            <h4>Stay Hydrated</h4>
            <p>Drink 8–10 glasses of water daily. Proper hydration supports every body function.</p>
          </div>
          <div className="advice-item success">
            <div className="advice-icon">🛌</div>
            <h4>Rest & Recover</h4>
            <p>Aim for 7–9 hours of sleep. Your immune system works hardest while you rest.</p>
          </div>
          <div className="advice-item danger">
            <div className="advice-icon">📞</div>
            <h4>Emergency Signs</h4>
            <p>Chest pain, difficulty breathing, or sudden confusion require immediate ER care.</p>
          </div>
        </div>
      </div>

      {/* Medical disclaimer */}
      <div className="disclaimer">
        <div className="disclaimer-icon">⚠️</div>
        <p>
          <strong>Medical Disclaimer</strong>
          This tool is for educational purposes only and does not constitute medical advice,
          diagnosis, or treatment. Always consult a licensed healthcare professional.
        </p>
      </div>

      <div className="btn-row">
        <button className="btn btn-primary" onClick={onReset}>
          🔄 Start New Checkup
        </button>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════
//  COMPONENT 10: App (Root Component)
//  Manages all global state and step navigation
//  All state is lifted here and passed down via props
// ══════════════════════════════════════════════════════
function App() {

  // ── Global State (useState hooks) ──
  const [step, setStep] = useState(0);                          // Current wizard step
  const [profile, setProfile] = useState({                     // User profile data
    name:'', age:'', gender:'', blood:'', existing:'', meds:''
  });
  const [symptoms, setSymptoms] = useState([]);                 // Selected symptoms array
  const [severities, setSeverities] = useState({});             // Severity ratings object
  const [durations, setDurations] = useState({});               // Duration selections object
  const [analyzing, setAnalyzing] = useState(false);            // Loading state boolean
  const [results, setResults] = useState(null);                 // Analysis results array

  // ── Run Analysis (simulated async with setTimeout) ──
  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const r = analyzeSymptoms(symptoms, severities, profile); // Call JS algorithm
      setResults(r);
      setAnalyzing(false);
      setStep(3);
    }, 2800);
  };

  // ── Reset — clears all state back to initial ──
  const reset = () => {
    setStep(0);
    setProfile({ name:'', age:'', gender:'', blood:'', existing:'', meds:'' });
    setSymptoms([]);
    setSeverities({});
    setDurations({});
    setResults(null);
  };

  return (
    <>
      {/* Static layout components */}
      <Header />
      <Hero />

      <div className="main">
        {/* Step indicator — hidden during analysis */}
        {!analyzing && <StepsBar step={step}/>}

        {/* Conditional rendering — one step at a time */}
        {step === 0 && (
          <PersonalInfo
            profile={profile}
            setProfile={setProfile}
            onNext={() => setStep(1)}
          />
        )}

        {step === 1 && (
          <SymptomPicker
            selected={symptoms}
            setSelected={setSymptoms}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        )}

        {step === 2 && !analyzing && (
          <SeverityRater
            selected={symptoms}
            severities={severities}
            setSeverities={setSeverities}
            durations={durations}
            setDurations={setDurations}
            onNext={runAnalysis}
            onBack={() => setStep(1)}
          />
        )}

        {/* Loading screen */}
        {analyzing && <Analyzing />}

        {/* Results — only renders when results exist */}
        {step === 3 && results && (
          <Results
            results={results}
            profile={profile}
            symptoms={symptoms}
            onReset={reset}
          />
        )}
      </div>
    </>
  );
}


// ── Mount React app to DOM (React 18 Concurrent Mode) ──
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
