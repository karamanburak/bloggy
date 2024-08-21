export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    if (num < 1100) {
      return "1K";
    }
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num;
  }
};
