import { writable } from "svelte/store";

export const user = writable<User>({
  id: 0,
  username: '',
  full_name: '',
  email: '',
  access: 0,
  noWa: '',
  path_foto: '',
  nik: '',
  alamat: '',
  data_penduduk: null,
  tanggal_daftar: new Date(),
  tugas: ['']

})

export let lengkap = writable<Boolean>(false)

export const updateUser = (target: User) => {
  user.update(() => {
    return target
  })
}
