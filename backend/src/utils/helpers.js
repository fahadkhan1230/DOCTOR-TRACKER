export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const sendOk = (res, data, status = 200) => res.status(status).json({ success: true, data });

export const sendPage = (res, data, { page, limit }, total) =>
  res.json({
    success: true,
    data,
    pagination: { currentPage: page, limit, totalRecords: total, totalPages: Math.ceil(total / limit) },
  });

export const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Builds a createdAt range filter; dateTo is inclusive (end of that day). */
export function dateRange({ dateFrom, dateTo }) {
  if (!dateFrom && !dateTo) return null;
  const r = {};
  if (dateFrom) r.$gte = dateFrom;
  if (dateTo) r.$lte = new Date(dateTo.getTime() + 24 * 60 * 60 * 1000 - 1);
  return r;
}
