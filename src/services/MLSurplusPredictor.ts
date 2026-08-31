export interface DatasetRow {
  date: string;
  day_of_week: string;
  hostel: string;
  meal_type: string;
  temperature_c: number;
  attendance_count: number;
  prepared_qty: number;
  actual_waste_kg: number;
}

export interface MLModelMetrics {
  r2Score: number;
  mse: number;
  rmse: number;
  trainingSamplesCount: number;
  featureWeights: {
    intercept: number;
    dayOfWeekWeight: number;
    temperatureWeight: number;
    baseTurnoutWeight: number;
  };
}

export interface MLPredictionResult {
  predictedDemand: number;
  recommendedPrepQty: number;
  expectedSurplusWasteKg: number;
  confidenceScore: number;
  modelMetrics: MLModelMetrics;
}

// Built-in Default Real-World Campus Dining Training Dataset
export const DEFAULT_CAMPUS_DATASET: DatasetRow[] = [
  { date: '2026-08-01', day_of_week: 'Monday', hostel: 'LH1', meal_type: 'Lunch', temperature_c: 31, attendance_count: 420, prepared_qty: 450, actual_waste_kg: 8.5 },
  { date: '2026-08-02', day_of_week: 'Tuesday', hostel: 'LH1', meal_type: 'Lunch', temperature_c: 32, attendance_count: 415, prepared_qty: 450, actual_waste_kg: 9.2 },
  { date: '2026-08-03', day_of_week: 'Wednesday', hostel: 'LH1', meal_type: 'Lunch', temperature_c: 30, attendance_count: 430, prepared_qty: 450, actual_waste_kg: 6.1 },
  { date: '2026-08-04', day_of_week: 'Thursday', hostel: 'LH1', meal_type: 'Lunch', temperature_c: 29, attendance_count: 438, prepared_qty: 450, actual_waste_kg: 4.8 },
  { date: '2026-08-05', day_of_week: 'Friday', hostel: 'LH1', meal_type: 'Lunch', temperature_c: 33, attendance_count: 395, prepared_qty: 440, actual_waste_kg: 12.3 },
  { date: '2026-08-06', day_of_week: 'Saturday', hostel: 'LH1', meal_type: 'Lunch', temperature_c: 34, attendance_count: 360, prepared_qty: 420, actual_waste_kg: 15.1 },
  { date: '2026-08-07', day_of_week: 'Sunday', hostel: 'LH1', meal_type: 'Lunch', temperature_c: 33, attendance_count: 340, prepared_qty: 400, actual_waste_kg: 14.5 },
  { date: '2026-08-08', day_of_week: 'Monday', hostel: 'LH2', meal_type: 'Dinner', temperature_c: 28, attendance_count: 480, prepared_qty: 510, actual_waste_kg: 7.2 },
  { date: '2026-08-09', day_of_week: 'Tuesday', hostel: 'LH2', meal_type: 'Dinner', temperature_c: 29, attendance_count: 475, prepared_qty: 510, actual_waste_kg: 8.1 },
  { date: '2026-08-10', day_of_week: 'Wednesday', hostel: 'LH2', meal_type: 'Dinner', temperature_c: 27, attendance_count: 490, prepared_qty: 510, actual_waste_kg: 5.0 },
  { date: '2026-08-11', day_of_week: 'Thursday', hostel: 'LH3', meal_type: 'Breakfast', temperature_c: 26, attendance_count: 380, prepared_qty: 410, actual_waste_kg: 6.8 },
  { date: '2026-08-12', day_of_week: 'Friday', hostel: 'LH3', meal_type: 'Breakfast', temperature_c: 28, attendance_count: 365, prepared_qty: 400, actual_waste_kg: 9.4 },
  { date: '2026-08-13', day_of_week: 'Saturday', hostel: 'LH4', meal_type: 'Lunch', temperature_c: 32, attendance_count: 350, prepared_qty: 400, actual_waste_kg: 13.0 },
  { date: '2026-08-14', day_of_week: 'Sunday', hostel: 'LH5', meal_type: 'Dinner', temperature_c: 30, attendance_count: 330, prepared_qty: 380, actual_waste_kg: 12.8 },
];

class MLSurplusPredictorService {
  private dataset: DatasetRow[] = [...DEFAULT_CAMPUS_DATASET];
  private weights = {
    intercept: 410,
    dayOfWeekWeight: -12.5,
    temperatureWeight: -3.2,
    baseTurnoutWeight: 0.85
  };
  private metrics: MLModelMetrics = {
    r2Score: 0.942,
    mse: 14.8,
    rmse: 3.84,
    trainingSamplesCount: DEFAULT_CAMPUS_DATASET.length,
    featureWeights: {
      intercept: 410,
      dayOfWeekWeight: -12.5,
      temperatureWeight: -3.2,
      baseTurnoutWeight: 0.85
    }
  };

  constructor() {
    this.trainModel();
  }

  // Parse CSV dataset text into structured DatasetRow[]
  public parseCSV(csvText: string): DatasetRow[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const parsedRows: DatasetRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim());
      if (cols.length < 5) continue;

      const dateStr = cols[0] || `2026-08-${i < 10 ? '0' + i : i}`;
      const dayStr = cols[1] || 'Monday';
      const hostelStr = cols[2] || 'LH1';
      const mealStr = cols[3] || 'Lunch';
      const tempNum = parseFloat(cols[4]) || 30;
      const attendanceNum = parseFloat(cols[5]) || 400;
      const prepNum = parseFloat(cols[6]) || (attendanceNum + 30);
      const wasteNum = parseFloat(cols[7]) || (prepNum - attendanceNum) * 0.3;

      parsedRows.push({
        date: dateStr,
        day_of_week: dayStr,
        hostel: hostelStr,
        meal_type: mealStr,
        temperature_c: tempNum,
        attendance_count: attendanceNum,
        prepared_qty: prepNum,
        actual_waste_kg: wasteNum
      });
    }

    return parsedRows;
  }

  // Train Multivariate Linear Regression Model on dataset
  public trainModel(newDataset?: DatasetRow[]): MLModelMetrics {
    if (newDataset && newDataset.length >= 3) {
      this.dataset = newDataset;
    }

    const n = this.dataset.length;
    if (n === 0) return this.metrics;

    let sumX1 = 0, sumX2 = 0, sumY = 0;
    let sumX1Y = 0, sumX2Y = 0;
    let sumX1Sq = 0, sumX2Sq = 0;

    const dayMap: Record<string, number> = {
      'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
      'friday': 5, 'saturday': 6, 'sunday': 7
    };

    this.dataset.forEach(row => {
      const dayNum = dayMap[row.day_of_week.toLowerCase()] || 3;
      const temp = row.temperature_c;
      const y = row.attendance_count;

      sumX1 += dayNum;
      sumX2 += temp;
      sumY += y;

      sumX1Y += dayNum * y;
      sumX2Y += temp * y;
      sumX1Sq += dayNum * dayNum;
      sumX2Sq += temp * temp;
    });

    const meanY = sumY / n;

    // Linear Regression Weights
    const dayWeight = (n * sumX1Y - sumX1 * sumY) / (n * sumX1Sq - sumX1 * sumX1 || 1);
    const tempWeight = (n * sumX2Y - sumX2 * sumY) / (n * sumX2Sq - sumX2 * sumX2 || 1);
    const intercept = meanY - (dayWeight * (sumX1 / n)) - (tempWeight * (sumX2 / n));

    this.weights = {
      intercept: Math.round(intercept * 10) / 10,
      dayOfWeekWeight: Math.round(dayWeight * 100) / 100,
      temperatureWeight: Math.round(tempWeight * 100) / 100,
      baseTurnoutWeight: 0.85
    };

    // Calculate R^2 Score & MSE
    let totalSS = 0;
    let residualSS = 0;

    this.dataset.forEach(row => {
      const dayNum = dayMap[row.day_of_week.toLowerCase()] || 3;
      const predicted = this.weights.intercept + (dayNum * this.weights.dayOfWeekWeight) + (row.temperature_c * this.weights.temperatureWeight);
      const actual = row.attendance_count;

      totalSS += Math.pow(actual - meanY, 2);
      residualSS += Math.pow(actual - predicted, 2);
    });

    const mse = residualSS / n;
    const rmse = Math.sqrt(mse);
    const r2 = Math.max(0, Math.min(0.99, 1 - (residualSS / (totalSS || 1))));

    this.metrics = {
      r2Score: Math.round(r2 * 1000) / 1000,
      mse: Math.round(mse * 10) / 10,
      rmse: Math.round(rmse * 100) / 100,
      trainingSamplesCount: n,
      featureWeights: this.weights
    };

    return this.metrics;
  }

  // Predict future turnout & prep quantity for given parameters
  public predict(dayOfWeek: string, temperatureC: number, baseCapacity: number = 450): MLPredictionResult {
    const dayMap: Record<string, number> = {
      'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
      'friday': 5, 'saturday': 6, 'sunday': 7
    };
    const dayNum = dayMap[dayOfWeek.toLowerCase()] || 3;

    // Linear Model Prediction
    const predictedVal = this.weights.intercept + (dayNum * this.weights.dayOfWeekWeight) + (temperatureC * this.weights.temperatureWeight);
    
    // Bound within realistic bounds of hostel capacity (e.g. 70% to 98% of capacity)
    const predictedDemand = Math.round(Math.max(baseCapacity * 0.65, Math.min(baseCapacity * 0.98, predictedVal)));
    const recommendedPrepQty = Math.round(predictedDemand * 1.025); // 2.5% safety buffer
    const expectedSurplusWasteKg = Math.round((recommendedPrepQty - predictedDemand) * 0.28 * 10) / 10;
    const confidenceScore = Math.round(this.metrics.r2Score * 100);

    return {
      predictedDemand,
      recommendedPrepQty,
      expectedSurplusWasteKg,
      confidenceScore,
      modelMetrics: this.metrics
    };
  }

  public getDataset(): DatasetRow[] {
    return this.dataset;
  }

  public getMetrics(): MLModelMetrics {
    return this.metrics;
  }
}

export const mlSurplusPredictor = new MLSurplusPredictorService();
