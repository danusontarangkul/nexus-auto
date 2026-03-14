import { ServiceCategory } from '../types/literals';

interface VehicleMetadata {
  year: number | null;
  make: string | null;
  model: string | null;
  driveType?: string | null;
  transmission?: string | null;
  cylinders?: number | null;
  fuelType?: string | null;
}

export interface MaintenanceTask {
  serviceName: string;
  category: typeof ServiceCategory.type;
  intervalMiles?: number;
  intervalMonths?: number;
  notes?: string;
}

export const UNIVERSAL_TASKS: Record<string, MaintenanceTask[]> = {
  base: [
    {
      serviceName: 'Oil & Filter Change',
      category: 'fluids_filters',
      intervalMiles: 7500,
      intervalMonths: 12,
    },
    {
      serviceName: 'Tire Rotation',
      category: 'tires_brakes',
      intervalMiles: 7500,
    },
    {
      serviceName: 'Brake Fluid Flush',
      category: 'fluids_filters',
      intervalMiles: 30000,
      intervalMonths: 36,
    },
    {
      serviceName: 'Engine Air Filter',
      category: 'fluids_filters',
      intervalMiles: 30000,
    },
    {
      serviceName: 'Cabin Air Filter',
      category: 'fluids_filters',
      intervalMiles: 30000,
    },
  ],
  awd: [
    {
      serviceName: 'Rear Differential Fluid',
      category: 'fluids_filters',
      intervalMiles: 30000,
    },
    {
      serviceName: 'Transfer Case Fluid',
      category: 'fluids_filters',
      intervalMiles: 30000,
    },
  ],
  v6_v8: [
    {
      serviceName: 'Spark Plug Replacement',
      category: 'electrical',
      intervalMiles: 100000,
    },
  ],
  timing_belt_era: [
    {
      serviceName: 'Timing Belt & Water Pump',
      category: 'engine_drive',
      intervalMiles: 105000,
      intervalMonths: 84,
    },
  ],
  cvt: [
    {
      serviceName: 'CVT Fluid Service',
      category: 'fluids_filters',
      intervalMiles: 30000,
    },
  ],
  automatic: [
    {
      serviceName: 'Transmission Fluid Service',
      category: 'fluids_filters',
      intervalMiles: 45000,
    },
  ],
};

export function generateUniversalSchedule(
  data: VehicleMetadata,
): MaintenanceTask[] {
  const year = data.year ?? new Date().getFullYear();
  const cylinders = data.cylinders ?? 4;
  const driveType = (data.driveType ?? '').toLowerCase();
  const transmission = (data.transmission ?? '').toLowerCase();
  const fuelType = (data.fuelType ?? '').toLowerCase();

  const isEV = fuelType.includes('electric') || fuelType.includes('bev');

  if (isEV) {
    return [
      ...UNIVERSAL_TASKS.base.filter(
        (item) =>
          !['Oil & Filter Change', 'Engine Air Filter'].includes(
            item.serviceName,
          ),
      ),
      {
        serviceName: 'Battery Coolant Inspection',
        category: 'fluids_filters',
        intervalMiles: 50000,
      },
      {
        serviceName: 'Reduction Gear Fluid',
        category: 'fluids_filters',
        intervalMiles: 100000,
      },
      {
        serviceName: 'Cabin Air Filter',
        category: 'fluids_filters',
        intervalMiles: 30000,
      },
    ];
  }

  let schedule: MaintenanceTask[] = [...UNIVERSAL_TASKS.base];

  if (driveType.includes('awd') || driveType.includes('4wd')) {
    schedule = [...schedule, ...UNIVERSAL_TASKS.awd];
  }

  if (cylinders >= 6) {
    schedule = [...schedule, ...UNIVERSAL_TASKS.v6_v8];
  }

  if (year < 2010 || cylinders >= 6) {
    schedule = [...schedule, ...UNIVERSAL_TASKS.timing_belt_era];
  }

  if (transmission.includes('cvt')) {
    schedule = [...schedule, ...UNIVERSAL_TASKS.cvt];
  } else {
    schedule = [...schedule, ...UNIVERSAL_TASKS.automatic];
  }

  return schedule;
}
