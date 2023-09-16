

const user = asyncable(async () => {
  const res = await fetch('/surveyer/tugas/009');
  return res.json();
});

/**
 * @param {() => Promise<any>} _arg0
 */
function asyncable(_arg0) {
  throw new Error("Function not implemented.");
}
