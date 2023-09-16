// @ts-ignore
export const get_id_akun_barang = async (kode_barang, type) => {
  let id_beban = ""
  let id_persediaan = ""
  const res = await fetch('http://127.0.0.1:8000/api/api/v1/barang/get_data_barang?kode_barang=' + kode_barang)
  if (res.ok) {
    let hasil = await res.json()

    id_beban = hasil.data.id_akun_beban
    id_persediaan = hasil.data.id_akun_peresediaan
  }

  if (type == "b") {
    return id_beban
  } else {
    return id_persediaan
  }

}