# 🍱 ANNAPURNA

### Campus Food Operations & Intelligence Platform

> **Smarter food management for smarter campuses.**

ANNAPURNA is a campus food operations platform designed to make mess and canteen management more **data-driven, efficient, transparent, and sustainable**.

The platform connects **students and campus authorities** through a unified system where meal participation can be tracked through QR-based check-ins, operational data can be monitored, and historical consumption patterns can help authorities make better food-planning decisions.

---

## 🚀 Problem

Managing food in a college campus is surprisingly difficult.

Traditional mess systems often struggle with:

* 🍛 Food being prepared without knowing actual demand
* 📉 Unpredictable student attendance
* 🗑️ Excess food wastage
* 📊 Lack of reliable meal-consumption data
* 📝 Manual attendance and meal tracking
* 💰 Inefficient food procurement and resource utilization
* 🔍 Limited visibility for students and authorities

ANNAPURNA aims to solve these problems through a centralized digital platform.

---

## 💡 Our Solution

ANNAPURNA creates two connected experiences:

### 👨‍🎓 Student Side

Students can:

* Scan a **QR code** to check in for meals
* View their meal participation
* Access relevant campus food information
* Interact with a simple, fast, mobile-friendly interface

### 🏫 Authority Side

Administrators can:

* Monitor meal participation
* View operational dashboards
* Track historical consumption
* Analyze meal-wise demand
* Use previous-day data to support next-day food planning
* Monitor trends and identify unusual changes in demand

The goal is simple:

> **Prepare the right amount of food for the right number of students.**

---

## 🧠 Data-Driven Food Planning

One of ANNAPURNA's core ideas is using **historical meal participation data** to improve future planning.

For example:

```text
Previous Meal Data
        ↓
Student Check-ins
        ↓
Meal-wise Participation
        ↓
Historical Patterns
        ↓
Demand Estimation
        ↓
Better Food Planning
        ↓
Less Food Waste
```

Instead of relying entirely on assumptions, authorities can make decisions based on actual campus consumption patterns.

---

## ✨ Key Features

### 📱 QR-Based Meal Check-In

Students can quickly register their meal participation by scanning a QR code.

This reduces manual tracking and creates structured consumption data.

### 📊 Authority Dashboard

A centralized dashboard provides visibility into:

* Total meal registrations
* Meal-wise participation
* Daily trends
* Student participation
* Operational statistics

### 📈 Historical Analytics

Historical data can be used to identify:

* High-demand meals
* Low-demand periods
* Weekday/weekend patterns
* Changes in student participation
* Recurring consumption trends

### 🍚 Demand-Aware Food Planning

The system can use previous consumption information to help authorities estimate how much food should be prepared for upcoming meals.

### 👥 Two-Sided Platform

ANNAPURNA is designed around two primary users:

**Student → Participate & Check In**

**Authority → Monitor, Analyze & Plan**

This creates a complete operational loop rather than just another student-facing application.

---

## 🏗️ System Flow

```text
                ┌───────────────────┐
                │      STUDENT      │
                └─────────┬─────────┘
                          │
                    Scan QR Code
                          │
                          ▼
                ┌───────────────────┐
                │   Meal Check-In   │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │   Data Storage    │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Analytics Engine  │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Authority Panel   │
                └─────────┬─────────┘
                          │
                          ▼
                ┌───────────────────┐
                │ Better Food       │
                │ Planning          │
                └───────────────────┘
```

---

## 🖥️ Interface

ANNAPURNA focuses on a clean and intuitive interface so that both students and authorities can use the system without a complicated learning curve.

### Student Experience

```text
Login
  ↓
Scan QR
  ↓
Meal Check-In
  ↓
Confirmation
```

### Authority Experience

```text
Dashboard
   ↓
Today's Data
   ↓
Historical Analytics
   ↓
Demand Insights
   ↓
Food Planning
```

---

## 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Modern CSS
* Responsive UI

### Data & Backend

* Structured meal participation data
* Database-backed application architecture
* API-driven data flow

### Deployment

* Vercel

---

## 📂 Project Structure

```text
ANNAPURNA/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── services/
│   ├── hooks/
│   └── App.tsx
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

> The exact folder structure may vary depending on the current implementation.

---

## 🌱 Impact

ANNAPURNA is designed to create impact at multiple levels.

### 🎓 For Students

* Faster meal check-in
* Better campus food transparency
* Simple digital experience

### 🏫 For Authorities

* Real-time participation visibility
* Better operational planning
* Data-backed decisions
* Reduced manual work

### 🌍 For Sustainability

Better demand estimation can help reduce:

* 🍚 Food wastage
* 💰 Unnecessary food expenditure
* 📦 Over-procurement
* ♻️ Resource wastage

---

## 🔮 Future Scope

ANNAPURNA can be expanded into a complete campus food intelligence ecosystem.

### Possible future enhancements:

* 📅 Event-aware demand estimation
* 🌦️ Weather-aware demand patterns
* 📢 Student meal announcements
* 📊 Advanced analytics
* 🔔 Low-stock and operational alerts
* 🏢 Multi-mess / multi-canteen support
* 📱 Dedicated mobile application
* 🧾 Digital inventory management
* 📦 Supplier and procurement management
* 🌱 Food-waste reporting
* 📈 Long-term campus consumption analytics

---

## 🏆 Why ANNAPURNA?

ANNAPURNA isn't just a mess-management application.

It creates a **closed-loop food management system**:

```text
STUDENT PARTICIPATION
        ↓
REAL DATA
        ↓
ANALYSIS
        ↓
DEMAND ESTIMATION
        ↓
BETTER PLANNING
        ↓
LESS WASTE
        ↓
MORE EFFICIENT CAMPUS
```

The vision is to move campus food management from:

> **Guess → Prepare → Waste**

to:

> **Measure → Understand → Plan → Optimize**

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd ANNAPURNA
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

---

## 🌐 Live Demo

**ANNAPURNA:**
https://anna-purna-eight.vercel.app/

---

## 👥 Team

Built with ❤️ for innovation in **campus food management, sustainability, and smarter resource utilization**.

---

## 📜 License

This project is developed for educational, innovation, and hackathon purposes.
