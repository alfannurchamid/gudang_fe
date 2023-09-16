const days = ["Minggu", "Senin", "Selesa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


export const generate_waktu = (/** @type {string | number | Date} */ dt) => {
  const a = new Date(dt);
  const hari = days[a.getDay()];
  const tanggal = a.getDate();
  const bulan = months[a.getMonth()];

  return hari + " " + tanggal + " " + bulan + " " + a.getFullYear();
};