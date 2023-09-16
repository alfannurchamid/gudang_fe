<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { SetCookie, GetCookie } from "$lib/stores/cokies";
  import { user, updateUser, lengkap } from "$lib/stores/userLogin";
  import Logo from "$lib/static/Logo.svg";
  import { Nf } from "$lib/stores/formatNumber";

  import { generate_waktu } from "$lib/stores/waktu_generator";
  import { cek_token } from "$lib/stores/cek_token";

  let data_dokumen = {};
  let jenis = false;

  const today = Date();

  let nama_vendor = "";
  let is_in = false;
  let no_doc_or_po = "";
  let accessKey = "";

  onMount(async () => {
    accessKey = GetCookie("accesskey");
    const data_dokumen_get = GetCookie("data_dokumen");
    if (data_dokumen_get !== null) {
      data_dokumen = await JSON.parse(data_dokumen_get);
      cek_token();
      if (data_dokumen_get.includes("id_po")) {
        // alert("ada");
        jenis = true;
        const id_po = data_dokumen.id_po;
        const data_po = await fetch(
          "http://127.0.0.1:8000/api/api/v1/purchase_order/get_po",
          {
            method: "POST",
            headers: {
              accept: "*/*",
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessKey,
            },
            body: JSON.stringify({
              id_po,
            }),
          }
        );
        if (data_po.ok) {
          const get_data_po = await data_po.json();
          no_doc_or_po = get_data_po.data.nomor_po;
        }

        const id_suplier = data_dokumen.id_suplier;

        const data_vendor = await fetch(
          "http://127.0.0.1:8000/api/api/v1/suplier/get_suplier",
          {
            method: "POST",
            headers: {
              accept: "*/*",
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessKey,
            },
            body: JSON.stringify({
              id_suplier,
            }),
          }
        );
        if (data_vendor.ok) {
          const get_data_sup = await data_vendor.json();
          nama_vendor = get_data_sup.data.nama_suplier;
        }
      } else {
        no_doc_or_po = data_dokumen.nomor_daftar_in;

        const id_customer = data_dokumen.id_customer;

        const data_vendor = await fetch(
          "http://127.0.0.1:8000/api/api/v1/customer/get_customer",
          {
            method: "POST",
            headers: {
              accept: "*/*",
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessKey,
            },
            body: JSON.stringify({
              id_customer,
            }),
          }
        );
        if (data_vendor.ok) {
          const get_data_cus = await data_vendor.json();
          nama_vendor = get_data_cus.data.nama_customer;
        }
      }
      if (document.readyState) {
        setTimeout(() => {
          print();
          document.getElementById("block").classList.remove("hidden");
          window.close();
        }, 300);
      }
    }
  });
</script>

<div
  class="w-screen h-screen px-2 md:px-10 flex fixed justify-center items-center"
>
  <img src={Logo} alt="logo" class=" w-5/12 saturate-0 opacity-5 blur-0" />
</div>

<div class="w-full justify-center items-center flex-col pt-10 px-10 flex">
  <div class="w-full px-2 md:px-10 flex items-center justify-center">
    <h1 class=" text-center font-semibold">
      Dokumen

      {#if jenis}
        Pemasukan
      {:else}
        pengeluaran
      {/if}
      Barang
    </h1>
  </div>

  {#if data_dokumen}
    <div
      class="w-11/12 mt-5 text-sm justify-items-center grid grid-cols-3 gap-5"
    >
      <div class=" w-full border-2 border-slate-300 rounded-lg">
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
        <div class="w-full border-t-2 my-3 border-slate-10" />
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
          {#if jenis}
            <h1 class=" w-32">suplier :</h1>
          {:else}
            <h1 class=" w-32">customer :</h1>
          {/if}
          <h1>{nama_vendor}</h1>
        </div>
      </div>
      <div class=" border-2 w-full border-slate-300 rounded-lg">
        <h1 class="text-center mb-2 my-1 font-semibold">barang</h1>
        <div class="flex px-3 my-1">
          {#if jenis}
            <h1 class=" w-32">nomor po :</h1>
            <h1>{no_doc_or_po}</h1>
          {:else}
            <h1 class=" mr-3">nomor daftar dokumen pemasukan :</h1>
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
          <h1>{Nf.format(data_dokumen.jumlah)}</h1>
        </div>

        <div class="flex px-3 my-1">
          <h1 class=" w-32">harga satuan :</h1>
          <h1>{Nf.format(data_dokumen.harga_satuan)}</h1>
        </div>

        <div class="flex px-3 my-1">
          <h1 class=" w-32">total harga :</h1>
          <h1>{Nf.format(data_dokumen.jumlah * data_dokumen.harga_satuan)}</h1>
        </div>

        <div class="flex px-3 my-1">
          <h1 class=" w-32">lokasi :</h1>
          <h1>{data_dokumen.lokasi}</h1>
        </div>
      </div>
      <div class=" rounded-lg border-2 border-slate-300 w-full">
        <h1 class="text-center mb-2 my-1 font-semibold">pembayaran</h1>
        <div class="flex px-3 my-1">
          <h1 class=" w-32">valuta :</h1>
          <h1>{data_dokumen.vlauta}</h1>
        </div>
        <div class="flex px-3 my-1">
          <h1 class=" w-32">exchange rate :</h1>
          <h1>{Nf.format(data_dokumen.exchange_rate)}</h1>
        </div>
        <div class="flex px-3 my-1">
          <h1 class=" w-32">total harga :</h1>
          <h1>{Nf.format(data_dokumen.jumlah * data_dokumen.harga_satuan)}</h1>
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
            <h1>{Nf.format(data_dokumen.freight)}</h1>
          </div>
        {:else}
          <div class="flex px-3 my-1">
            <h1 class=" w-32">ppn :</h1>
            <h1>{Nf.format(data_dokumen.ppn)}</h1>
          </div>
        {/if}

        <div class="flex px-3 my-1">
          <h1 class=" w-32">grand total :</h1>
          <h1>{Nf.format(data_dokumen.grand_total)}</h1>
        </div>
      </div>
    </div>
  {/if}
  <div class="flex w-full justify-end my-5 px-5">
    <h2>Semarang {generate_waktu(today)}</h2>
  </div>

  <div class="w-full flex justify-end">
    <div
      class=" h-40 px-3 border border-slate-200 mx-5 justify-between flex-col flex"
    >
      <h3 class="text-center text-sm font-semibold w-full">Kepala Gudang</h3>
      <h3 class="text-center text-sm font-semibold w-full">
        (.............................................)
      </h3>
    </div>

    <div
      class=" h-40 px-3 border border-slate-200 mx-5 justify-between flex-col flex"
    >
      <h3 class="text-center text-sm font-semibold w-full">telly</h3>
      <h3 class="text-center text-sm font-semibold w-full">
        (.............................................)
      </h3>
    </div>

    <div
      class=" h-40 px-3 border border-slate-200 mx-5 justify-between flex-col flex"
    >
      <h3 class="text-center text-sm font-semibold w-full">Kabag Distribusi</h3>
      <h3 class="text-center text-sm font-semibold w-full">
        (.............................................)
      </h3>
    </div>

    <div
      class=" h-40 px-3 border border-slate-200 mx-5 justify-between flex-col flex"
    >
      <h3 class="text-center text-sm font-semibold w-full">Kabag PO</h3>
      <h3 class="text-center w-full">
        (.............................................)
      </h3>
    </div>
  </div>
</div>

<div
  id="block"
  class="hidden -translate-y-full z-50 fixed w-full h-full bg-white"
>
  s
</div>
