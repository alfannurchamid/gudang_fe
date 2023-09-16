<script>
  // @ts-nocheck
  import { fly, fade } from "svelte/transition";

  import { onMount } from "svelte";
  import { generate_waktu } from "$lib/stores/waktu_generator";
  import { SetCookie, GetCookie, DelCookie } from "$lib/stores/cokies";
  import { Nf } from "$lib/stores/formatNumber";

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
  import { get_laba_berjalan } from "$lib/stores/update_laba_berjalan";
  import { cek_token } from "$lib/stores/cek_token";

  currentPosisiBase(2);
  currentPosisi(1);
  let hasError = false;
  let isSuccessVisible = false;
  let submitted = false;

  let accessKey = "";
  let refreshKey = "";
  /**
   * @type {any[]}
   */
  let data_akun = [];
  let akun_change = {
    id_akun: "",
    nama_akun: "",
    kategori_akun: "",
    pos_akun_debit: false,
    saldo: 0,
  };

  const pull_akun = async () => {
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
      data_akun = data1.data.data;
      console.log(data1.data.data);
    }
  };

  onMount(async () => {
    pull_akun();
    await cek_token();
    accessKey = GetCookie("accesskey");
    refreshKey = GetCookie("refreshkey");
  });

  let tanggal = "";
  let keterangan = "";

  let catatan = "";
  let debet = 0;
  let kredit = 0;

  const add_jurnal = () => {
    if (kredit == null) {
      kredit = 0;
    }
    if (debet == null) {
      kredit = 0;
    }
    const a = {
      id_akun: akun_change.id_akun,
      nama_akun: akun_change.nama_akun,
      debet: debet,
      kredit: kredit,
      catatan: catatan,
      saldo: akun_change.saldo,
      type: akun_change.pos_akun_debit,
    };

    data.push(a);
    data = data;

    document.getElementById("add").reset();
    debet = 0;
    kredit = 0;
    akun_change = {
      id_akun: "",
      nama_akun: "",
      kategori_akun: "",
      pos_akun_debit: false,
      saldo: 0,
      type: akun_change.pos_akun_debit,
    };
  };
  let pending = false;

  const delete_row = (id_akun) => {
    data = data.filter((items) => items.id_akun !== id_akun);
  };

  const cari_selisih = async () => {
    const ada = data.filter(
      (item) =>
        item.id_akun.startsWith("5.") ||
        item.id_akun.startsWith("4.") ||
        item.id_akun.startsWith("6.")
    );

    console.log(ada);
    if (ada.length > 0) {
      // cari nilai perubahan
      let selisih = 0;

      ada.forEach((item) => {
        if (item.type == "1") {
          selisih -= item.kredit;
          selisih += item.debet;

          console.log(selisih);
        } else {
          selisih += item.kredit;
          selisih -= item.debet;

          console.log(selisih, item.type);
        }
      });

      const current_laba = await get_laba_berjalan();
      const akun_laba = data_akun.filter((item) => item.id_akun == "3.5");
      const a = {
        id_akun: "3.5",
        nama_akun: akun_laba[0].nama_akun,
        debet: 0,
        kredit: current_laba - selisih,
        catatan: catatan,
        saldo: 0,
        type: akun_laba[0].pos_akun_debit,
      };
      const data_post = [a];

      console.log("datnya", data_post);
      // await post_jurnal();
      // data = [];
    }
  };

  const post_jurnal = async () => {
    const today = new Date();
    const date_now = new Date(tanggal);
    if (date_now.getDate() < today.getDate()) {
      alert("Tidak dapat memproses transaksi sebelum hari ini");
    } else {
      pending = true;
      await cek_token();
      accessKey = GetCookie("accesskey");
      const response = await fetch(
        "http://127.0.0.1:8000/api/api/v1/akuntansi/add_jurnal_umum",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessKey,
          },
          body: JSON.stringify({
            keterangan,
            list_akun: data,
            tanggal,
          }),
        }
      );

      if (response.ok) {
        pending = false;

        // cek apakah list akun terdapat akun laba rugi
        const ada = data.filter(
          (item) =>
            item.id_akun.startsWith("5.") ||
            item.id_akun.startsWith("4.") ||
            item.id_akun.startsWith("6.")
        );
        if (ada.length > 0) {
          // cari nilai perubahan
          let selisih = 0;

          ada.forEach((item) => {
            if (item.type == "1") {
              selisih -= item.kredit;
              selisih += item.debet;

              console.log(selisih);
            } else {
              selisih += item.kredit;
              selisih -= item.debet;

              console.log(selisih);
            }
          });

          const current_laba = await get_laba_berjalan();
          const akun_laba = data_akun.filter((item) => item.id_akun == "3.5");
          const a = {
            id_akun: "3.5",
            nama_akun: akun_laba[0].nama_akun,
            debet: 0,
            kredit: current_laba - selisih,
            catatan: catatan,
            saldo: 0,
            type: akun_laba[0].pos_akun_debit,
          };
          data = [a];
          await post_jurnal();
          data = [];
        }
        isSuccessVisible = true;

        setTimeout(function () {
          isSuccessVisible = false;
        }, 4000);
      } else {
        hasError = true;
      }
    }
  };
  const errMessage = "maaf terjadi kesalahan";

  let is_cari = false;
</script>

<!-- Lorem ipsum dolor sit amet consectetur adipisicing elit. At similique soluta ut blanditiis repellendus debitis quidem nulla vitae corrupti non perferendis architecto rem totam minima porro, et, distinctio illum expedita! -->
<div class="   h-screen p-16 pr-5">
  <div class="   h-full flex flex-col items-center">
    <h1 class="  text-center text-lg font-semibold text-gray-600">
      JURNAL UMUM
    </h1>
    {#if pending}
      <h1>memproses...</h1>
    {/if}
    <div style="width:87%" class=" bg-slate-100 rounded-t-xl">
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
      <form class="submitted" on:submit|preventDefault={post_jurnal}>
        <div class="flex justify-between mt-3">
          <div class=" flex items-center p-2">
            <h1 class=" px-2 mr-14">No Jurnal : 0001</h1>
            <h1>tanggal</h1>
            <input
              required
              bind:value={tanggal}
              class=" inputB1 mx-5"
              type="date"
            />
          </div>

          <div class="flex items-center p-2 mr-10">
            <button type="submit" class="btn-primary">simpan</button>
          </div>
        </div>
        <div class="flex items-center">
          <h1 class="pl-2">keterangan</h1>
          <input
            required
            bind:value={keterangan}
            class=" inputB1 mx-5 w-full"
            type="text"
          />
        </div>
      </form>
      <!-- <div class="flex items-center p-2 mr-10">
        <button
          on:click={() => {
            cari_selisih();
          }}
          type="button"
          class="btn-primary ">cek</button
        >
      </div> -->
      <form
        id="add"
        on:submit|preventDefault={add_jurnal}
        class=" mt-3 border-t-2 border-gray-400 font-semibold"
      >
        <div class="flex items-center p-2 px-5">
          <h1 class="mr-3">akun</h1>
          <select
            required
            bind:value={akun_change}
            class="inputB1 w-64 mr-2 px-2 rounded-lg"
            placeholder="opsional"
          >
            {#each data_akun as dt_b}
              <option value={dt_b}>
                {dt_b.nama_akun}
              </option>
            {/each}
          </select>

          <h1>debet</h1>
          <input
            class=" inputB1 w-28 mr-5 ml-2"
            bind:value={debet}
            type="number"
          />

          <h1>kredit</h1>
          <input
            class=" inputB1 w-28 mr-5 ml-2"
            bind:value={kredit}
            type="number"
          />

          <h1>catatan</h1>
          <input class=" inputB1 w-64 mx-5" bind:value={catatan} type="text" />

          <button type="submit">
            <div class="">
              <div class="w-6 translate-y-1.5 rounded-3xl h-2 bg-green-500" />
              <div
                class="w-6 -translate-y-0.5 rounded-3xl h-2 rotate-90 bg-green-500"
              />
            </div>
          </button>
        </div>
      </form>
    </div>

    <div class="w-10/12 mt-4">
      <table class="w-full table border-2 rounded-2xl border-gray-100">
        <thead class="bg-gray-300">
          <tr>
            <th>id akun</th>
            <th>nama akun</th>
            <th>debit </th>
            <th>kredit</th>
            <th>catatan</th>
            <th class="w-8 px-2">hapus</th>
          </tr>
        </thead>
        <tbody>
          {#if data}
            {#each data as dt}
              <tr>
                <td>{dt.id_akun} </td>
                <td>{dt.nama_akun}</td>
                <td>{Nf.format(dt.debet)}</td>
                <td>{Nf.format(dt.kredit)}</td>
                <td>{dt.catatan}</td>
                <td class=" flex justify-center items-center pt-2">
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <div
                    on:click={() => {
                      delete_row(dt.id_akun);
                    }}
                    class=" hover:-translate-y-0.5 cursor-default w-6 h-2 rounded-sm bg-red-500"
                  />
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
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
</style>
