<script>
  // @ts-nocheck

  // @ts-nocheck

  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { counting } from "$lib/stores/counting_administrasi";

  import { cek_token } from "$lib/stores/cek_token";
  import { GetCookie } from "$lib/stores/cokies";

  import { Nf } from "$lib/stores/formatNumber";

  // import { Separator } from "$lib/stores/sparator";
  let accessKey = "";
  let refreshKey = "";
  // let Nf = new Intl.NumberFormat("en-US");

  onMount(async () => {
    await cek_token();
    accessKey = GetCookie("accesskey");
    refreshKey = GetCookie("refreshkey");
  });
  // @ts-ignore

  /**
   * @type {any[]}
   */
  export let data;

  let tgl_po = "";
  let id_suplier = 0;
  let tgl_minta_kirim = "";
  let kode_barang = "";
  let jumlah_order = 0;
  let harga_satuan = 0;
  let remark = "";
  let vlauta;
  let id_akun_payment = 0;
  let discount = 0;
  let ppn = 0;
  let pph = 0;
  let bm = 0;
  let pabean = 0;
  let administrasi_import = 0;
  let satuan = "";

  let nomor_po = "";
  let exrate = 0;
  let grand_total = 0;
  let grand_total_idr = 0;

  let ppn_chacked = false;

  let ppn_count = async () => {
    total = selected_barang.harga * jumlah_order;
    total = (total - (discount / 100) * total).toFixed(2);

    console.log("totalllll", total);

    let hasil_count = await counting(
      total,
      ppn_chacked,
      selected_barang.bm,
      selected_barang.ppn,
      selected_barang.pph,
      exrate
    );

    pabean = hasil_count.pabean * exrate;

    pph = Math.ceil(hasil_count.pph * exrate);
    ppn = Math.ceil(hasil_count.ppn * exrate);

    grand_total = hasil_count.grand_total.toFixed(2);
    grand_total_idr = Number(grand_total * exrate).toFixed(2);
    console.log(
      "di format",
      Nf.format(Number(grand_total * exrate).toFixed(2))
    );

    // grand_total = Separator(grand_total);
    bm = Math.ceil(hasil_count.bm * exrate);
    administrasi_import = Math.ceil(
      Math.ceil(hasil_count.pph + hasil_count.bm + hasil_count.ppn) * exrate
    );
    console.log(administrasi_import);
  };

  let hasError = false;
  let isSuccessVisible = false;
  let submitted = false;
  /**
   * @type {any[]}
   */
  let data_barang = [];
  /**
   * @type {{ kode_barang: string; nama_barang: string; harga: number; ppn: number; pph: number; bm: number; lokasi: string; saldo: number; satuan: string; }}
   */

  /**
   * @type {any[]}
   */
  let data_suplier = [];

  /**
   * @type {any[]}
   */
  let data_akun = [];
  let akun_change = {
    id_akun: 1,
    nama_akun: "hutang dagang",
    kategori_akun: "modal",
    pos_akun_debit: false,
  };

  let suplier_change = {
    id_suplier: "",
    nama_suplier: "",
    asal_negara: "",
  };
  let selected_barang = {
    kode_barang: "",
    nama_barang: "",
    harga: 0,
    lokasi: "",
    saldo: 0,
    satuan: "",
    bm: 0,
    pph: 11,
    ppn: 2.5,
  };
  let total = 0;
  // get barang
  const pull = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/barang/get_data_barangs",
      {
        headers: {
          accept: "application/json",
          // "Content-Type": "application/json",
          // Authorization: "Bearer " + accessKey,
        },
      }
    );

    if (response.ok) {
      const data1 = await response.json();
      data_barang = data1.data.data;
    }
  };

  const pull_suplier = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/suplier/get_supliers",
      {
        headers: {
          accept: "application/json",
          // "Content-Type": "application/json",
          // Authorization: "Bearer " + accessKey,
        },
      }
    );

    if (response.ok) {
      const data1 = await response.json();
      data_suplier = data1.data.data;
    }
  };

  const pull_akun = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/akun/get_data_akuns",
      {
        headers: {
          accept: "application/json",
          // "Content-Type": "application/json",
          // Authorization: "Bearer " + accessKey,
        },
      }
    );

    if (response.ok) {
      const data1 = await response.json();
      data_akun = data1.data.data;
      data_akun = data_akun.filter(
        (items) =>
          items.id_akun.startsWith("1.1") || items.id_akun.startsWith("2.1")
      );
    }
  };

  onMount(async () => {
    pull();
    pull_suplier();
    pull_akun();
  });

  const errMessage = "maaf terjadi kesalahan";

  function reset_form() {
    document.getElementById("reseter")?.click();
  }

  const upload_po = async () => {
    await cek_token();
    accessKey = GetCookie("accesskey");

    id_suplier = suplier_change.id_suplier;
    kode_barang = selected_barang.kode_barang;
    harga_satuan = selected_barang.harga;
    id_akun_payment = akun_change.id_akun;

    let bobo = JSON.stringify({
      nomor_po,
      tgl_po,
      id_suplier,
      tgl_minta_kirim,
      kode_barang,
      jumlah_order,
      harga_satuan,
      remark,
      vlauta,
      id_akun_payment,
      discount,
      ppn,
      exrate,
      grand_total,
      administrasi_import,
    });
    // upload po
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/purchase_order/add_po",
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessKey,
        },
        body: bobo,
      }
    );

    if (response.ok) {
      isSuccessVisible = true;

      const dapat = await response.json();
      const id_po_baru = dapat.data.id_po;

      console.log("id_po baruu", id_po_baru);

      data.unshift({
        acc: 0,
        administrasi_import: administrasi_import,
        done: 0,
        id_po: id_po_baru,
        id_suplier: id_suplier,
        jumlah_order: 1000,
        kode_barang: kode_barang,
        nama_barang: selected_barang.nama_barang,
        nama_suplier: suplier_change.nama_suplier,
        nomor_po: nomor_po,
        tgl_po: tgl_po,
        vlauta: vlauta,
      });

      console.log(data);

      data = data;

      reset_form();
      setTimeout(function () {
        isSuccessVisible = false;
      }, 4000);
    } else {
      hasError = true;
    }
  };

  const close = () => {
    const seting = document.getElementById("pop_tambah_barang")?.classList;

    let clickUser = false;

    clickUser = !clickUser;

    seting?.remove(
      "backdrop-blur-xl",
      "bg-opacity-5",
      "backdrop-brightness-75"
    );
    seting?.add(
      "translate-y-full",
      "translate-y-full",
      "backdrop-blur-none",
      "bg-opacity-0"
    );
  };
</script>

<div
  id="pop_tambah_barang"
  class="w-full translate-y-full flex pt-3 justify-center top-12 left-0 right-0 z-50 fixed duration-300 bg-slate-700 backdrop-brightness-50 backdrop-blur-xl transition-all bg-opacity-5 h-full rounded-t-2xl"
>
  <!-- translate-y-full -->
  <div
    style="min-height: 55%; height:90%"
    class=" w-11/12 md:w-9/12 bg-white backdrop-blur-3xl bg-opacity-80 rounded-2xl flex flex-col"
  >
    <div
      class="w-full h-8 my-1 border-b-2 border-slate-100 flex items-center justify-between px-2"
    >
      <div class="bg-slate-200 text-slate-200">.</div>
      <h1 class="text-center text-xs font-semibold">
        Create Purchace Order {Nf.format(
          Number(grand_total * exrate).toFixed(2)
        )}
      </h1>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={() => {
          close();
        }}
        class=" btn-close"
      >
        X
      </div>
    </div>

    <div class="w-full text-center justify-center">
      {#if hasError == true}
        <p class="error-alert">{errMessage}</p>
      {:else if isSuccessVisible}
        <p class="error-alert" transition:fade={{ duration: 150 }}>
          Data updated successfully
        </p>
      {/if}
    </div>
    <div class="w-full md:flex-row flex-col flex p-5">
      <form class="submitted w-full" on:submit|preventDefault={upload_po}>
        <div class=" md:flex-col flex-row w-full flex items-center">
          <div class="flex w-full pl-16 flex-col">
            <div class=" flex flex-row items-center w-full justify-start">
              <h5 class=" py-1 mr-10 text-gray-600">nomor po :</h5>
              <input
                bind:value={nomor_po}
                type="number"
                class="inputB1 my-1 px-2 mr-5 uppercase rounded-lg"
                required
              />

              <h5 class=" py-1 mr-10 text-gray-600">suplier :</h5>
              <select
                required
                bind:value={suplier_change}
                class="inputB1 w-64 my-1 mr-2 px-2 rounded-lg"
                placeholder="opsional"
              >
                {#each data_suplier as dt_b}
                  <option value={dt_b}> {dt_b.nama_suplier}</option>
                {/each}
              </select>
            </div>

            <div class=" flex flex-row items-center w-full justify-start">
              <h5 class=" py-1 mr-10 text-gray-600">tangal order :</h5>
              <input
                bind:value={tgl_po}
                type="date"
                class="inputB1 my-1 mr-5 px-2 rounded-lg"
                required
              />

              <h5 class=" py-1 mr-5 text-gray-600">tangal minta kirim :</h5>
              <input
                bind:value={tgl_minta_kirim}
                type="date"
                class="inputB1 my-1 px-2 rounded-lg"
                required
              />
            </div>

            <div class=" flex flex-row items-center w-full justify-start">
              <h5 class=" py-1 mr-10 text-gray-600">valuta :</h5>
              <select
                bind:value={vlauta}
                class="inputB1 my-1 mr-5 px-2 rounded-lg"
                placeholder="opsional"
              >
                <option value="USD" selected>USD</option>
                <option value="IDR">IDR</option>
              </select>
              <h5 class=" py-1 text-gray-600 mr-5">ex-rate :</h5>
              <input
                step="0.01"
                bind:value={exrate}
                required
                type="number"
                class="inputB1 my-1 w-20 px-2 rounded-lg uppercase"
              />
            </div>

            <div class=" flex flex-row items-center w-full justify-start">
              <h5 class=" py-1 mr-10 text-gray-600">barang :</h5>
              <select
                bind:value={selected_barang}
                class="inputB1 my-1 mr-2 px-2 rounded-lg"
                placeholder="opsional"
              >
                {#each data_barang as dt_b}
                  <option value={dt_b} selected
                    >{dt_b.kode_barang} - {dt_b.nama_barang}</option
                  >
                {/each}
              </select>
            </div>
            <div class=" flex flex-row items-center w-full justify-start">
              <h5 class=" py-1 mr-5 text-gray-600">harga satuan :</h5>
              <input
                step="0.01"
                on:keyup={() => {
                  ppn_count();
                }}
                bind:value={selected_barang.harga}
                type="number"
                class="inputB1 w-32 my-1 px-2 rounded-lg"
                required
              />
            </div>
            <div class="flex w-10/12 flex-col">
              <div class=" flex flex-row items-center w-full justify-start">
                <h5 class=" py-1 mr-10 text-gray-600">jumlah barang :</h5>
                <input
                  on:click={() => {
                    ppn_count();
                  }}
                  on:keyup={() => {
                    ppn_count();
                  }}
                  bind:value={jumlah_order}
                  type="number"
                  class="inputB1 w-32 nr-5 mr-5 my-1 px-2 rounded-lg"
                  required
                />
                <h5 class=" py-1 mr-5 text-gray-600">
                  total harga ({vlauta}) :
                </h5>
                <input
                  readonly
                  value={Nf.format(total)}
                  type="text"
                  class="inputB1 bg-gray-200 w-32 my-1 px-2 rounded-lg"
                />
              </div>

              <div class=" flex flex-row items-center w-full justify-start">
                <h5 class=" py-1 mr-10 text-gray-600">discount :</h5>
                <input
                  step="0.01"
                  pattern="^\d*(\.\d{(0, 2)})?$"
                  on:keyup={() => {
                    ppn_count();
                  }}
                  bind:value={discount}
                  required
                  type="number"
                  class="inputB1 my-1 px-2 mr-4 w-12 rounded-lg"
                />

                <h5 class=" py-1 mr-2 text-gray-600">%</h5>
                ({vlauta})
                <input
                  readonly
                  value={Math.ceil(
                    (discount / 100) * selected_barang.harga * jumlah_order
                  )}
                  type="number"
                  class="inputB1 bg-gray-200 my-1 px-2 w-26 rounded-lg uppercase"
                  placeholder="diisi dengan singkatan"
                />
              </div>
              <div class=" flex flex-row w-full items-center justify-start">
                <h5 class=" py-1 mr-10 text-gray-600">pabean :</h5>
                <h5 class=" py-1 mr-1 text-gray-600">IDR</h5>
                <input
                  readonly
                  value={Nf.format(pabean)}
                  type="text"
                  class="inputB1 my-1 bg-slate-200 px-2 rounded-lg"
                  placeholder="opsional"
                />

                <h5 class=" py-1 mr-10 text-gray-600">pph :</h5>
                <h5 class=" py-1 mr-1 text-gray-600">IDR</h5>
                <input
                  readonly
                  value={Nf.format(pph)}
                  type="text"
                  class="inputB1 my-1 bg-slate-200 px-2 rounded-lg"
                  placeholder="opsional"
                />
              </div>
              <div class=" flex flex-row w-full items-center justify-start">
                <h5 class=" py-1 mr-10 text-gray-600">ppn(Rp) :</h5>
                <input
                  pattern="^\d*(\.\d{(0, 2)})?$"
                  on:click={() => {
                    ppn_chacked = !ppn_chacked;
                    ppn_count();
                  }}
                  class="mr-3 w-5 h-5"
                  type="checkbox"
                />
                <input
                  readonly
                  bind:value={ppn}
                  type="number"
                  class="inputB1 my-1 bg-slate-200 px-2 rounded-lg"
                  placeholder="opsional"
                />
              </div>
              <div class=" flex flex-row items-center w-full justify-start">
                <h5 class=" py-1 mr-10 text-gray-600">grand total :</h5>
                <h5 class=" py-1 mr-1 text-gray-600">USD</h5>
                <input
                  readonly
                  value={Nf.format(grand_total)}
                  type="text"
                  class="inputB1 bg-gray-200 my-1 mr-5 px-2 rounded-lg"
                />

                <h5 class=" py-1 mr-1 text-gray-600">IDR</h5>
                <input
                  readonly
                  value={Nf.format(grand_total_idr)}
                  type="text"
                  class="inputB1 bg-gray-200 my-1 px-2 rounded-lg"
                />
              </div>

              <div class=" flex flex-row items-center w-full justify-start">
                <h5 class=" py-1 mr-10 text-gray-600">akun :</h5>
                <select
                  bind:value={akun_change}
                  class="inputB1 w-64 my-1 mr-2 px-2 rounded-lg"
                  placeholder="opsional"
                >
                  {#each data_akun as dt_b}
                    <option value={dt_b}> {dt_b.nama_akun}</option>
                  {/each}
                </select>
              </div>
            </div>
            <div class="flex w-full justify-end">
              <!-- <button type="submit" class=" ml-3 btn-success mt-1 ">simpan</button
          > -->
              <button class=" btn-success" on:click={() => (submitted = true)}
                >Continue</button
              >
              <button id="reseter" type="reset" class=" ml-3 btn-secondary"
                >reset</button
              >
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <button
                type="reset"
                on:click={() => {
                  close();
                }}
                class=" ml-3 btn-secondary"
              >
                batal
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="w-full flex justify-end p-5" />
  </div>
</div>

<style>
  .submitted input:invalid {
    border: 1px solid rgb(255, 130, 13);
  }

  .submitted input:focus:invalid {
    outline: 1px solid rgb(255, 130, 13);
  }
</style>
