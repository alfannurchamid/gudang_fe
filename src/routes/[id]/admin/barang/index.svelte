<script>
  import TambahBarang from "$lib/components/tambah_barang.svelte";
  import TambahOpname from "$lib/components/tambah_opname.svelte";
  import TambahRijek from "$lib/components/tambah_rijek.svelte";
  import {
    posisi,
    currentPosisiBase,
    posisiBase,
    currentPosisi,
  } from "$lib/stores/posisiAndmin";
  import { onMount } from "svelte";
  import { bind } from "svelte/internal";

  /**
   * @type {any[]}
   */
  let data = [];

  /**
   * @type {{ kode_barang: string; nama_barang: string; saldo: number; satuan: string; }}
   */
  let data_barang = {
    kode_barang: "",
    nama_barang: "",
    saldo: 0,
    satuan: "",
  };

  currentPosisiBase(0);
  currentPosisi(1);

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
      data = data1.data.data;
      console.log(data1.data.data);
    }
  };

  onMount(async () => {
    pull();
  });

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

  const tambahOpname = () => {
    const seting = document.getElementById("pop_tambah_opname")?.classList;

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

  const tambah_Rijek = () => {
    const seting = document.getElementById("pop_tambah_rijek")?.classList;

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
</script>

<div class="  w-full h-screen p-12">
  <div class="  w-full h-full">
    <h1 class=" text-center text-lg font-semibold text-gray-600">
      Pengelolaan Barang
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
        tambah barang
      </div>
    </div>
    <div class=" w-full flex justify-center">
      <div class="w-9/12 bg-gray-200 rounded-xl">
        <div>
          <table class=" w-full table rounded-xl border-gray-200 border">
            <thead>
              <tr class=" border-x-2 border-gray-50">
                <th class=" border-x-2 border-gray-50">no</th>
                <th class=" border-x-2 border-gray-50">kode barang</th>
                <th class=" border-x-2 border-gray-50">nama barang</th>
                <th class=" border-x-2 border-gray-50">stok</th>
                <th class=" border-x-2 border-gray-50">satuan</th>
                <th class=" border-x-2 border-gray-50">#aksi</th>
              </tr>
            </thead>
            <tbody>
              {#each data as dt, i}
                <tr>
                  <td class=" border-x-2 border-gray-50">{i + 1}</td>
                  <td class=" border-x-2 border-gray-50">{dt.kode_barang}</td>
                  <td class=" border-x-2 border-gray-50">{dt.nama_barang} </td>
                  <td class=" border-x-2 border-gray-50">{dt.saldo}</td>
                  <td class=" border-x-2 border-gray-50">{dt.satuan}</td>
                  <td class=" flex justify-center border-gray-50">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                      on:click={() => {
                        data_barang = dt;
                        tambahOpname();
                      }}
                      class="btn-success-small w-16"
                    >
                      opname
                    </div>
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
<TambahBarang bind:data />
<TambahOpname bind:data_barang />
