// @ts-ignore
export const get_laba_penj_ini = async (id_akun, no_daftar) => {
  let h = 0
  const res = await fetch("http://127.0.0.1:8000/api/api/v1/akuntansi/get_laba_trans_ini?id_akun=" + id_akun + "&no_daftar=" + no_daftar)
  if (res.ok) {
    let hasil = await res.json()
    console.log("hpp nya" + hasil.data.saldo)
    h = hasil.data.saldo
  }
  return h
}