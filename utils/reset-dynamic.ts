export const resetDynamic = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("dynamic_")) {
      localStorage.removeItem(key);
    }
  });
};
