
// Fix: Added React import to resolve 'Cannot find namespace React' error for TipItem's icon property
import React from 'react';

export type WasteCategory = 'Organic' | 'Recyclable' | 'Hazardous' | 'General' | 'Biomedical';

export interface ClassificationResult {
  item: string;
  category: WasteCategory;
  confidence: number;
  instructions: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

export interface SavedScan extends ClassificationResult {
  id: string;
  userId: string;
  timestamp: string;
}

export interface StatItem {
  label: string;
  value: string;
  icon: string;
}

export interface TipItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}
