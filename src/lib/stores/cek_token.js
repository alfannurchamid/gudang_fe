import { GetCookie, SetCookie, logout } from "$lib/stores/cokies";
import { RefreshToken } from "$lib/stores/auth";

export const cek_token = async () => {
  const refresh_key = GetCookie('refreshkey')
  if (!refresh_key) {
    alert("waktu kunjung anda kadaluarsa ,harap login kembali !")
    logout()
  } else {
    const access_key = GetCookie("accesskey")
    if (!access_key) {
      await RefreshToken(refresh_key)
    }
  }
}