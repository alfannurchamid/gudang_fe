
import type { RequestHandler } from "@sveltejs/kit";

const terSurvey: DataIndikasi[] = []

export const post: RequestHandler = async ({ request }) => {
  const body = await request.json();
  terSurvey.push(body as DataIndikasi)
  console.log('ini dia yang tersurveyy')
  console.log(body)
  return {
    body: terSurvey
  }
}

export const GET: RequestHandler = (_request) => {


  return {
    body: { tersurveys: terSurvey }
  }


}
