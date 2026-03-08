export const SERVICE_CATEGORIES = [
  { label: 'Oil & Fluids', value: 'oil_fluids' },
  { label: 'Tires & Wheels', value: 'tires_wheels' },
  { label: 'Brakes', value: 'brakes' },
  { label: 'Battery', value: 'battery' },
  { label: 'Engine', value: 'engine' },
  { label: 'Other', value: 'other' },
];

export const SERVICES_BY_CATEGORY: Record<
  string,
  { label: string; value: string }[]
> = {
  oil_fluids: [
    { label: 'Oil Change', value: 'oil_change' },
    { label: 'Coolant Flush', value: 'coolant_flush' },
    { label: 'Sensor Check', value: 'sensor_check' },
    { label: 'Oil Flush', value: 'oil_flush' },
    { label: 'Oil Leak', value: 'oil_leak' },
  ],
  tires_wheels: [
    { label: 'Rotation', value: 'rotation' },
    { label: 'Alignment', value: 'alignment' },
    { label: 'New Tires', value: 'new_tires' },
  ],
  // Add other categories as needed...
};

export const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
];

export type FilterType = 'all' | 'active' | 'expired';

export const SUPPORT_EMAIL = 'davidanuson@gmail.com';
