export let counting = async (/** @type {number} */ total,/** @type {any} */ ppn_chacked, /** @type {number} */ bm, /** @type {number} */ ppn, /** @type {number} */ pph, /** @type {number} */ exrate) => {

  console.log("input", total, ppn_chacked, bm, ppn, pph, exrate)
  let b = total
  let pabean = (bm / 100) * b;
  let bm_out = pabean
  let a = Number(b) + Number(pabean);

  console.log("pabean", a)
  console.log("bm", bm_out)

  pph = (a * pph) / 100;
  console.log("pph", pph)



  let grand_total = (a + Number(pph));

  a = (a * ppn) / 100;
  console.log("ppn", a)
  if (ppn_chacked) {
    grand_total += a
  }

  if (ppn_chacked) {
    // @ts-ignore
    console.log("ppnn=============================================")
    ppn = (a);
  } else {
    ppn = 0;
  }
  let hasil = {
    total: Number(b),
    pabean: Number(pabean) + Number(b),
    grand_total: Number(grand_total),
    ppn: Number(ppn),
    pph: Number(pph),
    bm: Number(bm_out)
  };
  console.log("output ", hasil)
  return hasil;
};