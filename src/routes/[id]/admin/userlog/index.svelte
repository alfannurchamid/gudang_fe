<script>
  // @ts-nocheck

  import {
    posisi,
    currentPosisiBase,
    posisiBase,
    currentPosisi,
  } from "$lib/stores/posisiAndmin";
  import { onMount } from "svelte";
  let is_cari = false;
  /**
   * @type {any[]}
   */
  let data_list = [];
  let index = 0;
  let tanggal_mulai = "";
  let tanggal_ahir = "";

  let type = "";

  let bobo = JSON.stringify({
    index,
  });

  const pull = async () => {
    bobo = JSON.stringify({
      index,
    });

    if (is_cari) {
      bobo = JSON.stringify({
        index,
        tanggal_ahir,
        tanggal_mulai,
        type,
      });

      if (type == "") {
        bobo = JSON.stringify({
          index,
          tanggal_ahir,
          tanggal_mulai,
        });
      }

      if (tanggal_mulai == "") {
        bobo = JSON.stringify({
          index,
          type,
        });
      }
    }
    const res = await fetch(
      "http://127.0.0.1:8000/api/api/v1/user_log/get_user_log",
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

    if (res.ok) {
      const data = await res.json();

      data_list = data_list.concat(data.data.data);
      if (data.data.data.length == 0) {
        notPending = false;
      } else {
        notPending = true;
      }
    }
  };

  onMount(async () => {
    pull();
    index += 1;
    pull();
  });

  currentPosisiBase(0);
  currentPosisi(1);

  let y = 0;
  let h = 0;

  $: innerHeight = 0;

  let notPending = true;
  const cekScroll = async () => {
    const panah = document.getElementById("panah")?.classList;
    if (y > 10) {
      panah?.remove("-rotate-45");
      panah?.add("rotate-45");
    } else {
      panah?.remove("rotate-45");
      panah?.add("-rotate-45");
    }

    // console.log("pending = " + notPending);
    if (y + innerHeight > h - 10 && notPending) {
      // alert("scrolled");
      const pen = document.getElementById("pending")?.classList;
      pen.remove("hidden");
      pen.add("flex");
      notPending = false;

      await pull();
      index += 1;
      setTimeout(() => {
        pen.remove("flex");
        pen.add("hidden");
      }, 10);
    }
  };

  function scrollWin() {
    if (y > 10) {
      window.scrollTo(0, 0);
      setTimeout(() => {
        const panah = document.getElementById("panah")?.classList;
        panah?.remove("rotate-45");
        panah?.add("-rotate-45");
      }, 20);
    } else {
      history.back();
    }
  }

  const cari = async () => {
    data_list = [];
    index = 0;
    is_cari = true;

    pull();
  };
</script>

<div class=" text-xs w-full h-screen p-12">
  <div class="  w-full h-full">
    <h1 class=" text-center text-lg font-semibold text-gray-600">User Log</h1>
    <div class="w-full my-3 flex justify-center">
      <form on:submit|preventDefault={cari}>
        <select class="inputB" name="type" id="tipe" bind:value={type}>
          <option value="">semua</option>
          <option value="po">purchase order</option>
          <option value="t_in">dokumen pemasukan</option>
          <option value="t_out">dokumen pengeluaran</option>
        </select>
        <input type="date" bind:value={tanggal_mulai} class="inputB" />
        <input type="date" bind:value={tanggal_ahir} class="inputB" />
        <button
          type="submit"
          class="btn-primary-small w-20 uppercase font-semibold"
        >
          cari
        </button>
      </form>
    </div>
    <div class="w-full flex justify-center flex-col items-center">
      {#each data_list as dtl}
        <div
          class="LOG_CARD w-2/4 h-18 my-3 flex flex-col bg-gray-100 rounded-xl p-3"
        >
          <div class="flex justify-between">
            <h1 class=" font-semibold text-xs uppercase">{dtl.nama_user}</h1>
            <h5>{dtl.id_log}</h5>
            <h5>{dtl.access}</h5>
            <h5>{dtl.tanggal}</h5>
          </div>
          <div class="mx-2 mt-2">
            <p>{dtl.keterangan}</p>
          </div>
        </div>
      {/each}
      <!-- loading bawah scroll -->
      <div id="pending" class="w-full hidden p-5 justify-center">
        <div class="w-1/6" />
        <div
          class="h-8 w-8 animate-spin-slow rounded-full border-dotted flex border-b-2 border-l-2 border-t-4 border-r-8 border-gray-700"
        />
      </div>
      <div class=" w-22 h-80" />
    </div>
  </div>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="fixed bottom-1 right-1 p-3 flex justify-center items-center shadow-xl bg-white rounded-full"
  on:click={() => {
    scrollWin();
  }}
>
  <div
    id="panah"
    class=" w-4 h-4 border-l-2 transition-all duration-300 -rotate-45 border-t-2 border-blue-400"
  />
</div>
<svelte:window
  bind:scrollY={y}
  bind:innerHeight
  on:scroll={() => cekScroll()}
/>
