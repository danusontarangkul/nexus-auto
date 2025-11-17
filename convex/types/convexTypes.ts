import { Doc } from "../_generated/dataModel";

export type WarrantyWithReceipts = {
  warranty: Doc<"warranties">;
  receipts: Doc<"receipts">[];
};
