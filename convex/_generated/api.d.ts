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
import type * as http from "../http.js";
import type * as insurance from "../insurance.js";
import type * as maintenanceItems from "../maintenanceItems.js";
import type * as maintenanceTemplates from "../maintenanceTemplates.js";
import type * as openAi from "../openAi.js";
import type * as receipts from "../receipts.js";
import type * as registrations from "../registrations.js";
import type * as revenueCat from "../revenueCat.js";
import type * as serviceRecords from "../serviceRecords.js";
import type * as services_openAi from "../services/openAi.js";
import type * as services_revenueCat from "../services/revenueCat.js";
import type * as services_vpic from "../services/vpic.js";
import type * as subscriptions from "../subscriptions.js";
import type * as types from "../types.js";
import type * as types_literals from "../types/literals.js";
import type * as users from "../users.js";
import type * as utils_antiAbuseLimits from "../utils/antiAbuseLimits.js";
import type * as utils_auth from "../utils/auth.js";
import type * as utils_const from "../utils/const.js";
import type * as utils_errors from "../utils/errors.js";
import type * as utils_fetch from "../utils/fetch.js";
import type * as utils_helpers_openAi from "../utils/helpers/openAi.js";
import type * as utils_helpers_vehicles from "../utils/helpers/vehicles.js";
import type * as utils_mappings from "../utils/mappings.js";
import type * as utils_pares from "../utils/pares.js";
import type * as utils_sanatize from "../utils/sanatize.js";
import type * as utils_schemaUtils from "../utils/schemaUtils.js";
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
  http: typeof http;
  insurance: typeof insurance;
  maintenanceItems: typeof maintenanceItems;
  maintenanceTemplates: typeof maintenanceTemplates;
  openAi: typeof openAi;
  receipts: typeof receipts;
  registrations: typeof registrations;
  revenueCat: typeof revenueCat;
  serviceRecords: typeof serviceRecords;
  "services/openAi": typeof services_openAi;
  "services/revenueCat": typeof services_revenueCat;
  "services/vpic": typeof services_vpic;
  subscriptions: typeof subscriptions;
  types: typeof types;
  "types/literals": typeof types_literals;
  users: typeof users;
  "utils/antiAbuseLimits": typeof utils_antiAbuseLimits;
  "utils/auth": typeof utils_auth;
  "utils/const": typeof utils_const;
  "utils/errors": typeof utils_errors;
  "utils/fetch": typeof utils_fetch;
  "utils/helpers/openAi": typeof utils_helpers_openAi;
  "utils/helpers/vehicles": typeof utils_helpers_vehicles;
  "utils/mappings": typeof utils_mappings;
  "utils/pares": typeof utils_pares;
  "utils/sanatize": typeof utils_sanatize;
  "utils/schemaUtils": typeof utils_schemaUtils;
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
