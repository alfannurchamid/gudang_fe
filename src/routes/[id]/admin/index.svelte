<script>
  import Logo from "$lib/static/Logo.svg";

  import {
    posisi,
    currentPosisiBase,
    posisiBase,
    currentPosisi,
  } from "$lib/stores/posisiAndmin";
  currentPosisiBase(0);
  currentPosisi(0);
</script>

<div class="w-screen h-screen px-2 md:px-10 flex   justify-center items-center">
  <img src={Logo} alt="logo" class=" w-5/12 saturate-0 opacity-5 blur-0 " />
</div>
