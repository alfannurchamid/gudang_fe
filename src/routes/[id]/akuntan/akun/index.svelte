<script>
  import TambahAkun from "$lib/components/tambah_akun.svelte";
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
   * @type {{ kode_barang: string; nama_barang: string;lokasi:string, harga: number;  saldo: number; satuan: string; }}
   */
  let data_barang = {
    kode_barang: "",
    nama_barang: "",
    lokasi: "",
    harga: 0,
    saldo: 0,
    satuan: "",
  };

  currentPosisiBase(0);
  currentPosisi(1);

  const pull = async () => {
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
      data = data1.data.data;
      console.log(data1.data.data);
    }
  };

  onMount(async () => {
    pull();
  });

  const tambahAkun = () => {
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
</script>

<div class="  w-full h-screen p-12">
  <div class="  w-full h-full">
    <h1 class=" text-center text-lg font-semibold text-gray-600">
      Pengelolaan Akun
    </h1>
    <div class="head w-full items-center justify-end pr-10 h-10 flex">
      <!-- svelte-ignore missing-declaration -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        on:click={() => {
          tambahAkun();
        }}
        class="btn-primary"
      >
        tambah akun
      </div>
    </div>
    <div class=" w-full flex justify-center">
      <div class="w-9/12 bg-gray-200 rounded-xl">
        <div>
          <table class=" w-full table rounded-xl border-gray-200 border">
            <thead>
              <tr class=" border-x-2 border-gray-50">
                <th class=" border-x-2 border-gray-50">no</th>
                <th class=" border-x-2 border-gray-50">id akun</th>
                <th class=" border-x-2 border-gray-50">nama akun</th>
                <th class=" border-x-2 border-gray-50">post akun</th>
                <th class=" border-x-2 border-gray-50">saldo</th>
                <th class=" border-x-2 border-gray-50">#aksi</th>
              </tr>
            </thead>
            <tbody>
              {#each data as dt, i}
                <tr>
                  <td class=" border-x-2 border-gray-50">{i + 1}</td>
                  <td class=" border-x-2 border-gray-50">{dt.id_akun}</td>
                  <td class=" border-x-2 border-gray-50">{dt.nama_akun} </td>
                  <td class=" border-x-2 border-gray-50">
                    {#if dt.pos_akun_debit == "1"}
                      debet
                    {:else}
                      kredit
                    {/if}
                  </td>
                  <td class=" border-x-2 border-gray-50">{dt.saldo}</td>
                  <td class=" flex border-x-2 border-gray-50" />
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
<TambahAkun bind:data />
