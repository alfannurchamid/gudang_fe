<script>
  // @ts-nocheck

  import TambahPo from "$lib/components/tambah_po.svelte";
  import { onMount } from "svelte";
  import { SetCookie } from "$lib/stores/cokies";
  import { fetchDown } from "$lib/stores/fetch_down";

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
  import { goto } from "$app/navigation";

  let mulai = "";
  let sampai = "";

  let bobo = JSON.stringify({
    yes: "oo",
  });

  const pull = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/laporan/create_laporan_mutasi",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          // Authorization: "Bearer " + accessKey,
        },
        body: bobo,
      }
    );

    if (response.ok) {
      const data1 = await response.json();
      data = data1.data.data;
      console.log(data1.data.data);
    }
  };
  let dokumen_is_resdy = false;
  let document_alert = "";
  let dokumen_tag = "menyiapkan dokumen";
  const generate_file = async () => {
    document_alert = "menunggu..";
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/laporan/generate_xlsx",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          // Authorization: "Bearer " + accessKey,
        },
        body: bobo,
      }
    );

    const btn_download = document.getElementById("download")?.classList;
    if (response.ok) {
      // alert("dokumen siap");
      btn_download?.remove("btn-secondary-small");
      btn_download?.add("btn-success-small");
      dokumen_tag = "download";
      dokumen_is_resdy = true;
      document_alert = "dokumen siap";
    }
  };

  const get_laporan = async () => {
    const file = "laporan.xlsx";
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/laporan/get_laporan"
    );
  };

  const cari = () => {
    bobo = JSON.stringify({
      mulai: mulai,
      ahir: sampai,
    });
    pull();
  };

  onMount(async () => {
    // pull();
  });

  currentPosisiBase(0);
  currentPosisi(1);
  const tambahBarang = () => {
    const seting = document.getElementById("pop_tambah_barang")?.classList;

    let clickUser = false;

    clickUser = !clickUser;
    if (clickUser) {
      seting?.remove("translate-y-full", "backdrop-blur-none", "bg-opacity-0");
      seting?.add("backdrop-blur-xl", "bg-opacity-5", "backdrop-brightness-75");
    } else {
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
    }
  };

  let id_pop = "";
  let nomor_pop = "";
  const expired_at = 3000000;

  const change_po = () => {
    SetCookie("id_po", id_pop, expired_at);
    SetCookie("nomor_po", nomor_pop, expired_at);
    goto("transaksi_in");
  };
</script>

<div class="   h-screen p-16 pr-5">
  <div class="   h-full">
    <h1 class="  text-center text-lg font-semibold text-gray-600">
      LAPORAN PERTANGGUNGJAWABAN MUTASI BARANG
    </h1>
    <div class=" w-full flex justify-center my-2 h-10">
      <form on:submit|preventDefault={cari}>
        <input type="date" class=" inputB1" bind:value={mulai} />
        <input type="date" class=" inputB1" bind:value={sampai} />
        <button type="submit" class="btn-primary-small w-12 uppercase"
          >cari</button
        >
      </form>
    </div>

    <div class=" flex justify-end mr-52 my-3">
      <h1>{document_alert}</h1>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        id="download"
        on:click={() => {
          if (!dokumen_is_resdy) {
            generate_file();
          } else {
            fetchDown(
              "http://127.0.0.1:8000/api/api/v1/laporan/get_laporan?file=fhgdfhs.xlxs",
              "laporan" + mulai + "-" + sampai + ".xlsx"
            );
          }
        }}
        class="btn-secondary-small px-2"
      >
        {#if dokumen_is_resdy}
          DOWNLOAD
        {:else}
          {dokumen_tag}
        {/if}
      </div>
    </div>

    <div class=" ml-10 px-10 flex justify-center">
      <div class=" bg-gray-200 rounded-xl">
        <div>
          <table
            class=" text-xxs w-full table rounded-xl border-gray-200 border"
          >
            <thead class="">
              <tr class=" p-2 border-x-2 border-b-2 border-gray-50">
                <th class=" ">NO</th>
                <th class=" border-x-2 px-2 border-gray-50">KODE BARANG</th>
                <th class=" border-x-2 px-2 border-gray-50">NAMA BARANG</th>
                <th class=" border-x-2 px-2 border-gray-50">SAT</th>
                <th class=" border-x-2 px-2 border-gray-50">SALDO AWAL</th>
                <th class=" border-x-2 px-2 border-gray-50">PEMASUKAN</th>

                <th class=" border-x-2 px-2 border-gray-50"
                  >PENGELUARAN <br />PENJUALAN</th
                >
                <th class=" border-x-2 px-2 border-gray-50"
                  >PENYESUAIAN <br />(ADJUSTMENT)</th
                >
                <th class=" border-x-2 px-2 border-gray-50">SALDO AKHIR</th>
                <th class=" border-x-2 px-2 border-gray-50">STOK OPNAME</th>
                <th class=" border-x-2 px-2 border-gray-50">SELISIH</th>
                <th class=" w-44 border-x-2 px-2 border-gray-50">KET</th>
              </tr>
            </thead>
            <tbody>
              {#each data as dt, i}
                <tr class="p-2">
                  <td>{i + 1}</td>
                  <td class=" p-3 border-t-2 border-gray-50"
                    >{dt.kode_barang}</td
                  >

                  <td class=" p-3 border-t-2 border-gray-50"
                    >{dt.nama_barang}</td
                  >
                  <td class=" p-3 border-t-2 border-gray-50">{dt.satuan}</td>

                  <td class=" p-3 border-t-2 border-gray-50">{dt.saldo_awal}</td
                  >
                  <td class=" p-3 border-t-2 border-gray-50">{dt.pemasukan}</td>
                  <td class=" p-3 border-t-2 border-gray-50"
                    >{dt.pengeluaran}</td
                  >
                  <td class=" p-3 border-t-2 border-gray-50"
                    >{dt.penyesuaian}</td
                  >
                  <td class=" p-3 border-t-2 border-gray-50">{dt.saldo_ahir}</td
                  >

                  <td class=" p-3 border-t-2 border-gray-50"
                    >{dt.stok_opname}</td
                  >
                  <td class=" p-3 border-t-2 border-gray-50">{dt.selisih}</td>
                  <td class=" p-3 border-t-2 border-gray-50">{dt.ket}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
