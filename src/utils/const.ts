import { ServiceCategory } from '@convex/types/literals';
import { Ionicons } from '@expo/vector-icons';

export const SERVICE_CATEGORIES = [
  { label: 'Routine Maintenance', value: 'routine' },
  { label: 'Fluids & Filters', value: 'fluids_filters' },
  { label: 'Tires & Braking', value: 'tires_brakes' },
  { label: 'Battery & Electrical', value: 'electrical' },
  { label: 'Engine & Drivetrain', value: 'engine_drive' },
  { label: 'Suspension & Steering', value: 'suspension' },
  { label: 'Body & Interior', value: 'body_interior' },
  { label: 'Other', value: 'other' },
];

export const SERVICES_BY_CATEGORY: Record<
  string,
  { label: string; value: string }[]
> = {
  routine: [
    { label: 'General Inspection', value: 'inspection' },
    { label: 'Oil & Filter Change', value: 'oil_change' },
    { label: 'Tire Rotation', value: 'tire_rotation' },
    { label: 'Wiper Blade Replacement', value: 'wipers' },
    { label: 'Emissions/Smog Check', value: 'emissions' },
  ],
  fluids_filters: [
    { label: 'Engine Air Filter', value: 'air_filter' },
    { label: 'Cabin Air Filter', value: 'cabin_filter' },
    { label: 'Coolant Flush/Service', value: 'coolant_flush' },
    { label: 'Brake Fluid Flush', value: 'brake_fluid' },
    { label: 'Transmission Fluid', value: 'transmission_fluid' },
    { label: 'Power Steering Fluid', value: 'power_steering_fluid' },
  ],
  tires_brakes: [
    { label: 'Brake Pad Replacement', value: 'brake_pads' },
    { label: 'Brake Rotor Replacement', value: 'brake_rotors' },
    { label: 'Wheel Alignment', value: 'alignment' },
    { label: 'New Tires', value: 'new_tires' },
    { label: 'Tire Pressure Check/TPMS', value: 'tpms' },
  ],
  electrical: [
    { label: 'Battery Replacement', value: 'battery_replacement' },
    { label: 'Alternator Service', value: 'alternator' },
    { label: 'Spark Plug Replacement', value: 'spark_plugs' },
    { label: 'Bulb/Light Replacement', value: 'lights' },
    { label: 'Fuse Replacement', value: 'fuses' },
  ],
  engine_drive: [
    { label: 'Timing Belt/Chain', value: 'timing_belt' },
    { label: 'Serpentine/Drive Belt', value: 'drive_belt' },
    { label: 'Fuel Filter Replacement', value: 'fuel_filter' },
    { label: 'Valve Adjustment', value: 'valve_adjustment' },
    { label: 'Differential Service', value: 'differential' },
  ],
  suspension: [
    { label: 'Shock/Strut Replacement', value: 'shocks_struts' },
    { label: 'Control Arm/Ball Joint', value: 'ball_joints' },
    { label: 'Tie Rod Replacement', value: 'tie_rods' },
    { label: 'Wheel Bearing Service', value: 'wheel_bearings' },
  ],
  body_interior: [
    { label: 'A/C Recharge/Service', value: 'ac_service' },
    { label: 'Detailing/Car Wash', value: 'detailing' },
    { label: 'Windshield Repair/Replace', value: 'windshield' },
    { label: 'Paint/Body Work', value: 'body_work' },
  ],
  other: [
    { label: 'Recall Service', value: 'recall' },
    { label: 'Diagnostics/Check Engine Light', value: 'diagnostics' },
    { label: 'Custom Modification', value: 'modification' },
  ],
};

export const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
];

export type FilterType = 'all' | 'active' | 'expired';

export const SUPPORT_EMAIL = 'davidanuson@gmail.com';

export const FLUID_SERVICE_ICON =
  'water-outline' as keyof typeof Ionicons.glyphMap;

const FLUID_SERVICE_NAMES = ['Oil', 'Brake Fluid', 'Transmission Fluid'];

export function getMaintenanceItemIcon(
  category: typeof ServiceCategory.type,
  serviceName: string,
): keyof typeof Ionicons.glyphMap {
  const isFluidService = FLUID_SERVICE_NAMES.some((name) =>
    serviceName.includes(name),
  );
  if (isFluidService) {
    return FLUID_SERVICE_ICON;
  }
  return CATEGORY_ICONS[category] ?? 'build-outline';
}

export const CATEGORY_ICONS: Record<
  typeof ServiceCategory.type,
  keyof typeof Ionicons.glyphMap
> = {
  routine: 'calendar-outline',
  fluids_filters: 'layers-outline',
  tires_brakes: 'disc-outline',
  electrical: 'flash-outline',
  engine_drive: 'construct-outline',
  suspension: 'git-network-outline',
  body_interior: 'car-outline',
  inspection: 'shield-checkmark-outline',
  other: 'ellipsis-horizontal-circle-outline',
};

export const PICKER_AFTER_MODAL_MS = 400;
