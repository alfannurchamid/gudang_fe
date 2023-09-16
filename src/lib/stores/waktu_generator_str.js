export const generate_waktu_str = (/** @type {string | number | Date} */ dt) => {
  const a = new Date(dt);
  const hari = a.getDay();
  const tanggal = a.getDate();
  const bulan = a.getMonth() + 1;

  return a.getFullYear() + "-" + bulan + "-" + tanggal;
};