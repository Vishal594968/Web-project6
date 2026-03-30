// ═══════════════════════════════════════════════════════
// script.js — MediCheck Symptom Health Predictor
// Pure JavaScript (ES6+) — Data, Constants & Algorithm
// ═══════════════════════════════════════════════════════

// ───── SYMPTOM CATEGORIES ─────
const SYMPTOM_CATEGORIES = {
  "All": null,
  "🧠 Head & Neuro": ["Headache","Migraine","Dizziness","Confusion","Memory issues","Fainting","Blurred vision","Ringing in ears"],
  "🫁 Respiratory": ["Cough","Shortness of breath","Wheezing","Chest tightness","Runny nose","Sore throat","Loss of smell","Nasal congestion"],
  "🫀 Cardiac": ["Chest pain","Palpitations","Rapid heartbeat","Swollen ankles","Shortness of breath"],
  "🤢 Digestive": ["Nausea","Vomiting","Diarrhea","Constipation","Abdominal pain","Bloating","Heartburn","Loss of appetite"],
  "🦴 Musculoskeletal": ["Joint pain","Muscle aches","Back pain","Neck stiffness","Swelling","Weakness","Cramping"],
  "🌡️ Systemic": ["Fever","Chills","Fatigue","Sweating","Weight loss","Weight gain","Swollen lymph nodes"],
  "🩺 Skin": ["Rash","Itching","Hives","Yellowing skin","Pale skin","Bruising","Dry skin"],
  "👁️ Eyes & ENT": ["Eye redness","Eye pain","Blurred vision","Ear pain","Hearing loss","Runny nose","Sneezing"],
  "🚽 Urinary": ["Frequent urination","Painful urination","Blood in urine","Dark urine","Reduced urination"],
};

// ───── ALL SYMPTOMS (deduplicated using Set) ─────
const ALL_SYMPTOMS = [...new Set(
  Object.values(SYMPTOM_CATEGORIES).filter(Boolean).flat()
)].sort();

// ───── SYMPTOM ICON MAP ─────
const SYMPTOM_ICONS = {
  "Headache":"🤕","Migraine":"💥","Dizziness":"😵","Confusion":"😶‍🌫️","Memory issues":"🧩",
  "Fainting":"😴","Blurred vision":"👁️","Ringing in ears":"👂","Cough":"😮‍💨","Shortness of breath":"😤",
  "Wheezing":"🫧","Chest tightness":"🫀","Runny nose":"🤧","Sore throat":"🤒","Loss of smell":"👃",
  "Nasal congestion":"😤","Chest pain":"💔","Palpitations":"💗","Rapid heartbeat":"❤️",
  "Swollen ankles":"🦵","Nausea":"🤢","Vomiting":"🤮","Diarrhea":"🚽","Constipation":"😣",
  "Abdominal pain":"🫃","Bloating":"🎈","Heartburn":"🔥","Loss of appetite":"🍽️","Joint pain":"🦴",
  "Muscle aches":"💪","Back pain":"🏋️","Neck stiffness":"🤸","Swelling":"🫧","Weakness":"😩",
  "Cramping":"⚡","Fever":"🌡️","Chills":"🥶","Fatigue":"😴","Sweating":"💧","Weight loss":"📉",
  "Weight gain":"📈","Swollen lymph nodes":"🔵","Rash":"🟠","Itching":"🤌","Hives":"🔴",
  "Yellowing skin":"🟡","Pale skin":"⬜","Bruising":"🫙","Dry skin":"🏜️","Eye redness":"🔴",
  "Eye pain":"😖","Ear pain":"👂","Hearing loss":"🔇","Sneezing":"🤧","Frequent urination":"🚽",
  "Painful urination":"😣","Blood in urine":"🔴","Dark urine":"🟤","Reduced urination":"⬇️",
};

// ───── CONDITIONS DATABASE ─────
const CONDITIONS = [
  {
    id: 1, name: "Common Cold", icon: "🤧", category: "Respiratory Infection",
    symptoms: ["Runny nose","Cough","Sore throat","Sneezing","Nasal congestion","Fatigue","Headache"],
    descriptions: "A viral infection of the upper respiratory tract, caused by rhinoviruses.",
    causes: ["Rhinovirus","Coronavirus variants","RSV","Weakened immunity","Cold weather exposure"],
    treatments: ["Rest and hydration","Over-the-counter decongestants","Saline nasal spray","Honey and lemon","Vitamin C supplements"],
    when_to_seek: ["High fever (>103°F)","Symptoms lasting >10 days","Severe headache","Difficulty breathing"],
    urgency: "low",
    prevention: ["Frequent handwashing","Avoid close contact","Boost immunity"]
  },
  {
    id: 2, name: "Influenza (Flu)", icon: "🌡️", category: "Viral Infection",
    symptoms: ["Fever","Chills","Muscle aches","Fatigue","Headache","Cough","Sore throat","Sweating"],
    causes: ["Influenza A/B virus","Contact with infected persons","Weakened immune system"],
    treatments: ["Antiviral medications (Tamiflu)","Bed rest","Fluids","Fever reducers (Paracetamol)","Isolation"],
    when_to_seek: ["Breathing difficulty","Persistent chest pain","Severe vomiting","Confusion","Cyanosis"],
    urgency: "moderate",
    prevention: ["Annual flu vaccine","Hand hygiene","Mask wearing during outbreaks"]
  },
  {
    id: 3, name: "COVID-19", icon: "🦠", category: "Viral Infection",
    symptoms: ["Fever","Cough","Shortness of breath","Fatigue","Loss of smell","Headache","Muscle aches","Sore throat"],
    causes: ["SARS-CoV-2 virus","Airborne/droplet transmission","Contact with infected surfaces"],
    treatments: ["Isolation","Supportive care","Antiviral medications (if prescribed)","Oxygen therapy if severe","Vaccination"],
    when_to_seek: ["Severe breathing difficulty","Persistent chest pain","Confusion","Blue lips/face","SpO₂ <94%"],
    urgency: "high",
    prevention: ["Vaccination","Masking","Ventilation","Testing"]
  },
  {
    id: 4, name: "Hypertension", icon: "💉", category: "Cardiovascular",
    symptoms: ["Headache","Dizziness","Blurred vision","Chest pain","Shortness of breath","Palpitations","Fatigue"],
    causes: ["Genetics","High sodium diet","Obesity","Stress","Sedentary lifestyle","Kidney disease"],
    treatments: ["Antihypertensive medications","Low-sodium diet","Regular exercise","Weight management","Stress reduction","Quit smoking"],
    when_to_seek: ["BP >180/120","Severe headache","Chest pain","Vision changes","Difficulty speaking"],
    urgency: "high",
    prevention: ["Healthy diet","Exercise","Limit alcohol","No smoking","Regular BP checks"]
  },
  {
    id: 5, name: "Migraine", icon: "💥", category: "Neurological",
    symptoms: ["Migraine","Headache","Blurred vision","Nausea","Vomiting","Dizziness","Sensitivity to light"],
    causes: ["Hormonal changes","Stress","Certain foods/drinks","Sleep disruption","Bright lights","Strong smells"],
    treatments: ["Triptans","NSAIDs","Anti-nausea medication","Dark quiet room","Cold/warm compress","Preventive therapy"],
    when_to_seek: ["Worst headache of life","Sudden onset","Neurological symptoms","Fever with stiff neck"],
    urgency: "moderate",
    prevention: ["Identify triggers","Regular sleep","Stay hydrated","Stress management"]
  },
  {
    id: 6, name: "Gastroenteritis", icon: "🤢", category: "Gastrointestinal",
    symptoms: ["Nausea","Vomiting","Diarrhea","Abdominal pain","Fever","Fatigue","Loss of appetite","Cramping"],
    causes: ["Norovirus","Rotavirus","Bacterial contamination","Food poisoning","Parasites"],
    treatments: ["Oral rehydration salts","Clear fluids","BRAT diet","Rest","Probiotics","Anti-nausea meds"],
    when_to_seek: ["Signs of dehydration","Blood in stool","High fever","Symptoms >3 days","Severe pain"],
    urgency: "moderate",
    prevention: ["Food hygiene","Handwashing","Safe water","Proper food storage"]
  },
  {
    id: 7, name: "Anemia", icon: "🩸", category: "Blood Disorder",
    symptoms: ["Fatigue","Weakness","Pale skin","Shortness of breath","Dizziness","Rapid heartbeat","Headache"],
    causes: ["Iron deficiency","Vitamin B12 deficiency","Chronic disease","Blood loss","Genetic conditions"],
    treatments: ["Iron supplements","B12 injections/supplements","Dietary changes","Treat underlying cause","Blood transfusion (severe)"],
    when_to_seek: ["Extreme fatigue","Chest pain","Fainting","Signs of bleeding"],
    urgency: "moderate",
    prevention: ["Iron-rich diet","Regular blood tests","Treat underlying conditions"]
  },
  {
    id: 8, name: "Type 2 Diabetes", icon: "🍬", category: "Endocrine",
    symptoms: ["Frequent urination","Fatigue","Weight loss","Blurred vision","Sweating"],
    causes: ["Insulin resistance","Obesity","Sedentary lifestyle","Genetics","Age","Poor diet"],
    treatments: ["Metformin","Lifestyle changes","Blood sugar monitoring","Low-carb diet","Exercise","Insulin (if needed)"],
    when_to_seek: ["Blood sugar >300mg/dL","Diabetic ketoacidosis symptoms","Severe hypoglycemia"],
    urgency: "high",
    prevention: ["Healthy weight","Exercise","Balanced diet","Regular screening"]
  },
  {
    id: 9, name: "Asthma", icon: "🫁", category: "Respiratory",
    symptoms: ["Wheezing","Shortness of breath","Chest tightness","Cough","Fatigue"],
    causes: ["Allergens","Air pollution","Exercise","Cold air","Respiratory infections","Stress"],
    treatments: ["Bronchodilators (rescue inhaler)","Corticosteroids (preventer)","Avoid triggers","Allergy management","Action plan"],
    when_to_seek: ["Severe attack","No relief from inhaler","Blue lips","Can't speak in sentences"],
    urgency: "high",
    prevention: ["Know triggers","Use preventer inhaler","Air quality monitoring"]
  },
  {
    id: 10, name: "Urinary Tract Infection", icon: "🚽", category: "Urological",
    symptoms: ["Painful urination","Frequent urination","Dark urine","Blood in urine","Abdominal pain","Fever"],
    causes: ["E. coli bacteria","Poor hygiene","Catheter use","Sexual activity","Weakened immunity"],
    treatments: ["Antibiotics","Increased fluid intake","Cranberry products","Pain relievers","Probiotics after treatment"],
    when_to_seek: ["High fever with chills","Kidney pain","Blood in urine","Symptoms persist >2 days"],
    urgency: "moderate",
    prevention: ["Stay hydrated","Proper hygiene","Urinate after intercourse","Wipe front to back"]
  },
  {
    id: 11, name: "Anxiety Disorder", icon: "😰", category: "Mental Health",
    symptoms: ["Rapid heartbeat","Sweating","Dizziness","Shortness of breath","Chest tightness","Fatigue","Headache","Muscle aches"],
    causes: ["Chronic stress","Trauma","Genetics","Neurochemical imbalance","Caffeine excess","Medical conditions"],
    treatments: ["CBT therapy","SSRIs/SNRIs","Mindfulness","Exercise","Breathing techniques","Lifestyle changes"],
    when_to_seek: ["Panic attacks","Avoiding daily activities","Thoughts of self-harm"],
    urgency: "moderate",
    prevention: ["Stress management","Regular exercise","Limit caffeine","Social support"]
  },
  {
    id: 12, name: "Allergic Rhinitis", icon: "🌸", category: "Allergy",
    symptoms: ["Runny nose","Sneezing","Nasal congestion","Itching","Eye redness","Cough"],
    causes: ["Pollen","Dust mites","Pet dander","Mold","Cockroaches"],
    treatments: ["Antihistamines","Nasal corticosteroids","Decongestants","Allergen immunotherapy","Saline rinse"],
    when_to_seek: ["Severe symptoms unresponsive to OTC meds","Asthma complications","Sinus infections"],
    urgency: "low",
    prevention: ["Identify allergens","HEPA filters","Regular cleaning","Pollen monitoring"]
  },
  {
    id: 13, name: "Hepatitis", icon: "🟡", category: "Liver Disease",
    symptoms: ["Yellowing skin","Fatigue","Abdominal pain","Nausea","Vomiting","Dark urine","Loss of appetite","Fever"],
    causes: ["Hepatitis A/B/C virus","Alcohol","Medications","Autoimmune","Fatty liver"],
    treatments: ["Antiviral medications","Interferon therapy","Supportive care","Avoid alcohol","Liver transplant (severe)"],
    when_to_seek: ["Jaundice","Severe abdominal pain","Mental confusion","Bleeding easily"],
    urgency: "high",
    prevention: ["Hepatitis vaccination","Safe sex","Clean needles","Avoid sharing personal items"]
  },
  {
    id: 14, name: "Arthritis", icon: "🦴", category: "Musculoskeletal",
    symptoms: ["Joint pain","Swelling","Weakness","Fatigue","Cramping"],
    causes: ["Autoimmune (RA)","Cartilage breakdown (OA)","Uric acid crystals (gout)","Age","Genetics","Obesity"],
    treatments: ["NSAIDs","DMARDs (RA)","Physical therapy","Corticosteroid injections","Joint replacement","Weight loss"],
    when_to_seek: ["Sudden severe joint pain","Joint is hot and red","Can't bear weight","Fever with joint pain"],
    urgency: "moderate",
    prevention: ["Maintain healthy weight","Exercise","Protect joints","Early treatment"]
  },
  {
    id: 15, name: "Depression", icon: "😔", category: "Mental Health",
    symptoms: ["Fatigue","Weakness","Headache","Muscle aches","Weight loss","Weight gain","Sweating","Dizziness"],
    causes: ["Neurochemical imbalance","Trauma","Chronic illness","Genetics","Hormonal changes","Social isolation"],
    treatments: ["Antidepressants (SSRIs)","Psychotherapy (CBT)","Exercise","Social support","Light therapy","Lifestyle changes"],
    when_to_seek: ["Suicidal thoughts","Unable to function","Psychotic symptoms"],
    urgency: "high",
    prevention: ["Social connections","Regular exercise","Stress management","Sleep hygiene"]
  },
];

// ───── SYMPTOM ANALYSIS ALGORITHM ─────
// Takes selected symptoms, severity ratings, and user profile
// Returns scored and sorted list of possible conditions
function analyzeSymptoms(selectedSymptoms, severities, profile) {

  // Return empty if no symptoms selected
  if (!selectedSymptoms.length) return [];

  return CONDITIONS.map(cond => {

    // Find which of the user's symptoms match this condition
    const matched = selectedSymptoms.filter(s => cond.symptoms.includes(s));

    // Skip conditions with no matching symptoms
    if (!matched.length) return null;

    // Calculate base score using severity weights
    let score = 0;
    matched.forEach(s => {
      const sev = severities[s] || 3;
      // Higher severity = higher contribution to score
      score += (sev / 10) * (1 / cond.symptoms.length) * 100;
    });

    // Adjust score by symptom overlap ratio
    const overlapRatio = matched.length / cond.symptoms.length;
    const coverageBonus = (matched.length / selectedSymptoms.length) * 30;
    score = score * (0.5 + overlapRatio * 0.5) + coverageBonus;

    // Age and gender modifiers using profile data
    const age = parseInt(profile.age) || 30;
    if (cond.category === "Cardiovascular" && age > 45) score *= 1.2;
    if (cond.category === "Endocrine" && age > 40) score *= 1.1;
    if (cond.category === "Musculoskeletal" && age > 50) score *= 1.15;
    if (profile.gender === "female" && cond.name === "Anemia") score *= 1.2;

    // Return condition with computed probability (capped at 97%)
    return {
      ...cond,
      matchedSymptoms: matched,
      probability: Math.min(Math.round(score), 97)
    };

  })
  .filter(Boolean)           // Remove null entries (no matches)
  .sort((a, b) => b.probability - a.probability)  // Sort highest first
  .slice(0, 6);              // Return top 6 matches only
}
