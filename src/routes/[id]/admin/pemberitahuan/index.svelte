<script>
  // @ts-nocheck
  import { get_laba_berjalan } from "$lib/stores/update_laba_berjalan";

  import { fly, fade } from "svelte/transition";
  import { generate_waktu } from "$lib/stores/waktu_generator";

  import { generate_waktu_str } from "$lib/stores/waktu_generator_str";
  import { get_laba_penj_ini } from "$lib/stores/get_laba_penjualan_ini";
  import { get_id_akun_barang } from "$lib/stores/get_id_akun_barang";

  import {
    posisi,
    currentPosisiBase,
    posisiBase,
    currentPosisi,
  } from "$lib/stores/posisiAndmin";
  import { onMount } from "svelte";

  import Checklist from "$lib/static/checklist.svelte";

  import { cek_token } from "$lib/stores/cek_token";
  import { GetCookie, SetCookie } from "$lib/stores/cokies";
  import { Nf } from "$lib/stores/formatNumber";
  let accessKey = "";
  let refreshKey = "";
  let acc_available = true;
  onMount(async () => {
    await cek_token();
    accessKey = GetCookie("accesskey");
    refreshKey = GetCookie("refreshkey");
  });

  let no_daftar = "";
  let id_pengajuan = "";

  let hasError = false;
  let isSuccessVisible = false;
  let submitted = false;
  let id_user = "";
  let jumlah = 0;
  let is_pengajuan = false;
  let jenis = true;
  const errMessage = "maaf terjadi kesalahan";

  /**
   * @type {{ jenis: any; ppn_v:number; no_daftar: any;nama_suplier:number, tanggal_daftar: any; no_sppb: any; tanggal_sppb: any; nomor_invoice: any; tanggal_invoice: any; no_po: any; kode_barang: any; nama_barang: any; satuan: any; jumlah: number; harga_satuan: number;  lokasi: any; vlauta: any; exchange_rate: any; total_harga_invoice: any; discount: any; freight: any; grand_total: any; }}
   */
  let data_dokumen;
  const days = ["Minggu", "Senin", "Selesa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  currentPosisiBase(0);
  currentPosisi(1);

  /**
   * @type {any[]}
   */
  let data = [];

  const pull = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/auth/pemberitahuan"
    );
    if (response.ok) {
      const data_res = await response.json();
      data = data_res.data.data;
    }
  };

  onMount(() => {
    pull();

    const a = GetCookie("id_user");
    if (a !== null) {
      id_user = a;
    }
  });
  let ispop = false;
  let index_data = 0;
  const tinjau = (/** @type {number | undefined} */ a) => {
    acc_available = true;
    if (a) {
      index_data = a;
    }
    ispop = !ispop;
    if (ispop) {
      pull_dokumen();
    }
    const pop = document.getElementById("pop_tinjau")?.classList;
    if (ispop) {
      pop?.remove("translate-y-full");
    } else {
      pop?.add("translate-y-full");
    }
  };

  const pull_dokumen = async () => {
    let sql =
      "http://127.0.0.1:8000/api/api/v1/transaksi_out/get_transaksi_out";
    if (jenis) {
      sql = "http://127.0.0.1:8000/api/api/v1/transaksi_in/get_transaksi_in";
    }
    const response = await fetch(sql, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        no_daftar,
      }),
    });

    if (response.ok) {
      let data = await response.json();
      data_dokumen = data.data;
    }
  };

  const done_penyesuaian = async () => {
    await cek_token();
    accessKey = GetCookie("accesskey");

    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/penyesuaian/edit_penyesuaian",
      {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessKey,
        },
        body: JSON.stringify({
          id_pengajuan,
        }),
      }
    );
  };

  const coba = async () => {
    const id_beban = await get_id_akun_barang(data_dokumen.kode_barang, "p");
    console.log(id_beban);
  };
  const post_jurnal = async () => {
    const today = new Date();
    let current_laba = await get_laba_berjalan();
    const tanggal = generate_waktu_str(today);
    // const a = {
    //   catatan: "",
    //   debet: 0,
    //   kredit: current_laba,
    //   id_akun: "3.5",
    //   saldo: 0,
    //   type: "0",
    // };
    console.log("laba _ jalann belum -", current_laba);

    if (jenis) {
      current_laba -= data_dokumen.administrasi_import;
      console.log("laba _ jalann ", current_laba);
    } else {
      // curent_laba += laba sekarang
      const id_perse = await get_id_akun_barang(data_dokumen.kode_barang, "p");
      const hpp = await get_laba_penj_ini(id_perse, data_dokumen.no_daftar);
      let laba_ini = data_dokumen.grand_total - hpp;
      current_laba += laba_ini;
    }

    // data = [a];
    // const keterangan = "dari pencatatan penjualan barang no: " + no_daftar;
    let data_str =
      '{"keterangan":"dari pencatatan penjualan barang no: ' +
      no_daftar +
      ' ","list_akun":[{"id_akun":"3.5","nama_akun":"Laba Tahun Berjalan","debet":0,"kredit":' +
      current_laba +
      ',"catatan":"","saldo":0,"type":"0"}],"tanggal":"' +
      tanggal +
      '"}';

    const response2 = await fetch(
      "http://127.0.0.1:8000/api/api/v1/akuntansi/add_jurnal_umum",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessKey,
        },
        body: data_str,
      }
    );
  };

  const done_dokumen = async () => {
    acc_available = false;

    await cek_token();
    accessKey = GetCookie("accesskey");

    let url = "http://127.0.0.1:8000/api/api/v1/transaksi_in/edit_transaksi_in";

    if (!jenis) {
      url =
        "http://127.0.0.1:8000/api/api/v1/transaksi_out/edit_transaksi_out_acc";
    }

    if (confirm("apakah and ayakin untuk ACC dokumen ini ?")) {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessKey,
        },
        body: JSON.stringify({
          no_daftar,
        }),
      });

      if (response.ok) {
        await post_jurnal();

        data[index_data].done = true;
        acc_available = false;
        const id_targetdata = data[index_data].no_daftar;
        data = data.filter((items) => items.no_daftar !== id_targetdata);

        if (confirm("klik OK untuk mencetak")) {
          const data_str = JSON.stringify(data_dokumen);
          SetCookie("data_dokumen", data_str, 1 * 60 * 60000);
          open_print();
        }
      }
    }
  };

  const upload_rijek = async () => {
    let kode_barang = data_dokumen.kode_barang;
    const no_daftar = data_dokumen.no_daftar;
    const type = true;

    let bobo = JSON.stringify({
      kode_barang,
      jumlah,
      no_daftar,
      id_user,
      type,
    });

    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/rijek/create_rijek",
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          // Authorization: "Bearer " + accessKey,
        },
        body: bobo,
      }
    );

    if (response.ok) {
      submitted = true;
      isSuccessVisible = true;
      data[index_data].done = true;
      await done_penyesuaian();
      setTimeout(function () {
        isSuccessVisible = false;
      }, 4000);
    } else {
      hasError = true;
    }
  };

  const upload_penyesuaian = async () => {
    if (confirm("pastikan jumlah penyesuaian sudah benar ")) {
      upload_rijek();
    }
  };

  const open_print = () => {
    window.open("/print");
  };
</script>

<div class=" text-xs w-full h-screen p-12">
  <div class=" pl-10 w-full h-full">
    <h1 class=" text-center text-lg font-semibold text-gray-600">
      Pemberitahuan
    </h1>
    <div class="w-full flex-col flex items-center p-10">
      {#each data as dt, i}
        <div class="w-1/2 mt-5 h-28 p-3 rounded-lg bg-slate-200">
          <div class="flex justify-between mb-3">
            <div>
              {#if dt.jenis}
                {#if dt.type == "penyesuaian"}
                  <h1 class="text-lg">
                    pengajuan ACC dan penyesuaian pemasukan
                  </h1>
                {:else}
                  <h1 class="text-lg">pengajuan ACC pemasukan</h1>
                {/if}
              {:else}
                <div />
                {#if dt.type == "penyesuaian"}
                  <h1 class="text-lg">pengajuan penyesuaian pengeluaran</h1>
                {:else}
                  <h1 class="text-lg">pengajuan ACC pengeluaran</h1>
                {/if}
              {/if}
            </div>
            <h5 class="mt-2">
              {generate_waktu(dt.tanggal)}
            </h5>
          </div>
          <div>oleh : {dt.pengaju}</div>
          <div class="flex justify-between">
            <h4>jenis dokumen : {dt.jenis_dokumen}</h4>
            <h4>no daftar : {dt.no_daftar}</h4>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            {#if !dt.done}
              <div
                on:click={() => {
                  if (dt.type == "penyesuaian") {
                    is_pengajuan = true;
                  } else {
                    is_pengajuan = false;
                  }

                  if (dt.jenis) {
                    jenis = true;
                  } else {
                    jenis = false;
                  }
                  no_daftar = dt.no_daftar;
                  id_pengajuan = dt.id_pengajuan;
                  tinjau(i);
                }}
                class=" btn-success-small px-3"
              >
                tinjau
              </div>
            {:else}
              <div class="flex">
                <h1 id="" class="text-green-500">sudah</h1>

                <div class=" ml-2 w-3 h-3">
                  <Checklist />
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<div
  id="pop_tinjau"
  class=" z-0 fixed w-full h-5/6 flex-col translate-y-full bottom-0 backdrop-brightness-90 shadow-lg bg-opacity-50 backdrop-blur-xl rounded-t-xl p-10 pt-3 transition-all duration-300"
>
  <div class=" grid grid-cols-3">
    <div>.</div>
    <h1 class=" text-center mb-5">
      pengajuan penyesuaian {#if jenis}
        pemasukan{:else}pengeluaran
      {/if}
    </h1>
    <div class=" flex items-center justify-end w-full">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={() => {
          tinjau();
        }}
        class="btn-close"
      >
        X
      </div>
    </div>
  </div>
  <div class="w-full justify-center flex">
    {#if data_dokumen}
      <div class="w-10/12 text-xs justify-items-center grid grid-cols-3 gap-5">
        <div class=" w-full border-2 border-white rounded-lg">
          <h1 class="text-center my-1 mb-2 font-semibold">dokumen</h1>
          <div class="flex px-3 my-1">
            <h1 class=" w-32">jenis dokumen :</h1>
            <h1>{data_dokumen.jenis}</h1>
          </div>
          <div class="flex px-3 my-1">
            <h1 class=" w-32">nomor daftar :</h1>
            <h1>{data_dokumen.no_daftar}</h1>
          </div>
          <div class="flex px-3 my-1">
            <h1 class=" w-32">tanggal daftar :</h1>
            <h1>{data_dokumen.tanggal_daftar}</h1>
          </div>
          <div class="w-full border-t-2 my-3 border-slate-50" />
          <h1 class="text-center mb-2 font-semibold">bukti</h1>
          <div class="flex px-3 my-1">
            <h1 class=" w-32">nomor bukti :</h1>
            <h1>{data_dokumen.no_sppb}</h1>
          </div>
          <div class="flex px-3 my-1">
            <h1 class=" w-32">tanggal bukti :</h1>
            <h1>{data_dokumen.tanggal_sppb}</h1>
          </div>
          <div class="flex px-3 my-1">
            <h1 class=" w-32">nomor invoice :</h1>
            <h1>{data_dokumen.nomor_invoice}</h1>
          </div>

          <div class="flex px-3 my-1">
            <h1 class=" w-32">tanggal invoice :</h1>
            <h1>{data_dokumen.tanggal_invoice}</h1>
          </div>

          <div class="flex px-3 my-1">
            {#if data_dokumen.nama_suplier}
              <h1 class=" w-32">suplier :</h1>
              <h1>{data_dokumen.nama_suplier}</h1>
            {:else}
              <h1 class=" w-32">customer :</h1>
              <h1>{data_dokumen.nama_customer}</h1>
            {/if}
          </div>
        </div>
        <div class=" border-2 w-full border-white rounded-lg">
          <div class="w-full text-center justify-center">
            {#if hasError == true}
              <p class="error-alert">{errMessage}</p>
            {:else if isSuccessVisible}
              <p class="error-alert" transition:fade={{ duration: 150 }}>
                Data updated successfully
              </p>
            {/if}
          </div>
          <h1 class="text-center mb-2 my-1 font-semibold">barang</h1>
          <div class="flex px-3 my-1">
            {#if data_dokumen.no_po}
              <h1 class=" w-32">nomor po :</h1>
              <h1>{data_dokumen.no_po}</h1>
            {:else}
              <h1 class=" mr-4">nomor daftar dokumen pemasukan :</h1>
              <h1>{data_dokumen.nomor_daftar_in}</h1>
            {/if}
          </div>
          <div class="flex px-3 my-1">
            <h1 class=" w-32">kode barang :</h1>
            <h1>{data_dokumen.kode_barang}</h1>
          </div>
          <div class="flex px-3 my-1">
            <h1 class=" w-32">nama barang :</h1>
            <h1>{data_dokumen.nama_barang}</h1>
          </div>

          <div class="flex px-3 my-1">
            <h1 class=" w-32">satuan :</h1>
            <h1>{data_dokumen.satuan}</h1>
          </div>
          <div class="flex px-3 my-1">
            <h1 class=" w-32">jumlah satuan :</h1>
            <h1>{data_dokumen.jumlah}</h1>
          </div>
          {#if is_pengajuan}
            <div class="flex items-center px-3 my-1">
              <h1 class=" mr-5">penyesuaian jumlah :</h1>
              <input
                type="text"
                class=" w-22 inputB2 mr-1"
                bind:value={jumlah}
              />
              {#if submitted}
                <h1 class="text-green-500">penyesuaian sukses</h1>
              {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                  on:click={() => {
                    upload_penyesuaian();
                  }}
                  class="btn-danger-small text-xxs h-5"
                >
                  sesuaikan
                </div>
              {/if}
            </div>
          {/if}

          <div class="flex px-3 my-1">
            <h1 class=" w-32">harga satuan :</h1>
            <h1>{data_dokumen.harga_satuan}</h1>
          </div>

          <div class="flex px-3 my-1">
            <h1 class=" w-32">total harga :</h1>
            <h1>
              {Nf.format(
                (data_dokumen.jumlah * data_dokumen.harga_satuan).toFixed(2)
              )}
            </h1>
          </div>

          <div class="flex px-3 my-1">
            <h1 class=" w-32">lokasi :</h1>
            <h1>{data_dokumen.lokasi}</h1>
          </div>
        </div>
        <div class=" rounded-lg border-2 border-slate-50 w-full">
          <h1 class="text-center mb-2 my-1 font-semibold">pembayaran</h1>
          <div class="flex px-3 my-1">
            <h1 class=" w-32">valuta :</h1>
            <h1>{data_dokumen.vlauta}</h1>
          </div>
          <div class="flex px-3 my-1">
            <h1 class=" w-32">exchange rate :</h1>
            <h1>{data_dokumen.exchange_rate}</h1>
          </div>
          <div class="flex px-3 my-1">
            <h1 class=" w-32">total harga :</h1>
            <h1>
              {Nf.format(
                (data_dokumen.jumlah * data_dokumen.harga_satuan).toFixed(2)
              )}
            </h1>
          </div>

          <div class="flex px-3 my-1">
            <h1 class=" w-32">total harga invoice :</h1>
            <h1>{Nf.format(data_dokumen.total_harga_invoice)}</h1>
          </div>

          <div class="flex px-3 my-1">
            <h1 class=" w-32">discount :</h1>
            <h1>{data_dokumen.discount}</h1>
          </div>
          {#if jenis}
            <div class="flex px-3 my-1">
              <h1 class=" w-32">freight :</h1>
              <h1>{data_dokumen.freight}</h1>
            </div>

            <div class="flex px-3 my-1">
              <h1 class=" w-32">administrasi import :</h1>
              <h1>{Nf.format(data_dokumen.administrasi_import)}</h1>
            </div>
          {:else}
            <div class="flex px-3 my-1">
              <h1 class=" w-32">ppn :</h1>
              <h1>{Nf.format(data_dokumen.ppn_v)}</h1>
            </div>
          {/if}

          <div class="flex px-3 my-1">
            <h1 class=" w-32">grand total :</h1>
            <h1>{Nf.format(data_dokumen.grand_total)}</h1>
          </div>
        </div>
      </div>
    {/if}
  </div>
  <div class="w-full flex px-28 py-5 justify-end">
    <div class="btn-secondary">batal</div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={() => {
        coba();
      }}
      class="btn-secondary"
    >
      coba
    </div>

    {#if acc_available}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={() => {
          done_dokumen();
        }}
        class="btn-success mx-3 shadow-sm shadow-black"
      >
        acc
      </div>
    {/if}
  </div>
</div>
