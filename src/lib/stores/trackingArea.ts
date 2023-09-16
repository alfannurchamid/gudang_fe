import daftarKec from '$lib/data/daftarKec';

export const GenerateRwRt = (mode: number, input: string) => {
  const c = input.split('-');
  if (mode == 1) {
    return 'rw ' + c[1] + ' / rt ' + c[2];
  }
  if (mode == 2) {
    return c[0];
  }
  if (mode == 3) {
    return c[1];
  }
  if (mode == 4) {
    return c[2];
  }
};


export const getDes = async (idDes: number) => {
  console.log('GET desaaaa');
  const dataDess = await fetch('/api/datades/des-' + idDes);

  const dataDes = await dataDess.json();
  // console.log(await dataDes.desa.namaDesa);
  if (dataDess.ok) {
    console.log('GET desaaaa oke');

    console.log(dataDes.desa);

    const desaku = await dataDes.desa;
    const kecamatanku = daftarKec.filter((items) => items.id == desaku.idKec)[0].nama;
    return [desaku.namaDesa, kecamatanku]
  } else {
    throw new Error(dataDes);
    return
  }
  // console.log(riwa.riwayats);
}