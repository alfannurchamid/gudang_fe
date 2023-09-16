<script>
  import Logo from "$lib/static/images/logo.png";

  const blur = () => {
    const div_blur = document.getElementById("blur")?.classList;
    div_blur?.remove("backdrop-blur-none");
    div_blur?.add("backdrop-blur-lg");
  };
</script>

<div class=" justify-center flex bg-blue-500 w-full h-22 ">
  <img
    on:click={() => {
      blur();
    }}
    class="  bg-yellow-400 backdrop:blur-sm bg-opacity-20 md:w-10  md:h-10  w-40 h-40"
    src={Logo}
    alt="logo"
  />

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    id="blur"
    class="w-20 h-20 bg-slate-200 mt-10 fixed bg-opacity-40 backdrop-blur-none "
  >
    c
  </div>
  <h1 class=" kuning  mt-10 text-green-100 text-2xl font-bold">
    Lestari berkah sae
  </h1>
</div>
<div class=" flex justify-center items-center h-screen ">
  <input class=" border-2 " type="file" />
</div>

<style>
  .kuning {
    background-color: yellow;
  }
</style>
