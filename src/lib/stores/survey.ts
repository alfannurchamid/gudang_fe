import { writable } from "svelte/store";

export const tersurvey = writable<TargetSurvey[]>([])
export const currentSurvey = writable<TargetSurvey[]>([
  {
    nama: 'alfan',
    nik: '3307011203000003',
    nkk: '33070190239023',
    desa: '009',
    rt: '01',
    rw: '01',
    idArea: '0090101'
  }]
)

export const currentTarget = (target: TargetSurvey) => {
  currentSurvey.update(() => {
    return [target]
  })
}