<script lang="ts">
  import Loader from "$lib/components/Loader.svelte";
  import Header from "$lib/components/header.svelte";
  import MainNav from "$lib/components/MainNav.svelte";

  import Setings from "$lib/components/setings.svelte";
  import Bgbg from "$lib/static/images/bgbg.svg";
  import Segitiga from "$lib/static/images/segitiga.svelte";

  let a = "oooo";
</script>

<Loader />
<MainNav />

<slot />
<svelte:head>
  <title>Admin Gudang</title>
</svelte:head>
<Header />

<Setings />
