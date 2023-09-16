<script>
  import TambahPo from "$lib/components/tambah_po.svelte";
  import { onMount } from "svelte";
  import { SetCookie } from "$lib/stores/cokies";

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
  import { cek_token } from "$lib/stores/cek_token";

  const pull = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/purchase_order/get_po_s",
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
      data = data1.data.data;
      console.log(data1.data.data);
    }
  };

  onMount(async () => {
    cek_token();

    pull();
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

  const delete_po = async () => {
    const id_po = id_pop;
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/purchase_order/delete_po",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          // Authorization: "Bearer " + accessKey,
        },
        body: JSON.stringify({
          id_po,
        }),
      }
    );

    if (response.ok) {
      data = data.filter((item) => item.id_po != id_po);
    }
  };
</script>

<div class="  w-full h-screen p-12">
  <div class="  w-full h-full">
    <h1 class=" text-center text-lg font-semibold text-gray-600">
      Purchasing Order
    </h1>
    <div class="head w-full items-center justify-end pr-10 h-10 flex">
      <!-- svelte-ignore missing-declaration -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={() => {
          tambahBarang();
        }}
        class="btn-primary"
      >
        buat porchase order
      </div>
    </div>
    <div class=" w-full flex justify-center">
      <div class=" bg-gray-200 rounded-xl">
        <div>
          <table class=" w-full table rounded-xl border-gray-200 border">
            <thead class="">
              <tr class=" p-2 border-x-2 border-b-2 border-gray-50">
                <th
                  class=" border-x-2 border-gray-50 text-center justify-center"
                  >nomor po</th
                >
                <th class=" border-x-2 border-gray-50">suplier</th>
                <th class=" border-x-2 border-gray-50">nama barang</th>
                <th class=" border-x-2 border-gray-50">jumlah</th>
                <th class=" border-x-2 border-gray-50">tanggal po</th>
                <th class=" border-x-2 border-gray-50">#aksi</th>
              </tr>
            </thead>
            <tbody>
              {#each data as dt}
                <tr class="p-2">
                  <td class=" p-3 border-x-2 border-gray-50">{dt.nomor_po}</td>
                  <td class=" p-3 border-x-2 border-gray-50"
                    >{dt.nama_suplier}</td
                  >
                  <td class=" p-3 border-x-2 border-gray-50"
                    >{dt.nama_barang}</td
                  >
                  <td class=" p-3 border-x-2 border-gray-50"
                    >{dt.jumlah_order}</td
                  >
                  <td class=" p-3 border-x-2 border-gray-50">{dt.tgl_po}</td>
                  <td class=" p-3 border-x-2 border-gray-50">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    {#if !dt.done}
                      <div
                        on:click={() => {
                          id_pop = dt.id_po;
                          nomor_pop = dt.nomor_po;
                          change_po();
                        }}
                        class="btn-success-small px-2"
                      >
                        catat pembelian
                      </div>

                      <div
                        on:click={() => {
                          id_pop = dt.id_po;
                          delete_po();
                        }}
                        class="btn-danger-xxs px-2 mt-1"
                      >
                        hapus
                      </div>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
<TambahPo bind:data />
