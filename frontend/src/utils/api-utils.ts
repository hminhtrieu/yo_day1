export const cleanParams = (params: Record<string, any>) => {
  const clean: Record<string, any> = {};
  for (const key in params) {
    const value = params[key];
    if (value !== undefined && value !== null && value !== '') {
      clean[key] = value;
    }
  }
  return clean;
};
