export const log = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') console.info(...args);
};
