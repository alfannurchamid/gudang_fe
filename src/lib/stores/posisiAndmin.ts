import { writable } from "svelte/store";

export const posisi = writable<number>(0)
export const posisiBase = writable<Number>(0)
export const rws = writable<String[]>([])
export const areal = writable<String[]>([])

export const currentPosisi = (target: number) => {
  posisi.update(() => {
    return target
  })
}

export const currentPosisiBase = (target: Number) => {
  posisiBase.update(() => {
    return target
  })
}


export const currentAreas = (kec: string, des: string, rw: string, rt: string) => {
  areal.update(() => {
    return [kec, des, rt, rw]
  })
}


export const currentRws = (rwS: String[]) => {
  rws.update(() => {
    return rwS
  })
}

