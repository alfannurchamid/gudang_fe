import { generate_waktu_str } from "./waktu_generator_str";

export const get_laba_berjalan = async () => {

  //  ambil tanggal sekarang
  const today = new Date();

  let ahir = generate_waktu_str(today)

  // ambil laba rugi sekarang
  let laba_berjalan = 0
  const response = await fetch(
    "http://127.0.0.1:8000/api/api/v1/akun/get_data_akun",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        // Authorization: "Bearer " + accessKey,
      },
      body: JSON.stringify({ id_akun: "3.5" })
    }
  );

  if (response.ok) {
    const data1 = await response.json();
    const data = data1.data;
    laba_berjalan = data.saldo
  }
  return laba_berjalan

}