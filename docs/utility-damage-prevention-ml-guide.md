# Utility Locating Damage Prevention: AI/ML Risk Assessment System Guide

## Project Overview

**Goal:** Create a machine learning AI model to calculate risk associated with locate requests based on in-depth factors for utility locating, using the score to identify locate requests that are at high risk of being damaged (whether from weather, excavator error, or locator error).

**Target:** Specific to utility locating damage prevention industry

**Timeline Context:** Target company has contract data potentially dating back to 2020 (3-year contract + 3-year extension)

-----

## Table of Contents

1. [Use Case Analysis](#use-case-analysis)
1. [Data Scenarios](#data-scenarios)
1. [Recommended Tools & Libraries](#recommended-tools--libraries)
1. [System Architecture Options](#system-architecture-options)
1. [Implementation Approaches](#implementation-approaches)
1. [Feature Engineering Guide](#feature-engineering-guide)
1. [MVP Development Plan](#mvp-development-plan)
1. [Next Steps](#next-steps)

-----

## Use Case Analysis

### Problem Type

**Risk Classification/Scoring Problem** with domain-specific features

### Key Objectives

- Predict damage probability for each locate request
- Provide interpretable risk scores (0-100 or 0-1 probability)
- Identify top contributing risk factors
- Enable proactive intervention on high-risk requests

### Success Metrics

- Precision/Recall on damage prediction
- Reduction in actual damage incidents
- Early identification of high-risk scenarios
- Stakeholder trust in risk scores (requires explainability)

-----

## Data Scenarios

### Scenario 1: Historical Data Available (2020-present)

**Advantages:**

- ~5 years of data excellent for training
- Can immediately deploy predictive model
- Can identify historical patterns and validate against known damages

**Required Data Elements:**

- Locate request details (type of work, depth, utility types present)
- Excavator information (company, safety record if tracked)
- Damage outcomes (binary: damage/no damage, severity, cause)
- Dates (for weather correlation)
- Locations (for geographic risk patterns)
- Locator assignments and experience levels
- Response times and SLA metrics

**Initial Steps:**

1. **Data Audit** - Meet with locate company and utility owner/operator
1. **Data Export Request** - Get sample exports to assess quality/completeness
1. **Data Cleaning** - Handle missing values, standardize formats
1. **Feature Engineering** - Transform raw data into predictive features
1. **Model Training** - Start with XGBoost/Random Forest
1. **Validation** - Test on recent data (last 6 months)
1. **Deployment** - API or dashboard for real-time scoring

### Scenario 2: Start Fresh (Cold Start - No Historical Data)

**Challenge:** No historical data means no training examples initially

**Solution: Rule-Based System → ML Hybrid Evolution**

**Phase 1: Rule-Based Risk Scoring (Months 1-6)**

- Build expert system using domain knowledge
- Implement weighted risk factors
- Deploy immediately to start collecting data

**Phase 2: Data Collection (Months 1-12)**

- Log every locate request with features
- Track outcomes (damage, near-miss, clear)
- Build labeled dataset in real-time

**Phase 3: ML Transition (After 6-12 months)**

- Train initial ML model on collected data
- Compare ML vs rule-based performance
- Gradually increase ML weight in final score

-----

## Recommended Tools & Libraries

### Core ML Frameworks

#### scikit-learn

**Purpose:** Classification and risk scoring foundation

- Random Forests for interpretable predictions
- Logistic Regression for probability-based risk
- Excellent for tabular data with multiple factors
- Simple train/test splitting and cross-validation

**Installation:**

```bash
pip install scikit-learn
```

#### XGBoost / LightGBM

**Purpose:** Advanced gradient boosting (recommended primary model)

- Handles mixed data types (categorical + numerical)
- Provides feature importance rankings
- Outputs calibrated probability scores
- Superior performance on structured data
- Handles missing values naturally

**Why this is ideal for your use case:**

- Non-linear relationships between risk factors
- Natural probability output (0-1 scale)
- Robust to data quality issues
- Fast training and prediction

**Installation:**

```bash
pip install xgboost lightgbm
```

### Data Processing

#### pandas

**Purpose:** Data organization and manipulation

- Organizing locate request data
- Merging excavator history, weather, damage records
- Feature engineering and transformations
- Essential for any ML project

**Installation:**

```bash
pip install pandas
```

#### NumPy

**Purpose:** Numerical computations

- Risk calculations and aggregations
- Array operations for model inputs

**Installation:**

```bash
pip install numpy
```

#### imbalanced-learn

**Purpose:** Handling class imbalance

- Critical since damage events are rare
- SMOTE, undersampling, cost-sensitive learning
- Improves model's ability to catch rare damages

**Installation:**

```bash
pip install imbalanced-learn
```

### Geospatial Analysis

#### GeoPandas

**Purpose:** Location-based risk analysis

- Proximity to previous damage sites
- Utility density mapping
- Geographic risk zones
- Spatial clustering of incidents

**Installation:**

```bash
pip install geopandas
```

#### Shapely

**Purpose:** Utility line geometry operations

- Distance calculations
- Intersection detection
- Buffer zones around high-risk areas

**Installation:**

```bash
pip install shapely
```

#### Folium / Plotly

**Purpose:** Interactive map visualizations

- Display high-risk areas on maps
- Heat maps of damage incidents
- Stakeholder presentations

**Installation:**

```bash
pip install folium plotly
```

### Model Interpretability (Critical for This Domain)

#### SHAP (SHapley Additive exPlanations)

**Purpose:** Explain individual predictions

- Why did this specific locate request get high risk score?
- Which features contributed most?
- Essential for stakeholder trust and regulatory compliance

**Installation:**

```bash
pip install shap
```

#### LIME (Local Interpretable Model-agnostic Explanations)

**Purpose:** Alternative explanation method

- Simpler than SHAP for some use cases
- Good for explaining to non-technical stakeholders

**Installation:**

```bash
pip install lime
```

#### ELI5

**Purpose:** Simple feature importance visualization

- Quick feature weight displays
- Works well with scikit-learn models

**Installation:**

```bash
pip install eli5
```

### Deployment & Integration

#### Flask / FastAPI

**Purpose:** Build REST API for risk scoring

- Accept locate request details via API
- Return risk score and explanation
- Integrate with existing locate management systems

**Example API endpoint:**

```python
POST /api/calculate-risk
{
  "excavator_id": "EXC-12345",
  "utility_types": ["gas", "electric"],
  "weather_conditions": "heavy_rain",
  "soil_type": "clay",
  ...
}

Response:
{
  "risk_score": 0.78,
  "risk_level": "HIGH",
  "top_factors": [
    {"factor": "heavy_rain", "contribution": 0.25},
    {"factor": "excavator_violations", "contribution": 0.20},
    ...
  ]
}
```

**Installation:**

```bash
pip install flask
# or
pip install fastapi uvicorn
```

#### Streamlit

**Purpose:** Quick dashboard development

- Visualize risk scores and trends
- Interactive filtering and exploration
- Demo tool for stakeholder presentations
- NO web development experience needed

**Installation:**

```bash
pip install streamlit
```

#### Docker

**Purpose:** Consistent deployment packaging

- Package model, dependencies, and API together
- Easy deployment to cloud or on-premise
- Consistent environment across dev/prod

**Installation:** Download from docker.com

### Workflow & Experiment Tracking

#### MLflow

**Purpose:** Track model versions and experiments

- Compare rule-based vs ML performance
- Version control for models
- Track which features improve accuracy
- Essential during rule-to-ML transition

**Installation:**

```bash
pip install mlflow
```

#### Label Studio

**Purpose:** Human review of edge cases

- When ML is uncertain, flag for expert review
- Build training data collaboratively
- Quality control on predictions

**Installation:**

```bash
pip install label-studio
```

### Database Options

#### PostgreSQL

**Purpose:** Production-grade data storage

- Store locate requests and outcomes
- Query historical patterns
- Scales well with data growth

#### SQLite

**Purpose:** Lightweight option for MVP/POC

- Single file database
- No server setup needed
- Good for initial development

**Installation:**

```bash
pip install psycopg2  # PostgreSQL
# SQLite comes with Python
```

-----

## System Architecture Options

### Option 1: ML-First (With Historical Data)

```
Historical Data (2020-2025)
    ↓
Data Cleaning & Feature Engineering (pandas)
    ↓
Train/Test Split (scikit-learn)
    ↓
Model Training (XGBoost)
    ↓
Model Validation & Tuning
    ↓
Deployment (FastAPI + Docker)
    ↓
Real-time Risk Scoring API
    ↓
Dashboard (Streamlit)
```

**Timeline:** 2-3 months to initial deployment

### Option 2: Rule-Based → ML Evolution (Cold Start)

```
Phase 1 (Months 1-6):
Expert Rules (Python) → Risk Score → Collect Data
    ↓
Phase 2 (Months 6-12):
Accumulated Data → Train Initial ML Model → Compare Performance
    ↓
Phase 3 (Months 12+):
Hybrid System: ML (70%) + Rules (30%) → Continuous Improvement
```

**Timeline:** 6-12 months to ML deployment, but value from day 1

### Option 3: Hybrid Approach (Recommended)

```
Component 1: Rule-Based Scoring
- Expert domain knowledge
- Regulatory requirements
- Known critical factors
    ↓
Component 2: ML Model
- Pattern recognition from data
- Complex interactions
- Continuous learning
    ↓
Ensemble: Weighted Combination
Final Risk = (0.7 × ML Score) + (0.3 × Rule Score)
    ↓
Explainability Layer (SHAP)
    ↓
API + Dashboard
```

**Advantages:**

- Best of both worlds
- Interpretable and accurate
- Graceful degradation if ML fails
- Regulatory compliance easier

-----

## Implementation Approaches

### Approach 1: Historical Data Available

**Step-by-Step Implementation:**

1. **Data Collection & Exploration (Week 1-2)**

   ```python
   import pandas as pd

   # Load historical data
   locates = pd.read_csv('locate_requests_2020_2025.csv')
   damages = pd.read_csv('damage_incidents_2020_2025.csv')

   # Merge on ticket ID
   data = locates.merge(damages, on='ticket_id', how='left')
   data['damage_occurred'] = data['damage_id'].notna()

   # Explore
   print(data.info())
   print(data['damage_occurred'].value_counts())
   ```
1. **Feature Engineering (Week 2-3)**

   ```python
   # Create risk features
   data['days_since_last_locate'] = (data['locate_date'] - data['previous_locate_date']).dt.days
   data['excavator_violation_count'] = data['excavator_id'].map(violation_history)
   data['weather_risk'] = data['weather_conditions'].map({'rain': 1, 'snow': 1, 'clear': 0})
   # ... more features
   ```
1. **Model Training (Week 3-4)**

   ```python
   from xgboost import XGBClassifier
   from sklearn.model_selection import train_test_split

   # Prepare data
   features = ['excavator_violations', 'weather_risk', 'utility_congestion', ...]
   X = data[features]
   y = data['damage_occurred']

   X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y)

   # Train model
   model = XGBClassifier(scale_pos_weight=10)  # Handle imbalance
   model.fit(X_train, y_train)

   # Evaluate
   from sklearn.metrics import classification_report
   y_pred = model.predict(X_test)
   print(classification_report(y_test, y_pred))
   ```
1. **Explainability (Week 4)**

   ```python
   import shap

   explainer = shap.TreeExplainer(model)
   shap_values = explainer.shap_values(X_test)

   # Visualize feature importance
   shap.summary_plot(shap_values, X_test)
   ```
1. **Deployment (Week 5-6)**

   ```python
   from fastapi import FastAPI
   import pickle

   app = FastAPI()

   # Load trained model
   model = pickle.load(open('risk_model.pkl', 'rb'))

   @app.post("/calculate-risk")
   def calculate_risk(locate_request: dict):
       features = extract_features(locate_request)
       risk_score = model.predict_proba([features])[0][1]

       return {
           "risk_score": float(risk_score),
           "risk_level": "HIGH" if risk_score > 0.7 else "MEDIUM" if risk_score > 0.4 else "LOW"
       }
   ```

### Approach 2: Cold Start (Rule-Based)

**Step-by-Step Implementation:**

1. **Rule Definition (Week 1)**

   ```python
   def calculate_rule_based_risk(locate_request):
       """
       Calculate risk score based on domain expert knowledge
       Returns: risk_score (0-100)
       """
       risk_score = 0
       risk_factors = []

       # Weather factors
       if locate_request.get('recent_heavy_rain'):
           risk_score += 15
           risk_factors.append(('Heavy Rain - Soil Instability', 15))

       if locate_request.get('frozen_ground'):
           risk_score += 10
           risk_factors.append(('Frozen Ground - Hard Digging', 10))

       # Excavator factors
       excavator_violations = locate_request.get('excavator_violation_count', 0)
       if excavator_violations > 3:
           risk_score += 25
           risk_factors.append((f'Excavator Has {excavator_violations} Violations', 25))
       elif excavator_violations > 0:
           risk_score += 10
           risk_factors.append((f'Excavator Has {excavator_violations} Violations', 10))

       if locate_request.get('new_excavator'):
           risk_score += 10
           risk_factors.append(('New/Unknown Excavator', 10))

       # Locator factors
       if locate_request.get('complex_utility_congestion'):
           risk_score += 20
           risk_factors.append(('High Utility Density Area', 20))

       if locate_request.get('response_time_delayed'):
           risk_score += 15
           risk_factors.append(('Delayed Response Time', 15))

       if locate_request.get('inexperienced_locator'):
           risk_score += 12
           risk_factors.append(('Inexperienced Locator Assigned', 12))

       # Utility factors
       if 'high_pressure_gas' in locate_request.get('utility_types', []):
           risk_score += 30
           risk_factors.append(('High Pressure Gas Line Present', 30))

       if locate_request.get('infrastructure_age_years', 0) > 50:
           risk_score += 15
           risk_factors.append(('Aging Infrastructure (50+ years)', 15))

       # Environmental factors
       if locate_request.get('near_previous_damage_site'):
           risk_score += 20
           risk_factors.append(('Near Previous Damage Site', 20))

       # Work complexity
       if locate_request.get('excavation_depth_feet', 0) > 10:
           risk_score += 10
           risk_factors.append(('Deep Excavation (>10 feet)', 10))

       # Cap at 100
       final_score = min(risk_score, 100)

       return {
           'risk_score': final_score,
           'risk_level': 'HIGH' if final_score > 70 else 'MEDIUM' if final_score > 40 else 'LOW',
           'contributing_factors': sorted(risk_factors, key=lambda x: x[1], reverse=True)
       }
   ```
1. **Data Collection System (Week 2)**

   ```python
   import sqlite3
   from datetime import datetime

   def log_locate_request(locate_request, risk_assessment):
       """Store request and prediction for future ML training"""
       conn = sqlite3.connect('damage_prevention.db')
       cursor = conn.cursor()

       cursor.execute('''
           INSERT INTO locate_requests
           (ticket_id, date, excavator_id, risk_score, features, outcome)
           VALUES (?, ?, ?, ?, ?, ?)
       ''', (
           locate_request['ticket_id'],
           datetime.now(),
           locate_request['excavator_id'],
           risk_assessment['risk_score'],
           json.dumps(locate_request),
           None  # Will be updated when outcome is known
       ))

       conn.commit()
       conn.close()

   def update_outcome(ticket_id, damage_occurred, damage_details=None):
       """Update with actual outcome after work is complete"""
       conn = sqlite3.connect('damage_prevention.db')
       cursor = conn.cursor()

       cursor.execute('''
           UPDATE locate_requests
           SET outcome = ?, damage_details = ?, outcome_date = ?
           WHERE ticket_id = ?
       ''', (damage_occurred, damage_details, datetime.now(), ticket_id))

       conn.commit()
       conn.close()
   ```
1. **Simple Dashboard (Week 3)**

   ```python
   import streamlit as st
   import pandas as pd

   st.title("Utility Locate Risk Assessment")

   # Input form
   with st.form("risk_assessment"):
       excavator_id = st.text_input("Excavator ID")
       excavator_violations = st.number_input("Excavator Violations", 0, 20, 0)
       weather = st.selectbox("Weather", ["Clear", "Rain", "Snow", "Frozen Ground"])
       utility_types = st.multiselect("Utility Types",
                                       ["Gas", "Electric", "Water", "Telecom", "Sewer"])

       submitted = st.form_submit_button("Calculate Risk")

       if submitted:
           locate_request = {
               'excavator_id': excavator_id,
               'excavator_violation_count': excavator_violations,
               'recent_heavy_rain': weather == "Rain",
               'frozen_ground': weather == "Frozen Ground",
               'utility_types': [u.lower() for u in utility_types],
               # ... more fields
           }

           result = calculate_rule_based_risk(locate_request)

           # Display results
           st.metric("Risk Score", f"{result['risk_score']}/100")
           st.metric("Risk Level", result['risk_level'])

           st.subheader("Contributing Factors")
           for factor, points in result['contributing_factors']:
               st.write(f"- {factor}: +{points} points")
   ```

### Approach 3: Hybrid System

**Implementation:**

```python
class HybridRiskAssessor:
    def __init__(self, ml_model=None, ml_weight=0.7):
        self.ml_model = ml_model
        self.ml_weight = ml_weight
        self.rule_weight = 1 - ml_weight

    def calculate_risk(self, locate_request):
        # Get rule-based score
        rule_result = calculate_rule_based_risk(locate_request)
        rule_score = rule_result['risk_score'] / 100  # Normalize to 0-1

        # Get ML score if model available
        if self.ml_model:
            features = self.extract_features(locate_request)
            ml_score = self.ml_model.predict_proba([features])[0][1]
        else:
            ml_score = 0
            self.ml_weight = 0
            self.rule_weight = 1.0

        # Weighted combination
        final_score = (self.ml_weight * ml_score) + (self.rule_weight * rule_score)

        return {
            'risk_score': final_score,
            'risk_level': self.categorize_risk(final_score),
            'ml_score': ml_score,
            'rule_score': rule_score,
            'ml_weight': self.ml_weight,
            'rule_factors': rule_result['contributing_factors']
        }

    def categorize_risk(self, score):
        if score > 0.7:
            return 'HIGH'
        elif score > 0.4:
            return 'MEDIUM'
        else:
            return 'LOW'

    def extract_features(self, locate_request):
        # Convert locate request to feature vector for ML model
        return [
            locate_request.get('excavator_violation_count', 0),
            1 if locate_request.get('recent_heavy_rain') else 0,
            # ... all features
        ]
```

-----

## Feature Engineering Guide

### Critical Features for Utility Locate Damage Risk

#### 1. Excavator-Related Features

- **excavator_violation_count**: Number of past violations (HIGH IMPORTANCE)
- **excavator_damage_history**: Past damages caused by this excavator
- **excavator_experience_years**: Years in business
- **excavator_safety_rating**: If available from regulatory body
- **excavator_insurance_claims**: History of insurance claims
- **new_excavator_flag**: Binary flag for unknown/new excavators

#### 2. Weather & Environmental Features

- **recent_precipitation_inches**: Rain in last 24-48 hours
- **soil_moisture_level**: If available, or derived from weather
- **temperature**: Frozen ground conditions
- **season**: Spring thaw, winter freeze patterns
- **days_since_last_rain**: Soil stability indicator
- **ground_condition**: Frozen, saturated, dry, stable

#### 3. Locator-Related Features

- **locator_experience_months**: Experience level of assigned locator
- **locator_accuracy_score**: Historical accuracy of this locator
- **locator_workload**: Current tickets assigned
- **response_time_hours**: Time from request to locate completion
- **time_to_expiration_days**: How fresh is the locate
- **rushed_locate_flag**: Completed faster than typical

#### 4. Utility-Related Features

- **utility_types_present**: Gas, electric, water, telecom, sewer
- **utility_count**: Number of different utilities in area
- **high_pressure_gas_present**: Critical safety factor
- **utility_depth_feet**: Shallow utilities more at risk
- **utility_age_years**: Older infrastructure more vulnerable
- **utility_material**: Cast iron, PVC, steel, copper
- **utility_condition_rating**: If inspection data available

#### 5. Geographic Features

- **utility_density_score**: Congestion level in area
- **distance_to_previous_damage_meters**: Proximity to past incidents
- **damage_cluster_area**: Are we in a high-damage zone
- **urban_vs_rural**: Urban areas often more congested
- **coordinates_lat_long**: For spatial analysis

#### 6. Work-Related Features

- **excavation_type**: Trenching, boring, drilling, hand-digging
- **excavation_depth_feet**: Deeper = higher risk
- **excavation_length_feet**: Larger projects = more exposure
- **work_duration_days**: Longer projects = more risk exposure
- **equipment_type**: Backhoe, excavator, auger, hand tools
- **work_urgency**: Emergency vs routine

#### 7. Timing Features

- **day_of_week**: Some days higher incident rates
- **hour_of_day**: Visibility, lighting conditions
- **days_since_last_locate**: Older locates less accurate
- **time_to_excavation_hours**: Rush jobs riskier
- **holiday_flag**: Reduced staffing on holidays

#### 8. Historical Pattern Features

- **damage_rate_in_zip_code**: Area-specific risk
- **damage_rate_for_utility_type**: Some utilities riskier
- **seasonal_damage_trend**: Spring thaw patterns
- **damage_rate_by_excavator_type**: Residential vs commercial

#### 9. Compliance Features

- **ticket_marked_properly**: Quality of locate marks
- **white_lines_present**: Excavator pre-marked area
- **excavation_within_tolerance**: Within safe distance
- **mandatory_attendance_met**: Required pre-work meetings
- **documentation_complete**: All forms submitted

#### 10. Communication Features

- **communication_quality_score**: Clarity of locate request
- **number_of_clarifications**: How many follow-ups needed
- **language_barrier_flag**: Communication difficulties
- **contact_method**: Phone, portal, emergency line

### Feature Importance (Expected)

Based on domain expertise, expected top features:

1. **High Pressure Gas Present** (30% weight)
1. **Excavator Violation Count** (25% weight)
1. **Recent Heavy Rain** (15% weight)
1. **Near Previous Damage Site** (10% weight)
1. **Utility Congestion** (10% weight)
1. **Inexperienced Locator** (5% weight)
1. **Aging Infrastructure** (5% weight)

*Note: ML model will learn actual importance from data*

### Derived Features (Calculated from Base Features)

```python
# Example derived features
data['risk_interaction_weather_excavator'] = (
    data['weather_risk'] * data['excavator_violations']
)

data['days_to_expiration_risk'] = (
    data['days_since_locate'] / data['locate_validity_days']
)

data['utility_complexity_score'] = (
    data['utility_count'] * data['utility_density']
)
```

-----

## MVP Development Plan

### Phase 1: Proof of Concept (2-4 weeks)

**Goal:** Demonstrate feasibility with mock data

**Tasks:**

1. **Week 1: Data Generation**
- Create synthetic locate request dataset (1000 records)
- Include realistic feature distributions
- Generate damage outcomes (5-10% damage rate)

   ```python
   import numpy as np
   import pandas as pd

   np.random.seed(42)
   n_samples = 1000

   # Generate mock data
   mock_data = pd.DataFrame({
       'ticket_id': [f'TKT-{i:06d}' for i in range(n_samples)],
       'excavator_violations': np.random.poisson(1, n_samples),
       'weather_rain': np.random.binomial(1, 0.2, n_samples),
       'utility_congestion': np.random.choice([0, 1, 2, 3], n_samples),
       'high_pressure_gas': np.random.binomial(1, 0.15, n_samples),
       'locator_experience_months': np.random.randint(1, 120, n_samples),
       # ... more features
   })

   # Generate realistic damage outcomes (rare events)
   risk_score = (
       mock_data['excavator_violations'] * 0.3 +
       mock_data['weather_rain'] * 0.2 +
       mock_data['high_pressure_gas'] * 0.4 +
       np.random.random(n_samples) * 0.1
   )

   mock_data['damage_occurred'] = (risk_score > 0.7).astype(int)
   ```
1. **Week 2: Rule-Based System**
- Implement rule-based risk calculator
- Test on mock data
- Validate logic with domain expertise
1. **Week 3: ML Model Training**
- Train XGBoost on mock data
- Compare with rule-based approach
- Generate performance metrics
- Create SHAP explanations
1. **Week 4: Simple Dashboard**
- Build Streamlit demo interface
- Show risk scoring in real-time
- Display top risk factors
- Create visualizations

**Deliverables:**

- Working prototype with mock data
- Performance comparison (rule-based vs ML)
- Interactive dashboard for demos
- Documentation of approach

### Phase 2: Stakeholder Engagement (1-2 weeks)

**Goal:** Present POC and request data access

**Preparation:**

1. **Create presentation deck:**
- Problem statement
- Solution overview
- Demo of POC with mock data
- Value proposition (reduced damages, cost savings)
- Data requirements
1. **Data request template:**

   ```
   Requested Data Elements:

   1. Locate Request History (2020-2025):
      - Ticket ID, Date, Location
      - Excavator company ID
      - Utility types involved
      - Work type and depth
      - Locator assigned
      - Response time metrics

   2. Damage Incident History (2020-2025):
      - Incident ID, Date, Location
      - Related ticket ID
      - Damage cause (excavator error, locator error, etc.)
      - Utility type damaged
      - Severity/cost

   3. Excavator Information:
      - Company ID, name
      - Violation history
      - Previous damages caused

   4. Optional (if available):
      - Weather data for incident dates
      - Locator experience/performance metrics
      - Utility age and condition data
   ```
1. **Schedule meetings:**
- Locate company leadership
- Utility owner/operator stakeholders
- IT/data teams from both organizations

**Outcomes:**

- Buy-in from stakeholders
- Data availability assessment
- Timeline for data access
- Integration requirements

### Phase 3: Production Development (8-12 weeks)

**With Historical Data:**

**Weeks 1-3: Data Pipeline**

- Receive and clean historical data
- Build ETL processes
- Feature engineering pipeline
- Data quality assessment

**Weeks 4-6: Model Development**

- Train production ML model
- Hyperparameter tuning
- Cross-validation
- Performance optimization

**Weeks 7-9: Integration**

- Build REST API
- Integrate with existing systems
- Create production dashboard
- User acceptance testing

**Weeks 10-12: Deployment**

- Deploy to production environment
- Monitor performance
- Collect feedback
- Iterate on model

**Without Historical Data:**

**Weeks 1-3: Rule System Deployment**

- Finalize rule-based scoring
- Deploy to production
- Train users
- Begin data collection

**Weeks 4-12: Continuous Operation**

- Monitor predictions
- Collect outcomes
- Analyze patterns
- Prepare for ML transition (6-12 months)

-----

## Next Steps

### Immediate Actions (This Week)

1. **Set Up Development Environment**

   ```bash
   # Create virtual environment
   python -m venv damage_prevention_env
   source damage_prevention_env/bin/activate  # On Windows: damage_prevention_env\Scripts\activate

   # Install core dependencies
   pip install pandas numpy scikit-learn xgboost matplotlib seaborn streamlit
   ```
1. **Generate Mock Data**
- Create realistic synthetic dataset
- Include all key features identified
- Generate damage outcomes with realistic distribution
1. **Build Rule-Based Prototype**
- Implement calculate_rule_based_risk() function
- Test with mock data
- Validate scoring logic
1. **Create Simple Demo**
- Build Streamlit dashboard
- Show risk calculation
- Display contributing factors

### Short-Term (Next 2-4 Weeks)

1. **Train ML Model on Mock Data**
- Implement XGBoost classifier
- Compare with rule-based system
- Generate explainability visualizations
1. **Prepare Stakeholder Presentation**
- Create demo video
- Develop business case
- Draft data request document
1. **Schedule Meetings**
- Reach out to locate company
- Reach out to utility owner/operator
- Present POC and request data

### Medium-Term (2-3 Months)

1. **Obtain Historical Data** (if available)
- Work with IT teams for data export
- Assess data quality
- Begin production model development
1. **OR Deploy Rule-Based System** (if no historical data)
- Integrate with existing workflows
- Begin data collection
- Plan for ML transition
1. **Build Production Infrastructure**
- API development
- Database setup
- Monitoring and logging

### Long-Term (6-12 Months)

1. **Continuous Improvement**
- Retrain models with new data
- Adjust feature importance
- Expand to additional risk factors
1. **Feature Expansion**
- Add more data sources
- Integrate real-time weather
- Connect with excavator databases
1. **Scale to Additional Utilities**
- Replicate for other utility companies
- Build multi-tenant system
- Create industry benchmarks

-----

## Code Templates

### Complete POC Script

```python
# damage_prevention_poc.py
import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# 1. Generate Mock Data
def generate_mock_data(n_samples=1000):
    """Generate realistic synthetic data for POC"""
    np.random.seed(42)

    data = pd.DataFrame({
        'ticket_id': [f'TKT-{i:06d}' for i in range(n_samples)],
        'excavator_violations': np.random.poisson(1.5, n_samples),
        'excavator_experience_years': np.random.randint(1, 30, n_samples),
        'weather_rain': np.random.binomial(1, 0.2, n_samples),
        'frozen_ground': np.random.binomial(1, 0.1, n_samples),
        'utility_congestion_score': np.random.randint(0, 4, n_samples),
        'high_pressure_gas_present': np.random.binomial(1, 0.15, n_samples),
        'excavation_depth_feet': np.random.randint(2, 15, n_samples),
        'locator_experience_months': np.random.randint(6, 120, n_samples),
        'days_since_locate': np.random.randint(0, 10, n_samples),
        'near_previous_damage': np.random.binomial(1, 0.1, n_samples),
        'infrastructure_age_years': np.random.randint(5, 80, n_samples),
        'response_time_hours': np.random.exponential(2, n_samples),
    })

    # Generate realistic damage outcomes (5-10% base rate)
    # Higher probability with more risk factors
    risk_score = (
        data['excavator_violations'] * 0.15 +
        data['weather_rain'] * 0.2 +
        data['high_pressure_gas_present'] * 0.3 +
        data['near_previous_damage'] * 0.25 +
        (data['utility_congestion_score'] / 4) * 0.2 +
        (data['excavator_experience_years'] < 3) * 0.15 +
        np.random.random(n_samples) * 0.2  # Random noise
    )

    # Normalize and create binary outcome
    risk_score = (risk_score - risk_score.min()) / (risk_score.max() - risk_score.min())
    data['damage_occurred'] = (risk_score > 0.75).astype(int)

    print(f"Generated {n_samples} samples with {data['damage_occurred'].sum()} damages ({data['damage_occurred'].mean()*100:.1f}%)")

    return data

# 2. Rule-Based Risk Scoring
def calculate_rule_based_risk(row):
    """Domain expert rules for risk assessment"""
    risk = 0

    # Excavator risk
    if row['excavator_violations'] > 3:
        risk += 25
    elif row['excavator_violations'] > 0:
        risk += 10

    if row['excavator_experience_years'] < 3:
        risk += 10

    # Weather risk
    if row['weather_rain']:
        risk += 15
    if row['frozen_ground']:
        risk += 10

    # Utility risk
    if row['high_pressure_gas_present']:
        risk += 30

    risk += row['utility_congestion_score'] * 5

    # Location risk
    if row['near_previous_damage']:
        risk += 20

    # Infrastructure risk
    if row['infrastructure_age_years'] > 50:
        risk += 15

    # Locator risk
    if row['locator_experience_months'] < 12:
        risk += 12

    if row['days_since_locate'] > 7:
        risk += 10

    return min(risk, 100) / 100  # Normalize to 0-1

# 3. Train ML Model
def train_ml_model(data):
    """Train XGBoost classifier"""
    features = [
        'excavator_violations', 'excavator_experience_years',
        'weather_rain', 'frozen_ground', 'utility_congestion_score',
        'high_pressure_gas_present', 'excavation_depth_feet',
        'locator_experience_months', 'days_since_locate',
        'near_previous_damage', 'infrastructure_age_years',
        'response_time_hours'
    ]

    X = data[features]
    y = data['damage_occurred']

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Train model (handle class imbalance)
    scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()

    model = XGBClassifier(
        scale_pos_weight=scale_pos_weight,
        max_depth=4,
        learning_rate=0.1,
        n_estimators=100,
        random_state=42
    )

    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]

    print("\n=== ML Model Performance ===")
    print(classification_report(y_test, y_pred))
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': features,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)

    print("\n=== Top 5 Most Important Features ===")
    print(feature_importance.head())

    return model, X_test, y_test, y_pred_proba

# 4. Compare Approaches
def compare_approaches(data, ml_model):
    """Compare rule-based vs ML model"""
    features = [
        'excavator_violations', 'excavator_experience_years',
        'weather_rain', 'frozen_ground', 'utility_congestion_score',
        'high_pressure_gas_present', 'excavation_depth_feet',
        'locator_experience_months', 'days_since_locate',
        'near_previous_damage', 'infrastructure_age_years',
        'response_time_hours'
    ]

    # Rule-based predictions
    data['rule_risk_score'] = data.apply(calculate_rule_based_risk, axis=1)
    data['rule_prediction'] = (data['rule_risk_score'] > 0.7).astype(int)

    # ML predictions
    X = data[features]
    data['ml_risk_score'] = ml_model.predict_proba(X)[:, 1]
    data['ml_prediction'] = (data['ml_risk_score'] > 0.5).astype(int)

    # Evaluate both
    print("\n=== Rule-Based Performance ===")
    print(classification_report(data['damage_occurred'], data['rule_prediction']))

    print("\n=== ML Model Performance ===")
    print(classification_report(data['damage_occurred'], data['ml_prediction']))

    # Visualize
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    # Rule-based ROC
    from sklearn.metrics import roc_curve, auc
    fpr_rule, tpr_rule, _ = roc_curve(data['damage_occurred'], data['rule_risk_score'])
    fpr_ml, tpr_ml, _ = roc_curve(data['damage_occurred'], data['ml_risk_score'])

    axes[0].plot(fpr_rule, tpr_rule, label=f'Rule-Based (AUC = {auc(fpr_rule, tpr_rule):.2f})')
    axes[0].plot(fpr_ml, tpr_ml, label=f'ML Model (AUC = {auc(fpr_ml, tpr_ml):.2f})')
    axes[0].plot([0, 1], [0, 1], 'k--', label='Random')
    axes[0].set_xlabel('False Positive Rate')
    axes[0].set_ylabel('True Positive Rate')
    axes[0].set_title('ROC Curves')
    axes[0].legend()
    axes[0].grid(True, alpha=0.3)

    # Score distribution
    axes[1].hist(data[data['damage_occurred'] == 0]['ml_risk_score'],
                 bins=20, alpha=0.5, label='No Damage', density=True)
    axes[1].hist(data[data['damage_occurred'] == 1]['ml_risk_score'],
                 bins=20, alpha=0.5, label='Damage', density=True)
    axes[1].set_xlabel('ML Risk Score')
    axes[1].set_ylabel('Density')
    axes[1].set_title('Risk Score Distribution by Outcome')
    axes[1].legend()
    axes[1].grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('model_comparison.png', dpi=150, bbox_inches='tight')
    print("\nVisualization saved as 'model_comparison.png'")

    return data

# 5. Main Execution
if __name__ == "__main__":
    print("=" * 60)
    print("Utility Locate Damage Prevention - ML POC")
    print("=" * 60)

    # Generate data
    print("\n1. Generating mock data...")
    data = generate_mock_data(n_samples=1000)

    # Train ML model
    print("\n2. Training ML model...")
    ml_model, X_test, y_test, y_pred_proba = train_ml_model(data)

    # Compare approaches
    print("\n3. Comparing rule-based vs ML approaches...")
    comparison_data = compare_approaches(data, ml_model)

    # Save example predictions
    print("\n4. Generating example predictions...")
    examples = comparison_data.nlargest(10, 'ml_risk_score')[
        ['ticket_id', 'excavator_violations', 'high_pressure_gas_present',
         'weather_rain', 'near_previous_damage', 'ml_risk_score',
         'rule_risk_score', 'damage_occurred']
    ]

    print("\n=== Top 10 Highest Risk Predictions ===")
    print(examples.to_string(index=False))

    print("\n" + "=" * 60)
    print("POC Complete! Check 'model_comparison.png' for visualizations.")
    print("=" * 60)
```

### Streamlit Dashboard Template

```python
# streamlit_dashboard.py
import streamlit as st
import pandas as pd
import numpy as np
import pickle
from datetime import datetime

st.set_page_config(page_title="Utility Locate Risk Assessment", layout="wide")

# Load model (if available)
@st.cache_resource
def load_model():
    try:
        with open('risk_model.pkl', 'rb') as f:
            return pickle.load(f)
    except:
        return None

model = load_model()

# Title
st.title("🚧 Utility Locate Risk Assessment System")
st.markdown("---")

# Sidebar
with st.sidebar:
    st.header("System Info")
    st.info(f"Current Date: {datetime.now().strftime('%Y-%m-%d')}")

    if model:
        st.success("✅ ML Model Loaded")
    else:
        st.warning("⚠️ Using Rule-Based System")

    st.markdown("---")
    st.header("Risk Levels")
    st.error("🔴 HIGH: >70")
    st.warning("🟡 MEDIUM: 40-70")
    st.success("🟢 LOW: <40")

# Main form
col1, col2 = st.columns(2)

with col1:
    st.subheader("📋 Locate Request Details")

    ticket_id = st.text_input("Ticket ID", "TKT-000001")
    excavator_id = st.text_input("Excavator ID", "EXC-12345")

    excavator_violations = st.number_input(
        "Excavator Violation Count",
        min_value=0, max_value=20, value=0,
        help="Number of past violations by this excavator"
    )

    excavator_experience = st.slider(
        "Excavator Experience (years)",
        1, 30, 5
    )

    work_type = st.selectbox(
        "Work Type",
        ["Trenching", "Boring", "Drilling", "Hand Digging", "Other"]
    )

    excavation_depth = st.number_input(
        "Excavation Depth (feet)",
        min_value=1, max_value=30, value=4
    )

with col2:
    st.subheader("🌍 Site Conditions")

    weather = st.selectbox(
        "Current Weather",
        ["Clear", "Light Rain", "Heavy Rain", "Snow", "Frozen Ground"]
    )

    utility_types = st.multiselect(
        "Utility Types Present",
        ["High Pressure Gas", "Electric", "Water", "Telecom", "Sewer"],
        default=["Electric"]
    )

    utility_congestion = st.select_slider(
        "Utility Congestion Level",
        options=["Low", "Medium", "High", "Very High"],
        value="Medium"
    )

    infrastructure_age = st.number_input(
        "Infrastructure Age (years)",
        min_value=0, max_value=100, value=30
    )

    near_previous_damage = st.checkbox("Near Previous Damage Site")

    locator_experience = st.slider(
        "Locator Experience (months)",
        1, 120, 24
    )

    days_since_locate = st.number_input(
        "Days Since Locate Completed",
        min_value=0, max_value=14, value=2
    )

# Calculate risk button
if st.button("🎯 Calculate Risk Score", type="primary"):

    # Convert inputs to features
    locate_request = {
        'excavator_violations': excavator_violations,
        'excavator_experience_years': excavator_experience,
        'weather_rain': 1 if 'Rain' in weather else 0,
        'frozen_ground': 1 if weather == 'Frozen Ground' else 0,
        'utility_congestion_score': ['Low', 'Medium', 'High', 'Very High'].index(utility_congestion),
        'high_pressure_gas_present': 1 if 'High Pressure Gas' in utility_types else 0,
        'excavation_depth_feet': excavation_depth,
        'locator_experience_months': locator_experience,
        'days_since_locate': days_since_locate,
        'near_previous_damage': 1 if near_previous_damage else 0,
        'infrastructure_age_years': infrastructure_age,
        'response_time_hours': 2.0  # Default
    }

    # Rule-based calculation
    def calculate_rule_risk(req):
        risk = 0
        factors = []

        if req['excavator_violations'] > 3:
            risk += 25
            factors.append(("High Violation Count", 25))
        elif req['excavator_violations'] > 0:
            risk += 10
            factors.append(("Some Violations", 10))

        if req['weather_rain']:
            risk += 15
            factors.append(("Recent Rain", 15))

        if req['frozen_ground']:
            risk += 10
            factors.append(("Frozen Ground", 10))

        if req['high_pressure_gas_present']:
            risk += 30
            factors.append(("High Pressure Gas", 30))

        if req['near_previous_damage']:
            risk += 20
            factors.append(("Near Previous Damage", 20))

        risk += req['utility_congestion_score'] * 5
        if req['utility_congestion_score'] > 1:
            factors.append((f"Utility Congestion", req['utility_congestion_score'] * 5))

        if req['infrastructure_age_years'] > 50:
            risk += 15
            factors.append(("Aging Infrastructure", 15))

        if req['locator_experience_months'] < 12:
            risk += 12
            factors.append(("Inexperienced Locator", 12))

        if req['days_since_locate'] > 7:
            risk += 10
            factors.append(("Old Locate", 10))

        return min(risk, 100), sorted(factors, key=lambda x: x[1], reverse=True)

    rule_risk, risk_factors = calculate_rule_risk(locate_request)

    # ML prediction (if available)
    if model:
        features_list = [
            locate_request['excavator_violations'],
            locate_request['excavator_experience_years'],
            locate_request['weather_rain'],
            locate_request['frozen_ground'],
            locate_request['utility_congestion_score'],
            locate_request['high_pressure_gas_present'],
            locate_request['excavation_depth_feet'],
            locate_request['locator_experience_months'],
            locate_request['days_since_locate'],
            locate_request['near_previous_damage'],
            locate_request['infrastructure_age_years'],
            locate_request['response_time_hours']
        ]

        ml_risk = model.predict_proba([features_list])[0][1] * 100

        # Hybrid score
        final_risk = (0.7 * ml_risk) + (0.3 * rule_risk)
    else:
        final_risk = rule_risk
        ml_risk = None

    # Display results
    st.markdown("---")
    st.header("📊 Risk Assessment Results")

    # Risk score with color
    if final_risk > 70:
        st.error(f"### 🔴 HIGH RISK: {final_risk:.1f}/100")
    elif final_risk > 40:
        st.warning(f"### 🟡 MEDIUM RISK: {final_risk:.1f}/100")
    else:
        st.success(f"### 🟢 LOW RISK: {final_risk:.1f}/100")

    # Detailed scores
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Rule-Based Score", f"{rule_risk:.1f}")
    with col2:
        if ml_risk:
            st.metric("ML Model Score", f"{ml_risk:.1f}")
        else:
            st.metric("ML Model Score", "N/A")
    with col3:
        st.metric("Final Score", f"{final_risk:.1f}")

    # Contributing factors
    st.subheader("🎯 Top Contributing Risk Factors")
    if risk_factors:
        for i, (factor, points) in enumerate(risk_factors[:5], 1):
            st.write(f"{i}. **{factor}**: +{points} points")
    else:
        st.write("No significant risk factors identified")

    # Recommendations
    st.subheader("💡 Recommendations")
    if final_risk > 70:
        st.warning("""
        **HIGH RISK - Immediate Action Required:**
        - Assign most experienced locator
        - Conduct pre-excavation meeting
        - Consider additional safety measures
        - Alert utility owner operator
        - Enhanced monitoring during work
        """)
    elif final_risk > 40:
        st.info("""
        **MEDIUM RISK - Enhanced Monitoring:**
        - Review locate marks carefully
        - Ensure excavator understands tolerance zone
        - Monitor weather conditions
        - Standard safety protocols
        """)
    else:
        st.success("""
        **LOW RISK - Standard Procedures:**
        - Follow normal safety protocols
        - Routine monitoring sufficient
        """)

    # Save to database (placeholder)
    st.markdown("---")
    if st.button("💾 Save Assessment"):
        st.success(f"Risk assessment for {ticket_id} saved successfully!")

# Footer
st.markdown("---")
st.caption("Utility Locate Risk Assessment System v1.0 | Powered by ML & Domain Expertise")
```

-----

## Resources & Documentation

### Learning Resources

**Machine Learning:**

- [scikit-learn Documentation](https://scikit-learn.org/stable/)
- [XGBoost Documentation](https://xgboost.readthedocs.io/)
- [Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow (Book)](https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/)

**Model Interpretability:**

- [SHAP Documentation](https://shap.readthedocs.io/)
- [Interpretable ML Book](https://christophm.github.io/interpretable-ml-book/)

**Deployment:**

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Streamlit Documentation](https://docs.streamlit.io/)
- [Docker Getting Started](https://docs.docker.com/get-started/)

### Industry Resources

**Utility Damage Prevention:**

- Common Ground Alliance (CGA)
- 811 Best Practices
- State damage prevention laws and regulations

**Data Sources:**

- NOAA Weather Data API
- Local utility company databases
- Excavator licensing databases

-----

## Contact & Next Steps

This guide provides a comprehensive framework for building your utility locate damage prevention ML system. The key decision points are:

1. **Data Availability**: Do you have historical data or starting fresh?
1. **MVP Approach**: Rule-based, ML-first, or hybrid?
1. **Timeline**: How quickly do you need to demonstrate value?

**Recommended First Action:**
Generate mock data and build the rule-based POC this week. This gives you something tangible to show stakeholders and helps refine your approach based on their feedback.

**Questions to Consider:**

- What's the average cost of a utility damage incident?
- How many locate requests are processed annually?
- What's the current damage rate?
- What percentage reduction would be considered success?

These answers will help quantify ROI and justify the investment.

-----

*Document created: 2025-11-01*
*Last updated: 2025-11-01*
*Version: 1.0*
