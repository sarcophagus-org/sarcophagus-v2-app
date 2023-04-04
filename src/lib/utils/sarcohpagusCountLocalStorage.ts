export const getSarcophagusCountFromLocalStorage = (
  localStorageKey: string
): { count: number; timestamp: number } | null => {
  const data = localStorage.getItem(localStorageKey);
  if (!data) return null;
  return JSON.parse(data);
};

export const saveSarcophagusCountToLocalStorage = (
  localStorageKey: string,
  count: number
): void => {
  // Usually we would use the block timestamp in place of Date.now() but that is not necessary in
  // this case
  const data = { count, timestamp: Date.now() };
  localStorage.setItem(localStorageKey, JSON.stringify(data));
};
