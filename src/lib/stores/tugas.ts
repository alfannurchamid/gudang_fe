import { element } from "svelte/internal";
import { writable } from "svelte/store";

export let tugasSurveyer = writable<Tugas[]>()

export const setTugas = (tugases: string[]) => {
  let tugasrw: Tugas[] = [];

  for (let tg in tugases) {
    let x = tugases[Number(tg)].split('-');
    if (tugasrw) {
      const isFound = tugasrw.some(element => {
        if (element.rw === x[1]) {
          return true
        }
        return false
      })

      if (!isFound) {
        // jika rw  ada dalam list

        tugasrw.push({
          rw: x[1],
          rt: [x[2]]
        });
      } else {
        const index = tugasrw.findIndex(element => {
          if (element.rw === x[1]) {
            return true
          }
          return false
        })

        tugasrw[index].rt.push(x[2])
      }
    }
  }
  tugasSurveyer.update(() => {
    return tugasrw
  })

}