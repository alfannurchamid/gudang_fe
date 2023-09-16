<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";

  import { SetCookie, GetCookie, DelCookie } from "$lib/stores/cokies";
  import { counting } from "$lib/stores/counting_administrasi";
  import { Nf } from "$lib/stores/formatNumber";

  import { cek_token } from "$lib/stores/cek_token";

  let accessKey = "";
  let refreshKey = "";

  onMount(async () => {
    await cek_token();
    accessKey = GetCookie("accesskey");
    refreshKey = GetCookie("refreshkey");
  });
  /**
   * @type {any[]}
   */
  let data = [];
  import {
    posisi,
    currentPosisiBase,
    posisiBase,
    currentPosisi,
  } from "$lib/stores/posisiAndmin";
  import { each } from "svelte/internal";
  import { goto } from "$app/navigation";

  let table_is_open = false;

  let hasError = false;
  let isSuccessVisible = false;
  let submitted = false;
  let no_daftar = "";
  let no_pengajuan = "";
  let tanggal_daftar = "";
  let id_suplier = 0;
  let kode_barang = "";
  /**
   * @type {string}
   */
  let id_po;
  let jumlah = 0;
  let harga_satuan = 0;
  let tanggal = "";
  let saldo_jml = 0;
  let no_sppb = "";
  let tanggal_sppb = "";
  let nomor_invoice = "";
  let tanggal_invoice = "";
  let jenis = "";
  let vlauta = "";
  let exchane_rate = 0;
  let total_harga_invoice;
  let discount = 0;
  let freight = 0;
  let tanggal_jatuh_tempo = "";
  let grad_total = 0;
  let pembayaran = "";

  let administrasi_import = 0;
  let administrasi_import_idr = 0;
  let nilai_pabean = 0;
  let ppn_chacked = false;

  let aju = "";

  let nama_barang = "";
  let satuan = "";

  let bm = 0;
  let ppn_index = 0;
  let ppn = 0;
  let pph = 0;

  let total_harga = 0;
  let lokasi = "";

  /**
   * @type {any[]}
   */
  let data_docs = [];

  let jenis_dok_lis = ["BC.23", "BC.27"];
  let jenis_dokumen = "";

  /**
   * @type {any[]}
   */
  let data_po_id = [];
  let po_change = {
    id_po: "",
    nomor_po: "",
    tgl_minta_kirim: "",
  };
  let doc_change = {
    id_doc: "",
    nomor: "",
    tanggal: "",
  };

  /**
   * @type {any[]}
   */
  let data_suplier = [];
  let suplier_change = {
    id_suplier: "",
    nama_suplier: "",
    asal_negara: "",
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

  const pull_docs = async () => {
    let jenis = true;
    const jenis_dok = jenis_dokumen;
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/standar_doc/get_docs_id",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          // Authorization: "Bearer " + accessKey,
        },
        body: JSON.stringify({
          jenis,
          jenis_dok,
        }),
      }
    );

    if (response.ok) {
      const data1 = await response.json();
      data_docs = data1.data.data;
    }
  };

  const pull_po_id = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/purchase_order/get_po_s_id",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          // Authorization: "Bearer " + accessKey,
        },
      }
    );

    if (response.ok) {
      const data1 = await response.json();
      data_po_id = data1.data.data;
    }
  };

  const recount = async (total) => {
    total = total - harga_satuan * jumlah * (discount / 100);
    total = Number(total).toFixed(2);
    let hasil = await counting(
      total,
      ppn_chacked,
      bm,
      ppn_index,
      pph,
      exchane_rate
    );

    let ppn = Number(hasil.ppn);
    let pph_count = Number(hasil.pph);
    let bm_count = Number(hasil.bm);

    nilai_pabean = (Number(hasil.pabean) * exchane_rate).toFixed(0);

    administrasi_import = (pph_count + ppn + bm_count).toFixed(0);
    administrasi_import_idr = (
      (pph_count + ppn + bm_count) *
      exchane_rate
    ).toFixed(0);
    grad_total = Number(hasil.grand_total).toFixed(2);
    // console.log("outputannn", hasil);
    // grand_total_count();
  };

  const pull_po = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/purchase_order/get_po",
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          // Authorization: "Bearer " + accessKey,
        },
        body: JSON.stringify({
          id_po,
        }),
      }
    );

    if (response.ok) {
      const data1 = await response.json();
      const data_po = data1.data;

      suplier_change.nama_suplier = data_po.nama_suplier;
      kode_barang = data_po.kode_barang;
      nama_barang = data_po.nama_barang;
      satuan = data_po.satuan;
      jumlah = data_po.jumlah_order;
      harga_satuan = data_po.harga_satuan;
      total_harga = Math.ceil(jumlah * harga_satuan);
      vlauta = data_po.vlauta;
      exchane_rate = data_po.exrate;
      discount = data_po.discount;
      pembayaran = data_po.id_akun_payment;
      id_suplier = data_po.id_suplier;
      administrasi_import_idr = data_po.administrasi_import;

      if (data_po.ppn > 0) {
        ppn_chacked = true;
      }

      bm = data_po.bm;
      pph = data_po.pph;
      ppn_index = data_po.ppn_index;

      let total = harga_satuan * jumlah;

      await recount(total);
    }
  };

  const grand_total_count = async () => {
    grad_total = (
      Number(total_harga_invoice) +
      Number(freight) +
      Number(administrasi_import)
    ).toFixed(0);
  };

  const push_data = async () => {
    await cek_token();
    accessKey = GetCookie("accesskey");

    grad_total = Number(total_harga_invoice) + Number(freight);
    let pabean = nilai_pabean;
    saldo_jml = jumlah;

    no_pengajuan = "-";
    const data_post = {
      no_daftar,
      no_pengajuan,
      tanggal_daftar,
      id_suplier,
      kode_barang,
      nama_barang,
      id_po,
      jumlah,
      harga_satuan,
      saldo_jml,
      no_sppb,
      tanggal_sppb,
      nomor_invoice,
      tanggal_invoice,
      discount,
      freight,
      grad_total,
      pembayaran,
      jenis,
      vlauta,
      exchane_rate,
      total_harga_invoice,
      lokasi,
      administrasi_import_idr,
      pabean,
    };
    console.log(data_post);

    const bobo = JSON.stringify(data_post);

    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/transaksi_in/create_transaksi_in",
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
      data_transaksi_in_s_belum.unshift(data_post);
      data_transaksi_in_s_show = data_transaksi_in_s_belum;

      reset_form();
      setTimeout(function () {
        isSuccessVisible = false;
      }, 4000);
    } else {
      hasError = true;
      setTimeout(function () {
        hasError = false;
      }, 4000);
    }

    // dellete cookie
    DelCookie("id_po");
    DelCookie("nomor_po");
  };

  const errMessage = "maaf terjadi kesalahan";

  function reset_form() {
    document.getElementById("reseter")?.click();
  }

  /**
   * @type {any[]}
   */
  let data_transaksi_in_s_show = [];
  let data_transaksi_in_s_belum = [];
  let data_transaksi_in_s_jual = [];

  const pull = async () => {
    let typene = "false";
    if (btn_acc_aktif) {
      typene = "true";
    }
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/transaksi_in/get_transaksi_in_s?type=" +
        typene,
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
      if (btn_belum_aktif) {
        data_transaksi_in_s_belum = data1.data.data;
        data_transaksi_in_s_show = data_transaksi_in_s_belum;
      } else {
        data_transaksi_in_s_jual = data1.data.data;
        data_transaksi_in_s_show = data_transaksi_in_s_jual;
      }
      console.log(data1.data.data);
    }
  };

  let id_pop = "";
  let nomor_pop = "";

  onMount(async () => {
    pull();
    pull_po_id();
    pull_suplier();

    let get_nomor_pop = GetCookie("nomor_po");
    let get_id_doc = GetCookie("id_po");
    if (get_id_doc && get_nomor_pop && get_id_doc !== null) {
      id_pop = get_id_doc;
      id_po = get_id_doc;
      nomor_pop = get_nomor_pop;
      pull_po();
    }
  });

  currentPosisiBase(0);
  currentPosisi(1);

  const expired_at = 3000000;
  let no_daftar_in = "";
  const change_to_pengeluaran = () => {
    SetCookie("id_doc_in", no_daftar_in, expired_at);

    goto("transaksi_out");
  };

  let diajukan = false;
  const ajukan = async () => {
    cek_token();
    const id_user = GetCookie("id_user");
    let jenis = true;
    if (
      confirm("apakah anda yakin untuk melakukan pengajuan penyesuaian ?") ==
      true
    ) {
      console.log("diajukan");
      const response = await fetch(
        "http://127.0.0.1:8000/api/api/v1/penyesuaian/add_pengajuan",
        {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessKey,
          },
          body: JSON.stringify({
            jenis,
            no_daftar,
            id_user,
          }),
        }
      );
      if (response.ok) {
        diajukan = true;
      }
    }
  };

  const open_print = (i) => {
    const data_str = JSON.stringify(data_transaksi_in_s_show[i]);
    // alert(data_str);
    SetCookie("data_dokumen", data_str, 1 * 60 * 60000);
    window.open("/print");
  };

  let btn_belum_aktif = true;
  let btn_acc_aktif = false;

  let sudah_dijual = false;
  const switch_dijual = (x) => {
    sudah_dijual = x;
    btn_belum_aktif = !x;
    btn_acc_aktif = x;

    if (x) {
      if (data_transaksi_in_s_jual.length == 0) {
        pull();
      } else {
        data_transaksi_in_s_show = data_transaksi_in_s_jual;
      }
    } else {
      data_transaksi_in_s_show = data_transaksi_in_s_belum;
    }
  };
  let isSuccessVisibleHapus = false;
  const hapus_tin = async () => {
    const no_daftar = no_daftar_in;
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/transaksi_in/delete_transaksi_in",
      {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          // Authorization: "Bearer " + accessKey,
        },
        body: JSON.stringify({
          no_daftar,
        }),
      }
    );
    if (response.ok) {
      data_transaksi_in_s_belum = data_transaksi_in_s_belum.filter(
        (item) => item.no_daftar != no_daftar
      );
      data_transaksi_in_s_show = data_transaksi_in_s_belum;

      pull_po_id();
      pull_docs();
      data_docs = data_docs;
      isSuccessVisibleHapus = true;
      reset_form();
      setTimeout(function () {
        isSuccessVisibleHapus = false;
      }, 4000);
    } else {
      hasError = true;
      setTimeout(function () {
        hasError = false;
      }, 4000);
    }
  };
</script>

<div class=" text-xs w-full h-screen p-12">
  <div class=" pl-10 w-full h-full">
    <form
      class="submitted w-full flex flex-col"
      on:submit|preventDefault={push_data}
    >
      <h1 class=" text-center text-lg font-semibold text-gray-600">
        Form Pencatatan Pemasukan Barang
      </h1>
      <!-- message -->
      <div class="w-full text-center justify-center">
        {#if hasError == true}
          <p class="error-alert">{errMessage}</p>
        {:else if isSuccessVisible}
          <p class="error-alert" transition:fade={{ duration: 150 }}>
            Data updated successfully
          </p>
        {/if}
      </div>
      <!-- body -->
      <div class="w-full mt-10 flex">
        <!-- dokumen -->
        <div id="kiri" class="rounded-xl border-2 mx-3 w-4/12">
          <div class="  flex flex-col">
            <h1 class="  text-center pb-1">Dokumen</h1>
            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">jenis dokumen :</h5>
              <select
                bind:value={jenis_dokumen}
                on:change={() => {
                  jenis = jenis_dokumen;
                  pull_docs();
                }}
                required
                class="inputB2 w-64 my-1 mr-2 px-2 rounded-lg"
                placeholder="opsional"
              >
                {#each jenis_dok_lis as dt_b}
                  <option value={dt_b}> {dt_b}</option>
                {/each}
              </select>
            </div>

            <!-- <div class=" items-center pl-5 flex flex-row w-full ">
              <h5 class="  mr-5 text-gray-600 ">nomor pengajuan:</h5>
              <input
                readonly
                bind:value={doc_change.nomor}
                type="text"
                class="inputB2 w-36 bg-gray-200 px-2 uppercase  rounded-lg "
                required
              />-
              <input
                bind:value={aju}
                type="text"
                class="inputB2   px-2 w-22 uppercase  rounded-lg "
                required
              />
            </div> -->

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">nomor daftar :</h5>
              <!-- <input
                bind:value={no_daftar}
                type="text"
                class="inputB2  w-22 px-2 uppercase  rounded-lg "
                required
              /> -->

              <select
                required
                bind:value={doc_change}
                on:change={() => {
                  no_daftar = doc_change.nomor;
                  tanggal_daftar = doc_change.tanggal;
                }}
                class="inputB2 w-28 my-1 mr-2 px-2 rounded-lg"
                placeholder="opsional"
              >
                {#each data_docs as dt_b}
                  {#if !dt_b.done}
                    <option value={dt_b}> {dt_b.nomor}</option>
                  {/if}
                {/each}
              </select>
            </div>
            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">tanggal daftar :</h5>

              <input
                required
                readonly
                bind:value={tanggal_daftar}
                class="inputB2 bg-slate-200"
                type="text"
              />
            </div>
          </div>

          <div class="  flex flex-col pt-1 mt-3 rounded-lg">
            <h1 class="  text-center pb-1 border-t-2">Bukti</h1>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">nomor-tgl bukti pemasukan :</h5>
              <input
                bind:value={no_sppb}
                type="text"
                class="inputB2 w-22 px-2 uppercase rounded-lg"
                required
              />
              <input
                required
                bind:value={tanggal_sppb}
                class="inputB2"
                type="date"
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">nomor-tgl invoice :</h5>
              <input
                bind:value={nomor_invoice}
                type="text"
                class="inputB2 w-22 px-2 uppercase rounded-lg"
                required
              />
              <input
                required
                bind:value={tanggal_invoice}
                class="inputB2"
                type="date"
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">suplier :</h5>
              <input
                readonly
                bind:value={suplier_change.nama_suplier}
                type="text"
                class="inputB2 w-36 bg-gray-200 px-2 uppercase rounded-lg"
                required
              />
            </div>
          </div>
        </div>
        <div id="tengah" class="  border-2 rounded-xl w-1/3">
          <div class="  flex flex-col">
            <h1 class="  text-center pb-1">Barang</h1>
            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">nomor po {po_change.id_po}:</h5>
              {#if id_pop !== ""}
                <input
                  readonly
                  bind:value={nomor_pop}
                  type="text"
                  class="inputB2 w-36 bg-gray-200 px-2 uppercase rounded-lg"
                  required
                />
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                  on:click={() => (id_pop = "")}
                  class=" ml-2 btn-secondary-small"
                >
                  pilih po lain
                </div>
              {:else}
                <select
                  required
                  bind:value={id_po}
                  on:change={() => {
                    pull_po();
                  }}
                  class="inputB2 w-64 my-1 mr-2 px-2 rounded-lg"
                  placeholder="opsional"
                >
                  {#each data_po_id as dt_b}
                    <option value={dt_b.id_po}> {dt_b.nomor_po}</option>
                  {/each}
                </select>
              {/if}
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">kode barang :</h5>
              <input
                readonly
                bind:value={kode_barang}
                type="text"
                class="inputB2 w-36 bg-gray-200 px-2 uppercase rounded-lg"
                required
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">nama barang :</h5>
              <input
                readonly
                bind:value={nama_barang}
                type="text"
                class="inputB2 w-36 bg-gray-200 px-2 uppercase rounded-lg"
                required
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">satuan :</h5>
              <input
                readonly
                bind:value={satuan}
                type="text"
                class="inputB2 w-36 bg-gray-200 px-2 uppercase rounded-lg"
                required
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">jumlah satuan :</h5>
              <input
                readonly
                value={Nf.format(jumlah)}
                type="text"
                class="inputB2 w-22 bg-gray-200 px-2 uppercase rounded-lg"
                required
              />
              {#if diajukan}
                <h1>penyesuaian diajukan</h1>
              {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                  on:click={() => {
                    ajukan();
                  }}
                  style="font-size: xx-small;"
                  class="btn-danger-small ml-3"
                >
                  ajukan penyesuaian
                </div>
              {/if}
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">harga satuan :</h5>
              <input
                readonly
                value={Nf.format(harga_satuan)}
                type="text"
                class="inputB2 w-36 bg-gray-200 px-2 uppercase rounded-lg"
                required
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">total harga :</h5>
              <input
                readonly
                value={Nf.format(total_harga)}
                type="text"
                class="inputB2 w-36 bg-gray-200 px-2 uppercase rounded-lg"
                required
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">lokasi :</h5>
              <input
                bind:value={lokasi}
                type="text"
                class="inputB2 w-22 px-2 uppercase rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        <div id="kanan" class=" mx-3 w-1/3">
          <div class="  flex flex-col border-2 rounded-xl pb-3">
            <h1 class="  text-center pb-1">Pembayaran</h1>
            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">valuta :</h5>
              <input
                readonly
                bind:value={vlauta}
                type="text"
                class="inputB2 w-36 bg-gray-200 px-2 uppercase rounded-lg"
                required
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">exchange rate :</h5>
              <input
                readonly
                value={Nf.format(exchane_rate)}
                type="text"
                class="inputB2 w-36 bg-gray-200 px-2 uppercase rounded-lg"
                required
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">total harga :</h5>
              <input
                readonly
                value={Nf.format(total_harga)}
                type="text"
                class="inputB2 w-36 bg-gray-200 px-2 uppercase rounded-lg"
                required
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">total harga invoice :</h5>
              <input
                step="0.01"
                required
                bind:value={total_harga_invoice}
                on:keyup={() => {
                  recount(total_harga_invoice);
                }}
                type="text"
                class="inputB2 w-36 px-2 uppercase rounded-lg"
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">discount :</h5>
              <input
                readonly
                bind:value={discount}
                type="text"
                class="inputB2 w-36 bg-gray-200 px-2 uppercase rounded-lg"
                required
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">nilai pabean :</h5>
              (IDR)
              <input
                readonly
                value={Nf.format(nilai_pabean)}
                type="text"
                class="inputB2 w-36 bg-gray-200 px-2 ml-2 uppercase rounded-lg"
                required
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">administrasi import :</h5>
              (IDR)
              <input
                readonly
                value={Nf.format(administrasi_import_idr)}
                type="text"
                class="inputB2 w-36 ml-2 bg-gray-200 px-2 uppercase rounded-lg"
                required
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">freight :</h5>
              <input
                on:keyup={() => {
                  grand_total_count();
                }}
                bind:value={freight}
                type="text"
                class="inputB2 w-36 px-2 uppercase rounded-lg"
                required
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">grand total :</h5>
              <input
                readonly
                value={Nf.format(grad_total)}
                type="text"
                class="inputB2 w-36 bg-gray-200 px-2 uppercase rounded-lg"
                required
              />
            </div>
          </div>
        </div>
      </div>
      <div class="pr-5 flex w-full justify-end">
        <button class="mt-5 btn-success" on:click={() => (submitted = true)}
          >Continue</button
        >
        <button id="reseter" type="reset" class=" ml-3 btn-secondary mt-5"
          >reset</button
        >
      </div>
    </form>

    <div class="w-full p-5 mt-5 flex flex-col items-center">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={() => {
          pull();
          table_is_open = !table_is_open;
        }}
        class=" cursor-default btn-primary-small w-50 text-center mb-5"
      >
        {#if table_is_open}
          tutup tabel pemasukan
        {:else}
          tampilkan tabel pemasukan
        {/if}
      </div>
      {#if table_is_open}
        <div class="flex mb-5">
          status :
          <div
            class=" mx-5 flex text-xxs font-semibold bg-gray-300 border border-indigo-400 rounded-full overflow-hidden"
          >
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              on:click={() => {
                switch_dijual(false);
              }}
              class:btn_belum_aktif
              class="  bg-slate-200 px-1 text-slate-500 cursor-default"
            >
              belum dijual
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              on:click={() => {
                switch_dijual(true);
              }}
              class:btn_acc_aktif
              class="  bg-slate-200 px-1 text-slate-500 cursor-default"
            >
              sudah dijual
            </div>
          </div>
        </div>

        <div class="w-full text-center justify-center">
          {#if hasError == true}
            <p class="error-alert">{errMessage}</p>
          {:else if isSuccessVisibleHapus}
            <p class="error-alert" transition:fade={{ duration: 150 }}>
              Data updated successfully
            </p>
          {/if}
        </div>

        <table class="border-2 table">
          <thead class="rounded-xl">
            <tr>
              <th class=" border-2 px-3">jenis dok</th>
              <th class=" border-2 px-3">no daftar</th>
              <!-- <th class=" border-2 px-3">no pengajuan</th> -->
              <th class=" border-2 px-3">tgl daftar</th>
              <th class=" border-2 px-3">no bukti pemasukan</th>
              <th class=" border-2 px-3">kode barang</th>
              <th class=" border-2 px-3">nama barang</th>
              <th class=" border-2 px-3">jumlah </th>
              <th class=" border-2 px-3">harga satuan</th>
              <th colspan="2" class=" border-2 px-3">aksi</th>
            </tr>
          </thead>
          <tbody>
            {#each data_transaksi_in_s_show as dt_i, i}
              <tr>
                <td>{dt_i.jenis}</td>
                <td>{dt_i.no_daftar}</td>
                <!-- <td>{dt_i.no_pengajuan}</td> -->
                <td>{dt_i.tanggal_daftar}</td>
                <td>{dt_i.no_sppb}</td>

                <td>{dt_i.kode_barang}</td>
                <td>{dt_i.nama_barang}</td>
                <td>{Nf.format(dt_i.jumlah)}</td>
                <td>{dt_i.harga_satuan}</td>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                {#if dt_i.acc}
                  <td>
                    <div
                      on:click={() => {
                        no_daftar_in = dt_i.no_daftar;
                        change_to_pengeluaran();
                      }}
                      class=" btn-success-small py-1 px-1"
                    >
                      pengeluaran
                    </div>
                  </td>
                  <td colspan="2" class=" justify-center">
                    <!-- svelte-ignore missing-declaration -->
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                      on:click={() => {
                        open_print(i);
                      }}
                      class=" text-xxs w-20 uppercase text-center font-bold bg-blue-400 text-white cursor-default rounded-full"
                    >
                      print
                    </div>
                    <!-- <div class=" btn-secondary-small">detail</div> -->
                  </td>
                {:else}
                  <td>
                    <div
                      on:click={() => {
                        no_daftar_in = dt_i.no_daftar;
                        hapus_tin();
                      }}
                      class="btn-danger-xxs px-2 mt-1"
                    >
                      hapus
                    </div>
                  </td>
                  <td />
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
        <div class=" h-64" />
      {/if}
    </div>
  </div>
</div>

<style>
  .submitted input:invalid {
    border: 1px solid rgb(255, 130, 13);
  }

  .submitted input:focus:invalid {
    outline: 1px solid rgb(255, 130, 13);
  }

  .btn_acc_aktif {
    @apply bg-indigo-400 text-white;
  }

  .btn_belum_aktif {
    @apply bg-indigo-400 text-white;
  }
</style>
