<script>
  import TambahDoc from "$lib/components/tambah_doc.svelte";
  import { onMount } from "svelte";

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

  const pull = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/api/v1/standar_doc/get_docs",
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
</script>

<div class="  w-full h-screen p-12">
  <div class="  w-full h-full">
    <h1 class=" text-center text-lg font-semibold text-gray-600">
      Setting Default Nomer Dokumen
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
        tambah dokumen
      </div>
    </div>
    <div class=" w-full flex justify-center">
      <div class="w-2/3 bg-gray-100 rounded-xl">
        <div>
          <table class=" w-full table rounded-xl border-gray-200 border">
            <thead>
              <tr class=" border-x-2 border-gray-50">
                <th class=" border-x-2 border-gray-50">nomor</th>
                <th class=" border-x-2 border-gray-50">jenis</th>
                <th class=" border-x-2 border-gray-50">jenis dokumen</th>
                <th class=" border-x-2 border-gray-50">tanggal</th>
                <th class=" border-x-2 border-gray-50">status</th>
              </tr>
            </thead>
            <tbody>
              {#each data as dt}
                <tr>
                  <td class=" px-3 border-x-2 border-gray-50">{dt.nomor}</td>
                  <td class=" px-3 border-x-2 border-gray-50"
                    >{#if dt.jenis}pemasukan{:else}pengeluaran{/if}</td
                  >
                  <td class=" px-3 border-x-2 border-gray-50"
                    >{dt.jenis_dokumen}</td
                  >
                  <td class=" px-3 border-x-2 border-gray-50">{dt.tanggal}</td>

                  {#if dt.done}
                    <td class=" px-3 border-x-2 text-green-500 border-gray-50">
                      selesai
                    </td>
                  {:else}
                    <td class=" px-3 border-x-2 text-yellow-500 border-gray-50">
                      menunggu
                    </td>
                  {/if}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
<TambahDoc bind:data />
