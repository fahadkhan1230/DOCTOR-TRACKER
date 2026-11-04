import * as svc from '../services/dashboardService.js';
import { asyncHandler, sendOk } from '../utils/helpers.js';

export const stats = asyncHandler(async (_req, res) => sendOk(res, await svc.getStats()));
export const perDoctor = asyncHandler(async (_req, res) => sendOk(res, await svc.patientsPerDoctor()));
export const monthly = asyncHandler(async (_req, res) => sendOk(res, await svc.monthlyStats()));
export const specializations = asyncHandler(async (_req, res) => sendOk(res, await svc.specializationStats()));
