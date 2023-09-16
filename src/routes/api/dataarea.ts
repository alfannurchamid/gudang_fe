import type { RequestHandler } from "@sveltejs/kit";
import areas from "$lib/data/areas"


export const GET: RequestHandler = (_request) => {

  return {
    body: { areas: areas }
  }


}