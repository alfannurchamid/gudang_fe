import type { RequestHandler } from "@sveltejs/kit";
import { derived } from "svelte/store";

let riwayat: Riwayat[] = [
  {
    idAkun: '001',
    path: 'nilai/1',
    waktu: new Date()
  }
]

export const post: RequestHandler = async ({ request }) => {
  const body = await request.json();
  riwayat = riwayat.filter(items => items.path !== body.path)

  riwayat.push(body as Riwayat)
  console.log('ini dia yang riwayaty')
  console.log(body)
  return {
    body: riwayat.reverse()
  }
}

export const GET: RequestHandler = (request) => {
  const id = request.params.idAkun
  const riwayata = riwayat.filter(items => items.idAkun == id)


  return {
    body: { riwayats: riwayata }
  }


}

