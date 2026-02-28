/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as dashboards from "../dashboards.js";
import type * as functions_openAi from "../functions/openAi.js";
import type * as functions_revenueCat from "../functions/revenueCat.js";
import type * as helpers_openAi from "../helpers/openAi.js";
import type * as http from "../http.js";
import type * as insurance from "../insurance.js";
import type * as maintenanceItems from "../maintenanceItems.js";
import type * as maintenanceTemplates from "../maintenanceTemplates.js";
import type * as openAi from "../openAi.js";
import type * as receipts from "../receipts.js";
import type * as registrations from "../registrations.js";
import type * as revenueCat from "../revenueCat.js";
import type * as serviceRecords from "../serviceRecords.js";
import type * as subscriptions from "../subscriptions.js";
import type * as types_literals from "../types/literals.js";
import type * as users from "../users.js";
import type * as utils_antiAbuseLimits from "../utils/antiAbuseLimits.js";
import type * as utils_auth from "../utils/auth.js";
import type * as utils_errors from "../utils/errors.js";
import type * as utils_storage from "../utils/storage.js";
import type * as utils_validateKey from "../utils/validateKey.js";
import type * as utils_validation from "../utils/validation.js";
import type * as vehicles from "../vehicles.js";
import type * as vin from "../vin.js";
import type * as warranties from "../warranties.js";
import type * as webhooks_revenueCat from "../webhooks/revenueCat.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  dashboards: typeof dashboards;
  "functions/openAi": typeof functions_openAi;
  "functions/revenueCat": typeof functions_revenueCat;
  "helpers/openAi": typeof helpers_openAi;
  http: typeof http;
  insurance: typeof insurance;
  maintenanceItems: typeof maintenanceItems;
  maintenanceTemplates: typeof maintenanceTemplates;
  openAi: typeof openAi;
  receipts: typeof receipts;
  registrations: typeof registrations;
  revenueCat: typeof revenueCat;
  serviceRecords: typeof serviceRecords;
  subscriptions: typeof subscriptions;
  "types/literals": typeof types_literals;
  users: typeof users;
  "utils/antiAbuseLimits": typeof utils_antiAbuseLimits;
  "utils/auth": typeof utils_auth;
  "utils/errors": typeof utils_errors;
  "utils/storage": typeof utils_storage;
  "utils/validateKey": typeof utils_validateKey;
  "utils/validation": typeof utils_validation;
  vehicles: typeof vehicles;
  vin: typeof vin;
  warranties: typeof warranties;
  "webhooks/revenueCat": typeof webhooks_revenueCat;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
