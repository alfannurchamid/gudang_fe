export const Separator = () => (/** @type {{ toString: () => string; }} */ x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}