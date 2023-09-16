type InputReg = {
  id: number
  tag: string
  alert: string[]
}

type Id = number

type Ev = object

type Alamat = {
  kabupaten: string
  kecamatan: number
  desa: number
  rw: number
  rt: number
}

type User = {
  id: number
  username: string
  full_name: string
  email: string
  access: number
  alamat: string | null
  noWa: string | null
  nik: string | null
  path_foto: string | null,
  data_penduduk: data_penduduk_user | null
  tanggal_daftar: Date
  tugas: string[]

}



type Auth = {
  auth: boolean
  users: User
}

