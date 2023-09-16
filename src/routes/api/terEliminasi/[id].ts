

import type { RequestHandler } from "@sveltejs/kit";

const terEliminasi: TargetSurvey[] = []

export const post: RequestHandler = async ({ request }) => {
  const body = await request.json();
  terEliminasi.push(body as TargetSurvey)
  console.log('ini dia yang terEliminasiy')
  console.log(body)
  return {
    body: terEliminasi
  }
}

export const GET: RequestHandler = (_request) => {


  return {
    body: { terEliminasis: terEliminasi }
  }


}
