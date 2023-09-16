
import type { RequestHandler } from "@sveltejs/kit";

// const let: Tugas[] ;
// export const post: RequestHandler = async ({ request }) => {
//   const body = await request.json();
//   tugas.push(body as Tugas)
//   console.log('ini dia yang tugasy')
//   console.log(body)
//   return {
//     body: tugas
//   }
// }

// export const GET: RequestHandler = (request) => {
//   let par = request.params.idTugas
//   if (par == 'all') {
//     console.log(par)
//     return {
//       body: { tugass: tugas }
//     }
//   } else {
//     let y = par.split('-');
//     let colback = tugas.filter(item => (item.kec == y[0] && item.des == y[1] && item.rw == y[2] && item.rt == y[3]))
//     return {
//       body: { tugass: colback }
//     }
//   }


// }