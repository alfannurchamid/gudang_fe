<script lang="ts">
  import HeaderPrint from "$lib/components/header_print.svelte";

  import Setings from "$lib/components/setings.svelte";

  let a = "oooo";
</script>

<slot />
<svelte:head>
  <title>Admin Gudang</title>
</svelte:head>
<HeaderPrint />

<Setings />
