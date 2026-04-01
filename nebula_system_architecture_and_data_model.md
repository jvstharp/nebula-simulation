# Nebula System Architecture + Data Model

## 1. Overview
Nebula is a controlled AI simulation platform that runs persistent corporate worlds, generates dynamic scenarios, and tracks user progression through realistic workplace interactions. The architecture is designed to balance **stable world structure** with **dynamic scenario evolution**.

### Core design principles
- Stable identity, dynamic consequence
- Event-driven state updates
- AI is controlled, not free-form
- Everything important is logged and replayable
- Secure tenant isolation for company environments

---

## 2. High-level system architecture

```text
                        ┌──────────────────────────┐
                        │        Frontend UI       │
                        │ (Web App / Desktop App)  │
                        └────────────┬─────────────┘
                                     │
                                     │ API + WebSocket
                                     ▼
┌──────────────────────────────────────────────────────────────┐
│                        API Gateway                           │
│ (Auth, Routing, Rate Limiting, Tenant Isolation)            │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼

┌───────────────────────┐         ┌──────────────────────────┐
│  Simulation Service   │         │  Intelligence Engine     │
│ (Core Orchestrator)  │◄───────►│  (AI Core System)        │
└──────────┬───────────┘         └──────────┬───────────────┘
           │                                │
           ▼                                ▼

┌───────────────────────┐         ┌──────────────────────────┐
│  Chaos Engine         │         │  Persona Engine          │
│ (Disruptions)         │         │ (Characters + Dialogue)  │
└──────────┬───────────┘         └──────────┬───────────────┘
           │                                │
           ▼                                ▼

┌───────────────────────┐         ┌──────────────────────────┐
│  Progression Engine   │         │  Content Generator       │
│ (Skills, XP, Credits) │         │ (Emails, Reports, etc.)  │
└──────────┬───────────┘         └──────────┬───────────────┘
           │                                │
           └──────────────┬─────────────────┘
                          ▼

                ┌──────────────────────┐
                │  Event Bus / Stream  │
                │   (Kafka / Queue)   │
                └─────────┬──────────┘
                          ▼

        ┌───────────────────────────────────────┐
        │           Data Layer                  │
        │---------------------------------------│
        │ PostgreSQL (Core relational data)     │
        │ Redis (real-time state + sessions)    │
        │ Object Storage (replays, media)       │
        └───────────────────────────────────────┘

                          ▼
                ┌──────────────────────┐
                │ Analytics Engine     │
                │ (Scoring + Insights) │
                └──────────────────────┘
```

### Architecture intent
- The **frontend** is the user’s workspace.
- The **API gateway** centralizes access, security, and routing.
- The **simulation service** orchestrates the session lifecycle.
- The **intelligence engine** produces scenarios, structured content, and contextual responses.
- The **persona engine** manages coworkers, stakeholders, and their behavior.
- The **chaos engine** injects realistic pressure and disruption.
- The **progression engine** tracks learning outcomes and career movement.
- The **event bus** keeps everything observable and replayable.
- The **data layer** stores state, history, and artifacts.
- The **analytics engine** converts simulation behavior into measurable outcomes.

---

## 3. Core services

### 3.1 Simulation Service
The simulation service is the runtime orchestrator. It loads the world state, starts sessions, processes user actions, coordinates service calls, and updates scenario state.

Responsibilities:
- Session creation and termination
- Scenario loading
- State transitions
- Event routing
- Coordination between AI and world systems

### 3.2 Intelligence Engine
The intelligence engine is the central AI brain for the platform.

Responsibilities:
- Generate case studies and scenarios
- Interpret context
- Build prompts and response logic
- Maintain narrative consistency
- Support controlled AI behavior

### 3.3 Persona Engine
The persona engine creates and manages AI coworkers, managers, clients, and stakeholders.

Responsibilities:
- Character creation
- Personality and goal modeling
- Dialogue generation
- Relationship awareness
- Memory of prior interactions

### 3.4 Content Generator
The content generator creates the materials users must work with during a simulation.

Outputs:
- Emails
- Meeting summaries
- Reports
- Briefs
- Dashboards
- Internal documents

### 3.5 Chaos Engine
The chaos engine introduces realistic workplace friction.

Examples:
- Budget cuts
- Deadline changes
- Conflicting instructions
- Resource shortages
- Unexpected crises

### 3.6 Progression Engine
The progression engine tracks growth over time.

Tracks:
- Skills
- XP
- Reputation
- Nebula Credits
- Role readiness
- Career progression

### 3.7 Analytics Engine
The analytics engine converts session behavior into user-facing and company-facing insights.

Outputs:
- Skill scores
- Heatmaps
- Readiness percentages
- Performance trends
- Replay summaries
- Benchmarking results

---

## 4. Event-driven model
Nebula should behave like an event-driven system so that every important action is trackable, replayable, and explainable.

### Example event types
- `USER_SESSION_STARTED`
- `SCENARIO_LOADED`
- `CHARACTER_CREATED`
- `USER_MESSAGE_SENT`
- `PERSONA_RESPONSE_GENERATED`
- `CHAOS_EVENT_TRIGGERED`
- `DECISION_SUBMITTED`
- `SKILL_UPDATED`
- `SESSION_COMPLETED`

### Why events matter
- They power replay
- They support analytics
- They create auditability
- They make the world reconstructable

---

## 5. Data model

### 5.1 Users
```text
users
- user_id (PK)
- email
- password_hash
- tenant_id
- experience_level (beginner / intermediate / advanced / senior)
- created_at
```

### 5.2 Companies
```text
companies
- company_id (PK)
- name
- domain (tech, consulting, finance, etc.)
- size
- description
- culture_profile (JSON)
- market_position
- created_at
```

### 5.3 Scenarios
```text
scenarios
- scenario_id (PK)
- company_id (FK)
- role (product_manager, analyst, consultant, etc.)
- difficulty_level
- objectives (JSON)
- constraints (JSON)
- created_at
```

### 5.4 Simulation sessions
```text
sessions
- session_id (PK)
- user_id (FK)
- scenario_id (FK)
- company_id (FK)
- state (JSON)
- start_time
- end_time
```

### 5.5 Events
```text
events
- event_id (PK)
- session_id (FK)
- actor (user / persona / system)
- event_type
- payload (JSON)
- timestamp
```

### 5.6 Characters
```text
characters
- character_id (PK)
- company_id (FK)
- name
- role
- personality_traits (JSON)
- goals (JSON)
- hidden_motives (JSON)
- created_at
```

### 5.7 Relationships
```text
relationships
- id (PK)
- user_id (FK)
- character_id (FK)
- relationship_score
- trust_level
```

### 5.8 Skills
```text
skills
- skill_id (PK)
- name
```

### 5.9 User skill scores
```text
user_skills
- id (PK)
- user_id (FK)
- skill_id (FK)
- score
- confidence
- updated_at
```

### 5.10 Decisions
```text
decisions
- decision_id (PK)
- session_id (FK)
- event_id (FK)
- effectiveness_score
- timing_score
- efficiency_score
- collaboration_score
- final_score
```

### 5.11 Replays
```text
replays
- replay_id (PK)
- session_id (FK)
- file_url
- created_at
```

---

## 6. Data relationships

```text
User ───< Session ───< Event
  │          │
  │          └────< Decision
  │
  └────< UserSkill >──── Skill

Company ───< Scenario
Company ───< Character ───< Relationship >─── User
Session ───< Replay
```

### Relationship meaning
- A **user** can have many sessions.
- A **session** belongs to one scenario and one company.
- A **session** produces many events.
- A **session** can produce many decisions.
- A **company** owns scenarios and characters.
- A **character** can build relationships with a user.
- A **session** can later be turned into a replay artifact.

---

## 7. Main simulation flow

### 7.1 Session start
```text
User → API → Simulation Service
→ Load company + scenario
→ Initialize state
→ Create session
```

### 7.2 Scenario generation
```text
Simulation Service → Intelligence Engine
→ Generate case study
→ Generate objectives
→ Generate stakeholders
```

### 7.3 Character creation
```text
Persona Engine:
→ Create characters
→ Store profiles
→ Link to session
```

### 7.4 Interaction loop
```text
User action → Event created
→ Event sent to Event Bus
→ Simulation Service updates state
→ Intelligence Engine evaluates context
→ Persona Engine responds
→ Content Generator creates emails/messages
→ UI updates
```

### 7.5 Chaos injection
```text
Chaos Engine triggers:
→ New event (e.g., deadline change)
→ UI + state updated
```

### 7.6 Decision evaluation
```text
User decision → Evaluation Engine
→ Score decision
→ Update skills
→ Update company state
```

### 7.7 Session end
```text
Simulation ends
→ Analytics Engine processes session
→ Replay generated
→ Dashboard updated
```

---

## 8. Replay and what-if branching
The replay system should reconstruct a session from logged events.

### Replay package
- Session metadata
- Event log
- State snapshots
- Analytics summary
- Optional decision fork history

### What-if branching
A checkpoint can be cloned, then alternative choices can be replayed to show different outcomes.

This allows the platform to answer:
- What happened?
- Where did it go wrong?
- What could have happened instead?

---

## 9. MVP architecture decisions
The first version should stay lightweight.

### Recommended MVP approach
- Use a **monolith backend** first
- Use **PostgreSQL** as the primary database
- Use **Redis** for session caching and lightweight queues
- Use an **LLM API** for controlled generation
- Use **React** for the frontend

### Avoid in MVP
- Microservices too early
- Full 3D environment
- Real-time multiplayer
- Heavy event streaming complexity unless needed

---

## 10. Suggested tech stack
- Frontend: React
- Backend: Node.js or Python
- Database: PostgreSQL
- Cache / session store: Redis
- Object storage: S3-compatible storage
- AI: external LLM API
- Realtime updates: WebSocket

---

## 11. Security and isolation principles
- Tenant isolation for enterprise worlds
- Encrypted data at rest and in transit
- Role-based access control
- Audit logging for all critical actions
- Separate public and private simulation environments where needed

---

## 12. Important product rule
Nothing critical should be hard-coded.

This applies to:
- Conversations
- Emails
- Stakeholder reactions
- Case studies
- Chaos events
- Career progression outcomes

The stable part is the world structure. The changing part is the scenario logic and consequences.

