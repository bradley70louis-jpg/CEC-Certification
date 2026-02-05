export const MAX_ZS = {
  "60898-B-6": 7.29, "60898-B-10": 4.37, "60898-B-16": 2.73, "60898-B-20": 2.19, "60898-B-25": 1.75, "60898-B-32": 1.37,
  "60898-C-6": 3.64, "60898-C-10": 2.19, "60898-C-16": 1.37, "60898-C-20": 1.09, "60898-C-25": 0.88, "60898-C-32": 0.69,
};

export function getMaxZs(bsen, type, ratingA) {
  if (!bsen || !type || !ratingA) return "";
  const key = `${String(bsen).trim()}-${String(type).trim()}-${Number(ratingA)}`;
  return MAX_ZS[key] ?? "";
}
