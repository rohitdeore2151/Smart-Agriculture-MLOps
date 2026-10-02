import { useEffect, useMemo, useState } from "react";
import "./styles.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const slides = [
  {
    eyebrow: "Field intelligence · 01",
    title: "Grow more with every season.",
    copy: "Make confident decisions with one calm, clear view of your farm.",
    accent: "From soil to harvest",
    className: "hero-slide-one",
  },
  {
    eyebrow: "Precision agriculture · 02",
    title: "Give every crop its best chance.",
    copy: "Turn weather, soil and crop signals into simple actions for today.",
    accent: "Recommendations that matter",
    className: "hero-slide-two",
  },
  {
    eyebrow: "Smarter harvests · 03",
    title: "The future of farming feels natural.",
    copy: "Spot opportunities early, reduce waste and grow sustainably.",
    accent: "Built for the field",
    className: "hero-slide-three",
  },
];

const tools = [
  { icon: "sprout", label: "Crop recommendation", detail: "Find your ideal crop", color: "mint" },
  { icon: "droplet", label: "Irrigation planner", detail: "Save water, grow better", color: "blue" },
  { icon: "chart", label: "Yield forecast", detail: "Plan with confidence", color: "yellow" },
];

const services = [
  { icon: "sprout", title: "Crop recommendation", copy: "Discover the best crop for your soil, climate and season.", color: "mint" },
  { icon: "leaf", title: "Fertilizer recommendation", copy: "Get a balanced nutrient plan to keep every field thriving.", color: "violet" },
  { icon: "droplet", title: "Irrigation prediction", copy: "Know when and how much to water while saving every drop.", color: "blue" },
  { icon: "chart", title: "Price prediction", copy: "Plan your market timing with data-backed price forecasts.", color: "gold" },
  { icon: "chart", title: "Yield prediction", copy: "Estimate harvest output early and make better farm plans.", color: "orange" },
];

const serviceConfigs = {
  "Crop recommendation": {
    icon: "sprout", color: "mint", kicker: "CROP INTELLIGENCE", title: "Find the right crop for your field.", copy: "Use soil nutrients, climate and rainfall conditions to discover a crop that can thrive.",
    fields: [
      ["N", "Nitrogen (N)", "number", "90"], ["P", "Phosphorus (P)", "number", "42"], ["K", "Potassium (K)", "number", "43"],
      ["temperature", "Temperature (°C)", "number", "24"], ["humidity", "Humidity (%)", "number", "72"], ["ph", "Soil pH", "number", "6.5"], ["rainfall", "Rainfall (mm)", "number", "180"],
    ],
    result: "Rice", resultCopy: "is looking like a strong match for your field.", confidence: "94%",
  },
  "Fertilizer recommendation": {
    icon: "leaf", color: "violet", kicker: "NUTRIENT PLANNER", title: "Build a healthier soil plan.", copy: "Balance soil health and crop needs with a clear fertilizer recommendation for each growth stage.",
    fields: [
      ["Soil_Type", "Soil type", "select", "Loamy", ["Clay", "Loamy", "Sandy", "Black"]],
      ["Soil_pH", "Soil pH", "number", "6.1"], ["Soil_Moisture", "Soil moisture (%)", "number", "35"], ["Organic_Carbon", "Organic carbon", "number", "0.42"],
      ["Nitrogen_Level", "Nitrogen level", "number", "61"], ["Phosphorus_Level", "Phosphorus level", "number", "44"], ["Potassium_Level", "Potassium level", "number", "84"],
      ["Crop_Type", "Crop type", "select", "Wheat", ["Wheat", "Rice", "Cotton", "Maize"]], ["Crop_Growth_Stage", "Growth stage", "select", "Vegetative", ["Germination", "Vegetative", "Flowering", "Harvest"]], ["Season", "Season", "select", "Rabi", ["Kharif", "Rabi", "Summer"]],
    ],
    result: "MOP", resultCopy: "is the recommended fertilizer for this crop stage.", confidence: "91%",
  },
  "Irrigation prediction": {
    icon: "droplet", color: "blue", kicker: "WATER INTELLIGENCE", title: "Water only when your field needs it.", copy: "Combine moisture, weather, crop and field data to make irrigation more efficient.",
    fields: [
      ["Soil_Type", "Soil type", "select", "Clay", ["Clay", "Loamy", "Sandy", "Black"]], ["Soil_pH", "Soil pH", "number", "6.1"], ["Soil_Moisture", "Soil moisture (%)", "number", "36"],
      ["Temperature_C", "Temperature (°C)", "number", "21.9"], ["Humidity", "Humidity (%)", "number", "31"], ["Rainfall_mm", "Rainfall (mm)", "number", "1167"], ["Sunlight_Hours", "Sunlight hours", "number", "4"],
      ["Crop_Type", "Crop type", "select", "Wheat", ["Wheat", "Rice", "Cotton", "Maize"]], ["Crop_Growth_Stage", "Growth stage", "select", "Vegetative", ["Germination", "Vegetative", "Flowering", "Harvest"]], ["Field_Area_hectare", "Field area (hectares)", "number", "4.7"],
    ],
    result: "Low", resultCopy: "irrigation need today. Your field can wait.", confidence: "88%",
  },
  "Price prediction": {
    icon: "chart", color: "gold", kicker: "MARKET OUTLOOK", title: "Plan your selling moment.", copy: "Review commodity, location and market movement to make a more confident price plan.",
    fields: [
      ["month", "Forecast month", "month", "2025-03"], ["commodity_name", "Commodity", "select", "Maize", ["Maize", "Wheat", "Rice", "Cotton", "Soybean"]], ["state_name", "State", "text", "India"], ["district_name", "District", "text", "All"],
      ["avg_modal_price", "Average modal price (₹)", "number", "2341.58"], ["avg_min_price", "Average minimum price (₹)", "number", "2191.23"], ["avg_max_price", "Average maximum price (₹)", "number", "2402.98"], ["change", "Recent change (%)", "number", "-14.43"],
    ],
    result: "₹2,475", resultCopy: "estimated modal price next month.", confidence: "86%",
  },
  "Yield prediction": {
    icon: "chart", color: "orange", kicker: "HARVEST FORECAST", title: "See your harvest before it arrives.", copy: "Estimate yield from your crop, field size, planting date and growing inputs.",
    fields: [
      ["Crop Type", "Crop type", "select", "Soybean", ["Soybean", "Wheat", "Rice", "Maize", "Cotton"]], ["Field Size (hectares)", "Field size (hectares)", "number", "1.04"], ["Planting Date", "Planting date", "date", "2025-06-08"],
      ["Soil Type", "Soil type", "select", "Loamy", ["Clay", "Loamy", "Sandy", "Black"]], ["Fertilizer Used", "Fertilizer used", "select", "Urea", ["Urea", "MOP", "DAP", "NPK"]], ["Irrigation Type", "Irrigation type", "select", "Furrow / Canal irrigation", ["Rainfed", "Drip irrigation", "Furrow / Canal irrigation"]],
    ],
    result: "1.46 t/ha", resultCopy: "estimated yield for this field.", confidence: "89%",
  },
};

function Icon({ name, size = 20 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    sprout: <><path d="M12 21V11" /><path d="M12 15c-3.8 0-6-2.2-6-6 3.8 0 6 2.2 6 6Z" /><path d="M12 12c0-3.8 2.2-6 6-6 0 3.8-2.2 6-6 6Z" /></>,
    droplet: <path d="M12 3.5S5.8 10.1 5.8 14.7a6.2 6.2 0 0 0 12.4 0C18.2 10.1 12 3.5 12 3.5Z" />,
    chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 3-4 3 2 5-6" /></>,
    leaf: <><path d="M20 4C10 4 4 8 4 15c0 3 2 5 5 5 7 0 11-6 11-16Z" /><path d="M4 20c3-5 7-8 12-10" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.4v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L8 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6v-2.4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L7.3 8l1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.4v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1L19 8l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v2.4h-.2a1.7 1.7 0 0 0-1.5 1Z" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function ServicePage({ serviceName, onBack, showNotice }) {
  const config = serviceConfigs[serviceName];
  const initialValues = Object.fromEntries(config.fields.map(([key, , , value]) => [key, value]));
  const [values, setValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateValue = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setSubmitted(false);
    setPrediction(null);
    setError("");
  };

  const submitPrediction = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const endpointByService = {
      "Crop recommendation": "/api/crop/recommend",
      "Fertilizer recommendation": "/api/fertilizer/predict",
      "Irrigation prediction": "/api/irrigation/predict",
      "Price prediction": "/api/price/predict",
      "Yield prediction": "/api/yield/predict",
    };
    const payload = { ...values };
    if (serviceName === "Yield prediction") {
      Object.assign(payload, {
        Crop_Type: payload["Crop Type"],
        Field_Size_hectares: payload["Field Size (hectares)"],
        Planting_Date: payload["Planting Date"],
        Soil_Type: payload["Soil Type"],
        Fertilizer_Used: payload["Fertilizer Used"],
        Irrigation_Type: payload["Irrigation Type"],
      });
      ["Crop Type", "Field Size (hectares)", "Planting Date", "Soil Type", "Fertilizer Used", "Irrigation Type"].forEach((key) => delete payload[key]);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpointByService[serviceName]}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "The model could not generate a prediction.");
      setPrediction(data.prediction);
      setSubmitted(true);
      showNotice(`${serviceName} completed`);
    } catch (requestError) {
      setError(requestError.message);
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-page">
      <button className="back-button" onClick={onBack}><Icon name="arrow" size={16} /> Back to overview</button>
      <section className="service-page-header">
        <div className={`service-page-icon ${config.color}`}><Icon name={config.icon} size={29} /></div>
        <div><span className="section-kicker">{config.kicker}</span><h1>{config.title}</h1><p>{config.copy}</p></div>
      </section>
      <div className="service-layout">
        <form className="input-card" onSubmit={submitPrediction}>
          <div className="input-card-heading"><div><span className="section-kicker">FIELD DETAILS</span><h2>Tell us about your field</h2></div><span className="step-count">STEP 1 OF 1</span></div>
          <div className="service-form-grid">{config.fields.map(([key, label, type, value, options]) => <label className="field-label" key={key}>{label}{type === "select" ? <select value={values[key]} onChange={(event) => updateValue(key, event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select> : <input type={type} value={values[key]} onChange={(event) => updateValue(key, event.target.value)} />}</label>)}</div>
          <button className="primary-service-button" type="submit" disabled={loading}>{loading ? "Generating..." : `Generate ${serviceName.toLowerCase()}`} {!loading && <Icon name="arrow" size={17} />}</button>
          {error && <p className="form-error">{error}</p>}
        </form>
        <aside className={`service-result ${submitted ? "result-ready" : ""}`}>
          <span className="result-label">YOUR {config.kicker}</span>
          <div className="result-orb"><Icon name={config.icon} size={34} /></div>
          <p className="result-intro">{submitted ? "Your personalized result is ready" : "Your result will appear here"}</p>
          <strong>{submitted ? (serviceName === "Price prediction" ? `₹${Number(prediction).toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : serviceName === "Yield prediction" ? `${Number(prediction).toFixed(2)} t/ha` : prediction) : "— —"}</strong>
          <p>{submitted ? config.resultCopy : "Complete the field details to get a clear recommendation."}</p>
          <div className="confidence"><span>Model confidence</span><b>{submitted ? config.confidence : "—"}</b><i><em style={{ width: submitted ? config.confidence : "8%" }} /></i></div>
          <small className="frontend-note">Live result from the agriculture model API</small>
        </aside>
      </div>
    </div>
  );
}

function WorkspacePage({ page, onOpenService, showNotice }) {
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [units, setUnits] = useState("Metric");
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);
  const weatherApiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (page !== "Weather station") return undefined;
    let cancelled = false;
    setWeatherLoading(true);
    setWeatherError("");
    fetch(`${weatherApiUrl}/api/weather`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Unable to load weather.");
        return data;
      })
      .then((data) => {
        if (!cancelled) setWeather(data);
      })
      .catch((error) => {
        if (!cancelled) setWeatherError(error.message);
      })
      .finally(() => {
        if (!cancelled) setWeatherLoading(false);
      });
    return () => { cancelled = true; };
  }, [page, weatherApiUrl]);
  const filteredFields = [
    ["North field", "Wheat", "32.6 ac", "Growing well", "green"],
    ["River bend", "Rice", "24.8 ac", "Needs attention", "amber"],
    ["Orchard block", "Cotton", "21.0 ac", "Ready for harvest", "blue"],
  ].filter(([name, crop]) => `${name} ${crop}`.toLowerCase().includes(search.toLowerCase()));

  if (page === "My fields") return (
    <div className="workspace-page">
      <div className="workspace-page-heading"><div><span className="section-kicker">FIELD MANAGEMENT</span><h1>Your fields, all in one place.</h1><p>Keep track of crop health, area and the next best action.</p></div><button className="primary-small" onClick={() => showNotice("New field setup started")}><Icon name="plus" size={16} /> Add field</button></div>
      <div className="toolbar-card"><div className="search-box">⌕<input placeholder="Search fields or crops" value={search} onChange={(event) => setSearch(event.target.value)} /></div><button className="filter-button">All fields⌄</button></div>
      <div className="field-grid">{filteredFields.map(([name, crop, area, status, tone]) => <article className="field-card" key={name}><div className={`field-image ${tone}`}><span>{crop}</span><i>✦</i></div><div className="field-card-body"><div><h3>{name}</h3><p>{crop} · {area}</p></div><span className={`field-status ${tone}`}>{status}</span><div className="field-progress"><span>Season progress</span><b>{name === "Orchard block" ? "91%" : name === "River bend" ? "58%" : "74%"}</b><i><em style={{ width: name === "Orchard block" ? "91%" : name === "River bend" ? "58%" : "74%" }} /></i></div><button onClick={() => showNotice(`${name} details opened`)}>View field <Icon name="arrow" size={14} /></button></div></article>)}</div>
    </div>
  );

  if (page === "Recommendations") return (
    <div className="workspace-page">
      <div className="workspace-page-heading"><div><span className="section-kicker">RECOMMENDATIONS</span><h1>Clear next steps for your farm.</h1><p>Personalized actions based on your field conditions and season.</p></div></div>
      <div className="recommendation-list">{[
        ["Crop recommendation", "North field has the right conditions for rice this season.", "94%", "mint"],
        ["Fertilizer recommendation", "Your River bend soil could use a potassium boost.", "91%", "violet"],
        ["Irrigation prediction", "Rain is expected soon. Delay irrigation for 24 hours.", "88%", "blue"],
      ].map(([title, copy, confidence, tone]) => <article className="recommendation-row" key={title}><span className={`service-icon ${tone}`}><Icon name={serviceConfigs[title]?.icon || "sprout"} size={22} /></span><div><span className="section-kicker">SUGGESTED ACTION</span><h3>{title}</h3><p>{copy}</p></div><strong>{confidence}<small>confidence</small></strong><button onClick={() => onOpenService(title)}>Review <Icon name="arrow" size={14} /></button></article>)}</div>
      <div className="empty-insight"><span>✦</span><div><h3>Want a deeper answer?</h3><p>Use one of the five field intelligence services to explore a specific decision.</p></div><button onClick={() => onOpenService("Crop recommendation")}>Start analysis <Icon name="arrow" size={14} /></button></div>
    </div>
  );

  if (page === "Insights") return (
    <div className="workspace-page">
      <div className="workspace-page-heading"><div><span className="section-kicker">FARM INSIGHTS</span><h1>See the story behind your numbers.</h1><p>Simple trends that help you plan the week ahead.</p></div><button className="filter-button">This season⌄</button></div>
      <div className="insight-metric-grid"><article><span>Average yield</span><strong>4.8 <small>t/ha</small></strong><b>+14.1% <small>vs last season</small></b></article><article><span>Water saved</span><strong>18.4 <small>kL</small></strong><b>+12.6% <small>this month</small></b></article><article><span>Healthy field area</span><strong>78.4 <small>ac</small></strong><b>+8.2% <small>this season</small></b></article></div>
      <div className="insight-panels"><article className="insight-chart-card"><div className="panel-heading"><div><span className="section-kicker">SEASON TREND</span><h3>Yield performance</h3></div><span className="chart-pill">On track</span></div><div className="insight-bars">{[42, 55, 48, 70, 62, 78, 91].map((height, index) => <span key={index} style={{ height: `${height}%` }}><i>{["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"][index]}</i></span>)}</div></article><article className="insight-tasks"><div className="panel-heading"><div><span className="section-kicker">THIS WEEK</span><h3>Focus areas</h3></div></div>{["Check River bend moisture", "Review fertilizer plan", "Schedule harvest window"].map((task) => <label key={task}><input type="checkbox" />{task}</label>)}</article></div>
    </div>
  );

  if (page === "Weather station") return (
    <div className="workspace-page">
      <div className="workspace-page-heading"><div><span className="section-kicker">WEATHER STATION</span><h1>Know what the sky is planning.</h1><p>Live conditions and forecast for your configured farm location.</p></div><span className="live-chip"><i /> {weatherLoading ? "Updating..." : "Live forecast"}</span></div>
      {weatherError && <p className="form-error">{weatherError}</p>}
      {weather && <><div className="weather-dashboard"><div className="current-weather"><div className="weather-sun large"><Icon name="sun" size={39} /></div><div><strong>{weather.current.temperature}°</strong><span>{weather.current.description}</span><small>{weather.location}{weather.country ? `, ${weather.country}` : ""} · Updated just now</small></div></div><div className="weather-reading"><span>Humidity</span><strong>{weather.current.humidity}%</strong><i><em style={{ width: `${weather.current.humidity}%` }} /></i></div><div className="weather-reading"><span>Wind speed</span><strong>{weather.current.wind_speed} km/h</strong><i><em style={{ width: `${Math.min(weather.current.wind_speed * 3, 100)}%` }} /></i></div><div className="weather-reading"><span>Rain chance</span><strong>{weather.current.rain_probability}%</strong><i><em style={{ width: `${weather.current.rain_probability}%` }} /></i></div></div>
      <div className="forecast-card"><div className="panel-heading"><div><span className="section-kicker">5-DAY OUTLOOK</span><h3>Plan around the weather</h3></div></div><div className="forecast-row">{weather.forecast.map((day) => <div key={day.date}><span>{new Date(`${day.date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short" })}</span><Icon name={day.rain_probability > 40 ? "droplet" : "sun"} size={22} /><strong>{day.high}°</strong><small>{day.rain_probability}% rain</small></div>)}</div></div></>}
    </div>
  );

  return (
    <div className="workspace-page">
      <div className="workspace-page-heading"><div><span className="section-kicker">PREFERENCES</span><h1>Make field.ly work your way.</h1><p>Choose how your workspace looks and keeps you updated.</p></div></div>
      <div className="settings-card"><label><span><strong>Weather alerts</strong><small>Get notified about rain, frost and extreme conditions.</small></span><input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} /><i /></label><label><span><strong>Measurement units</strong><small>Use the unit system that feels natural for your farm.</small></span><select value={units} onChange={(event) => setUnits(event.target.value)}><option>Metric</option><option>Imperial</option></select></label><label><span><strong>Weekly farm digest</strong><small>A summary of your fields and recommendations every Monday.</small></span><input type="checkbox" defaultChecked /><i /></label></div>
    </div>
  );
}

function App() {
  const [slide, setSlide] = useState(0);
  const [activeNav, setActiveNav] = useState("Overview");
  const [selectedTool, setSelectedTool] = useState("Crop recommendation");
  const [crop, setCrop] = useState("Wheat");
  const [notice, setNotice] = useState("");
  const [servicePage, setServicePage] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/weather`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Weather unavailable");
        return data;
      })
      .then((data) => {
        if (!cancelled) setCurrentWeather(data);
      })
      .catch(() => {
        if (!cancelled) setCurrentWeather(null);
      });
    return () => { cancelled = true; };
  }, []);

  const activeSlide = slides[slide];
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  }, []);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Icon name="leaf" size={22} /></div>
          <span>field<span className="brand-dot">.</span>ly</span>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="main-nav">
          {["Overview", "My fields", "Recommendations", "Insights"].map((item, index) => (
            <button className={`nav-item ${activeNav === item ? "active" : ""}`} onClick={() => { setActiveNav(item); setServicePage(""); }} key={item}>
              <Icon name={["grid", "sprout", "leaf", "chart"][index]} size={19} /><span>{item}</span>{item === "Insights" && <span className="nav-badge">3</span>}
            </button>
          ))}
        </nav>
        <div className="workspace-label tools-label">TOOLS</div>
        <nav className="main-nav">
          <button className={`nav-item ${activeNav === "Weather station" ? "active" : ""}`} onClick={() => { setActiveNav("Weather station"); setServicePage(""); }}><Icon name="sun" size={19} /><span>Weather station</span></button>
          <button className={`nav-item ${activeNav === "Settings" ? "active" : ""}`} onClick={() => { setActiveNav("Settings"); setServicePage(""); }}><Icon name="settings" size={19} /><span>Settings</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><Icon name="sprout" size={18} /></div>
            <strong>Need a hand?</strong>
            <p>Our farm guides are here to help.</p>
            <button onClick={() => showNotice("A farm guide will be in touch soon")}>Talk to an expert <Icon name="arrow" size={14} /></button>
          </div>
          <div className="profile">
            <div className="avatar">AM</div><div><strong>Alex Morgan</strong><small>Sunrise Valley Farm</small></div><span className="profile-more">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu"><Icon name="menu" /></button>
          <div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{activeNav}</strong></div>
          <div className="top-actions"><span className="sync-status"><i /> Last synced 2 min ago</span><button className="icon-button" onClick={() => showNotice("You are all caught up")} aria-label="Notifications"><Icon name="bell" size={19} /><em>2</em></button><button className="new-button" onClick={() => showNotice("New field setup started")}><Icon name="plus" size={16} /> New activity</button></div>
        </header>

        <div className="page-content">
          {servicePage ? <ServicePage serviceName={servicePage} onBack={() => { setServicePage(""); setActiveNav("Overview"); }} showNotice={showNotice} /> : activeNav !== "Overview" ? <WorkspacePage page={activeNav} onOpenService={(name) => { setServicePage(name); setActiveNav("Overview"); }} showNotice={showNotice} /> : <>
          <section className="welcome-row">
            <div><p className="overline">{greeting}, Alex <span className="wave">✦</span></p><h1>Here’s your farm at a glance.</h1><p className="subheading">A little progress every day adds up to a great season.</p></div>
            <div className="weather-pill"><div className="weather-sun"><Icon name={currentWeather?.current.rain_probability > 40 ? "droplet" : "sun"} size={24} /></div><div><strong>{currentWeather ? `${currentWeather.current.temperature}°` : "—"} <span>{currentWeather?.current.description || "Weather unavailable"}</span></strong><small>{currentWeather ? `${currentWeather.location} · Today` : "Connect to weather service"}</small></div></div>
          </section>

          <section className={`hero-banner ${activeSlide.className}`} key={slide}>
            <div className="hero-copy"><span className="hero-eyebrow">{activeSlide.eyebrow}</span><h2>{activeSlide.title}</h2><p>{activeSlide.copy}</p><button className="hero-button" onClick={() => showNotice("Opening your farm insights")} >Explore insights <Icon name="arrow" size={16} /></button></div>
            <div className="hero-visual"><div className="sun-orb" /><div className="hill hill-back" /><div className="hill hill-front" /><div className="hero-plant plant-one">✦</div><div className="hero-plant plant-two">✦</div><span className="hero-accent">{activeSlide.accent}</span></div>
            <div className="hero-dots">{slides.map((item, index) => <button aria-label={`Show slide ${index + 1}`} className={slide === index ? "selected" : ""} onClick={() => setSlide(index)} key={item.eyebrow} />)}</div>
          </section>

          <section className="services-section">
            <div className="section-heading services-heading"><div><span className="section-kicker">SMART FARM SERVICES</span><h2>Everything your farm needs to grow.</h2></div><p>AI-powered guidance for every important decision.</p></div>
            <div className="services-grid">{services.map((service) => <button className="service-card" key={service.title} onClick={() => setServicePage(service.title)}><span className={`service-icon ${service.color}`}><Icon name={service.icon} size={25} /></span><span className="service-card-copy"><strong>{service.title}</strong><small>{service.copy}</small><em>Open service <Icon name="arrow" size={14} /></em></span></button>)}</div>
          </section>

          <section className="section-heading"><div><span className="section-kicker">YOUR SNAPSHOT</span><h2>Small steps, strong roots.</h2></div><button className="text-button" onClick={() => setActiveNav("Insights")}>View all insights <Icon name="arrow" size={15} /></button></section>
          <section className="stats-grid">
            <article className="stat-card"><div className="stat-top"><span className="stat-icon green"><Icon name="sprout" size={20} /></span><span className="trend up">+8.2%</span></div><strong>78.4 <small>ac</small></strong><p>Active growing area</p><div className="mini-bars green-bars"><i /><i /><i /><i /><i /><i /><i /></div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-icon blue"><Icon name="droplet" size={20} /></span><span className="trend up">-12.6%</span></div><strong>64<span className="percent">%</span></strong><p>Water efficiency</p><div className="progress-track"><i style={{ width: "64%" }} /></div><small className="goal-label">Goal: 75% <span>on track</span></small></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-icon gold"><Icon name="chart" size={20} /></span><span className="trend up">+14.1%</span></div><strong>4.8 <small>t/ha</small></strong><p>Expected yield</p><div className="mini-bars gold-bars"><i /><i /><i /><i /><i /><i /><i /></div></article>
          </section>

          <section className="lower-grid">
            <article className="panel activity-panel"><div className="panel-heading"><div><span className="section-kicker">FIELD ACTIVITY</span><h3>Growing conditions</h3></div><button className="period-select">Last 7 days <span>⌄</span></button></div><div className="chart-area"><div className="chart-y"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="chart"><div className="grid-line" /><div className="grid-line" /><div className="grid-line" /><div className="grid-line" /><svg viewBox="0 0 600 180" preserveAspectRatio="none"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#a3d96d" stopOpacity=".35" /><stop offset="1" stopColor="#a3d96d" stopOpacity="0" /></linearGradient></defs><path className="chart-fill" d="M0,129 C35,130 45,112 81,119 S128,90 158,104 S200,120 235,79 S278,100 315,81 S350,54 382,67 S420,92 452,58 S495,76 527,45 S568,54 600,27 V180 H0Z" /><path className="chart-line" d="M0,129 C35,130 45,112 81,119 S128,90 158,104 S200,120 235,79 S278,100 315,81 S350,54 382,67 S420,92 452,58 S495,76 527,45 S568,54 600,27" /></svg><div className="chart-x"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div></div><div className="legend"><span><i className="legend-dot soil" /> Soil health</span><span><i className="legend-dot moisture" /> Moisture level</span><strong>+18.4% <small>this week</small></strong></div></article>
            <article className="panel tools-panel"><div className="panel-heading"><div><span className="section-kicker">QUICK ACTIONS</span><h3>What would you like to do?</h3></div></div><div className="tool-list">{tools.map((tool) => <button className={`tool-row ${selectedTool === tool.label ? "chosen" : ""}`} key={tool.label} onClick={() => { setSelectedTool(tool.label); showNotice(`${tool.label} selected`); }}><span className={`tool-icon ${tool.color}`}><Icon name={tool.icon} size={19} /></span><span><strong>{tool.label}</strong><small>{tool.detail}</small></span><Icon name="arrow" size={16} /></button>)}</div><button className="full-action" onClick={() => showNotice("All farm tools are now available")}>See all tools <Icon name="arrow" size={15} /></button></article>
          </section>

          <section className="recommendation-card"><div className="rec-copy"><span className="section-kicker">PERSONALIZED FOR YOUR FARM</span><h2>Ready for your next best move?</h2><p>Tell us what you’re growing and we’ll tailor a recommendation for your field.</p></div><div className="rec-form"><label>I’m growing <select value={crop} onChange={(event) => setCrop(event.target.value)}><option>Wheat</option><option>Corn</option><option>Rice</option><option>Tomato</option></select></label><button onClick={() => showNotice(`${crop} recommendation is ready`)}>Get recommendation <Icon name="arrow" size={16} /></button></div></section>
          </>}
        </div>
      </main>
      {notice && <div className="toast"><span>✓</span>{notice}</div>}
    </div>
  );
}

export default App;