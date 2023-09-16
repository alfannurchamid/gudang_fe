<script>
  // @ts-nocheck
  import { Nf } from "$lib/stores/formatNumber";

  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { SetCookie, GetCookie, DelCookie } from "$lib/stores/cokies";

  import { cek_token } from "$lib/stores/cek_token";

  let accessKey = "";
  let refreshKey = "";

  onMount(async () => {
    pull_dok_out();
    await cek_token();
    accessKey = GetCookie("accesskey");
    refreshKey = GetCookie("refreshkey");
  });

  import {
    posisi,
    currentPosisiBase,
    posisiBase,
    currentPosisi,
  } from "$lib/stores/posisiAndmin";

  let hasError = false;
  let isSuccessVisible = false;
  let submitted = false;

  let no_daftar = "";
  let no_pengajuan = "";
  let tanggal_daftar = "";
  let id_customer = 0;
  let kode_barang = "";
  let jumlah = 0;
  /**
   * @type {number}
   */
  let harga_satuan;
  let saldo_jml = 0;
  let no_sppb = "";
  let tanggal_sppb = "";
  let nomor_invoice = "";
  let tanggal_invoice = "";
  let vlauta = "";
  let exchane_rate = 0;
  let total_harga_invoice = 0;
  let discount = 0;
  let ppn = 0;
  let tanggal_jatuh_tempo = "";
  let grand_total = 0;
  let jenis = "";

  let aju = "";

  let nama_barang = "";
  let satuan = "";

  let total_harga = 0;
  let lokasi = "";

  let saran_harga = 0;

  /**
   * @type {any[]}
   */

  let table_is_open = false;

  /**
   * @type {any[]}
   */
  let data_docs = [];
  /**
   * @type {any[]}
   */
  let data_po_id = [];
  let doc_change = {
    id_doc: "",
    nomor: "",
    tanggal: "",
  };
  let jenis_dok_lis = ["BC.25", "BC.27"];
  let jenis_dokumen = "";

  /**
   * @type {any[]}
   */
  let data_doc_in = [];
  let nomor_daftar_in = "";
  let doc_in_change = {
    no_daftar: "",
    nama_barang: "",
  };
  /**
   * @type {any[]}
   */
  let data_customer = [];
  let customer_change = {
    id_customer: "",
    nama_customer: "",
    asal_negara: "",
  };

  let data_transaksi_out_s_show = [];
  let data_transaksi_out_s_belum = [];
  let data_transaksi_out_s_acc = [];

  const pull_dok_out = async () => {
    let typene = "false";
    if (btn_acc_aktif) {
      typene = "true";
    }
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/transaksi_out/get_transaksi_out_s?type=" +
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
        data_transaksi_out_s_belum = data1.data.data;
        data_transaksi_out_s_show = data_transaksi_out_s_belum;
      } else {
        data_transaksi_out_s_acc = data1.data.data;
        data_transaksi_out_s_show = data_transaksi_out_s_acc;
      }
    }
  };

  const total_count = () => {
    total_harga = jumlah * harga_satuan;
    ppn_count();
  };

  const pull_customer = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/customer/get_customers",
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
      data_customer = data1.data.data;
    }
  };

  const pull_docs = async () => {
    let jenis = false;
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

  const pull_doc_in_id = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/transaksi_in/get_transaksi_ins_id",
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
      data_doc_in = data1.data.data;
    }
  };

  const pull_doc_in = async () => {
    const no_daftar = nomor_daftar_in;
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/transaksi_in/get_transaksi_in",
      {
        method: "POST",
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
      const data1 = await response.json();
      const data_po = data1.data;

      kode_barang = data_po.kode_barang;
      nama_barang = data_po.nama_barang;
      satuan = data_po.satuan;
      jumlah = data_po.jumlah;
      lokasi = data_po.lokasi;

      saran_harga =
        (Number(data_po.grand_total) / Number(jumlah)) *
          Number(data_po.exchange_rate) +
        Number(data_po.administrasi_import) / Number(jumlah);

      vlauta = "IDR";
      exchane_rate = 1;

      jenis = doc_change.id_doc;
    }
  };

  const grand_total_count = () => {
    grand_total = Number(total_harga_invoice);
  };

  const push_data = async () => {
    saldo_jml = jumlah;
    harga_satuan = Number(harga_satuan);
    discount = Number(discount);
    id_customer = Number(customer_change.id_customer);
    no_pengajuan = doc_change.nomor + "-" + aju;
    const data_post = {
      no_daftar,
      no_pengajuan,
      tanggal_daftar,
      id_customer,
      kode_barang,
      nama_barang,
      jumlah,
      harga_satuan,
      saldo_jml,
      no_sppb,
      tanggal_sppb,
      nomor_invoice,
      tanggal_invoice,
      vlauta,
      exchane_rate,
      total_harga_invoice,
      discount,
      ppn,
      grand_total,
      jenis,
      nomor_daftar_in,
      lokasi,
    };
    console.log(data_post);

    const bobo = JSON.stringify(data_post);

    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/transaksi_out/create_transaksi_out",
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

      data_transaksi_out_s_belum.unshift(data_post);
      data_transaksi_out_s_show = data_transaksi_out_s_belum;
      reset_form();
      setTimeout(function () {
        isSuccessVisible = false;
      }, 4000);
    } else {
      hasError = true;
    }
  };

  const errMessage = "maaf terjadi kesalahan";

  function reset_form() {
    document.getElementById("reseter")?.click();
  }

  let ppn_chacked = false;
  let total = 0;
  let ppn_count = () => {
    if (total_harga_invoice == "") {
      total = total_harga;
    } else {
      total = total_harga_invoice;
    }

    let b = total - (discount / 100) * total;
    let a = (b * 100) / 111;
    a = a * (11 / 100);

    if (ppn_chacked) {
      ppn = Math.ceil(a);
    } else {
      ppn = 0;
    }

    grand_total = Math.ceil(b + ppn);
  };

  let id_doc_in_f_co = "";
  onMount(async () => {
    pull_dok_out();
    pull_doc_in_id();
    pull_customer();

    let get_id_doc_in = GetCookie("id_doc_in");
    if (get_id_doc_in && get_id_doc_in !== null) {
      id_doc_in_f_co = get_id_doc_in;
      nomor_daftar_in = get_id_doc_in;
      pull_doc_in();
    }
  });

  currentPosisiBase(0);
  currentPosisi(1);

  let diajukan = false;
  let no_daftar_change = "";
  let index_data_change = 0;

  const upload_pengajuan = async () => {
    cek_token();
    const no_daftar = no_daftar_change;
    const id_user = GetCookie("id_user");
    const i = index_data_change;

    let jenis = false;
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
        data_transaksi_out_s_show[i].ajukan_penyesuaian = true;

        post_ajukan_true();
      }
    }
  };

  const post_ajukan_true = async () => {
    const no_daftar = no_daftar_change;
    const responsse = await fetch(
      "http://127.0.0.1:8000/api/api/v1/transaksi_out/edit_transaksi_out",
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          no_daftar,
        }),
      }
    );
    if (responsse.ok) {
      data_transaksi_out_s_acc = data_transaksi_out_s;
      data_transaksi_out_s_show = data_transaksi_out_s_acc;
    }
  };

  const open_print = (i) => {
    const data_str = JSON.stringify(data_transaksi_out_s_show[i]);
    // alert(data_str);
    SetCookie("data_dokumen", data_str, 1 * 60 * 60000);
    window.open("/print");
  };

  let isSuccessVisibleHapus = false;
  const hapus_tout = async () => {
    const no_daftar = no_daftar_change;
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/transaksi_out/delete_transaksi_out",
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
      data_transaksi_out_s_belum = data_transaksi_out_s_belum.filter(
        (item) => item.no_daftar != no_daftar
      );
      data_transaksi_out_s_show = data_transaksi_out_s_belum;

      pull_doc_in_id();
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

  let btn_belum_aktif = true;
  let btn_acc_aktif = false;

  let sudah_dijual = false;
  const switch_dijual = (x) => {
    sudah_dijual = x;
    btn_belum_aktif = !x;
    btn_acc_aktif = x;

    if (x) {
      if (data_transaksi_out_s_acc.length == 0) {
        pull_dok_out();
      } else {
        data_transaksi_out_s_show = data_transaksi_out_s_acc;
      }
    } else {
      data_transaksi_out_s_show = data_transaksi_out_s_belum;
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
        Form Pencatatan Pengeluaran Barang {id_doc_in_f_co}
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
        <div id="kiri" class="rounded-xl border-2 mx-3 w-4/12">
          <h1 class=" text-center">dokumen</h1>
          <div class="  flex flex-col">
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
              <h5 class="  mr-5 text-gray-600">
                nomor-tgl bukti pengeluaran :
              </h5>
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
              <h5 class="  mr-5 text-gray-600">customer :</h5>
              <select
                required
                bind:value={customer_change}
                class="inputB2 w-64 my-1 mr-2 px-2 rounded-lg"
                placeholder="opsional"
              >
                {#each data_customer as dt_b}
                  <option value={dt_b}> {dt_b.nama_customer}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>
        <div id="tengah" class="  border-2 rounded-xl w-1/3">
          <div class="  flex flex-col">
            <h1 class="  text-center pb-1">
              Barang {doc_in_change.no_daftar}
            </h1>
            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">dokumen pemasukan:</h5>
              <select
                required
                bind:value={nomor_daftar_in}
                on:change={() => {
                  pull_doc_in();
                }}
                class="inputB2 w-64 my-1 mr-2 px-2 rounded-lg"
                placeholder="opsional"
              >
                {#each data_doc_in as dt_b}
                  <option value={dt_b.no_daftar}>
                    {dt_b.no_daftar} - {dt_b.nama_barang}</option
                  >
                {/each}
              </select>
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
                class="inputB2 w-36 bg-gray-200 px-2 uppercase rounded-lg"
                required
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">harga satuan :</h5>
              <input
                on:keyup={() => {
                  total_count();
                }}
                bind:value={harga_satuan}
                type="text"
                placeholder=" harga beli {Nf.format(saran_harga)} "
                class="inputB2 w-36 px-2 rounded-lg"
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
                readonly
                bind:value={lokasi}
                type="text"
                class="inputB2 w-36 bg-gray-200 px-2 uppercase rounded-lg"
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
                bind:value={exchane_rate}
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
                on:keyup={() => {
                  ppn_count();
                }}
                bind:value={total_harga_invoice}
                type="text"
                class="inputB2 w-36 px-2 uppercase rounded-lg"
                required
              />
            </div>

            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">discount :</h5>
              <input
                on:keyup={() => {
                  ppn_count();
                }}
                bind:value={discount}
                type="text"
                class="inputB2 w-36 px-2 uppercase rounded-lg"
                required
              />
            </div>
            <div class=" flex flex-row pl-5 w-full items-center justify-start">
              <h5 class=" py-1 mr-3 text-gray-600">ppn :</h5>
              <input
                on:click={() => {
                  ppn_chacked = !ppn_chacked;
                  ppn_count();
                }}
                class="mr-3 w-5 h-5"
                type="checkbox"
              />
              <input
                readonly
                value={Nf.format(ppn)}
                type="text"
                class="inputB2 my-1 bg-slate-200 px-2 rounded-lg"
                placeholder="opsional"
              />
            </div>
            <div class=" items-center pl-5 flex flex-row w-full">
              <h5 class="  mr-5 text-gray-600">grand total :</h5>
              <input
                readonly
                value={Nf.format(grand_total)}
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
          table_is_open = !table_is_open;
        }}
        class=" cursor-default btn-primary-small w-50 text-center mb-5"
      >
        {#if table_is_open}
          tutup tabel pengeluaran
        {:else}
          tampilkan tabel pengeluaran
        {/if}
      </div>
      {#if table_is_open}
        <!-- message -->
        <div class="w-full text-center justify-center">
          {#if hasError == true}
            <p class="error-alert">{errMessage}</p>
          {:else if isSuccessVisibleHapus}
            <p class="error-alert" transition:fade={{ duration: 150 }}>
              Data updated successfully
            </p>
          {/if}
        </div>
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
              belum acc
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              on:click={() => {
                switch_dijual(true);
              }}
              class:btn_acc_aktif
              class="  bg-slate-200 px-1 text-slate-500 cursor-default"
            >
              sudah acc
            </div>
          </div>
        </div>

        <table class="border-2 table">
          <thead class="rounded-xl">
            <tr>
              <th class=" border-2 px-3">jenis dok</th>
              <th class=" border-2 px-3">no daftar</th>
              <!-- <th class=" border-2 px-3">no pengajuan</th> -->
              <th class=" border-2 px-3">tgl daftar</th>
              <th class=" border-2 px-3">no bukti pengeluaran</th>
              <th class=" border-2 px-3">kode barang</th>
              <th class=" border-2 px-3">nama barang</th>
              <th class=" border-2 px-3">jumlah </th>
              <th class=" border-2 px-3">harga satuan</th>
              <th colspan="2" class=" border-2 px-3">aksi</th>
            </tr>
          </thead>
          <tbody>
            {#each data_transaksi_out_s_show as dt_i, i}
              <tr>
                <td>{dt_i.jenis}</td>
                <td>{dt_i.no_daftar}</td>
                <!-- <td>{dt_i.no_pengajuan}</td> -->
                <td>{dt_i.tanggal_daftar}</td>
                <td>{dt_i.no_sppb}</td>

                <td>{dt_i.kode_barang}</td>
                <td>{dt_i.nama_barang}</td>
                <td>{Nf.format(dt_i.jumlah)}</td>
                <td>{Nf.format(dt_i.harga_satuan)} </td>
                {#if dt_i.acc}
                  {#if !dt_i.ajukan_penyesuaian}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <td class="flex"
                      ><div
                        on:click={() => {
                          no_daftar_change = dt_i.no_daftar;
                          index_data_change = i;
                          upload_pengajuan();
                        }}
                        class=" btn-success-small px-1"
                      >
                        penyesuaian
                      </div>

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
                    </td>
                  {:else}
                    <h1 class="text-green-500">pengajuan sukses</h1>
                  {/if}
                {:else}
                  <td>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                      on:click={() => {
                        no_daftar_change = dt_i.no_daftar;
                        hapus_tout();
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
