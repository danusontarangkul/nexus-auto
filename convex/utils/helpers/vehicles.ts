import { Doc } from '../../_generated/dataModel';

export function resolveActiveVehicle(
  user: Doc<'users'>,
  activeVehicles: Doc<'vehicles'>[],
): Doc<'vehicles'> {
  const preferredId = user.lastSelectedVehicleId;
  return (
    activeVehicles.find((vehicle) => vehicle._id === preferredId) ??
    activeVehicles[0]
  );
}
