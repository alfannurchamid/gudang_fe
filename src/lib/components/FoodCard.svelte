<script lang="ts">
	import { removeFood } from '$lib/stores/food';
	export let food: Food;
</script>

<div class=" border-collaps border-2 border-slate-500 p-5 rounded-3xl food-card ">
	<div class="overflow-hidden  rounded-xl ">
		<img src={food.img_url} alt="gorengan" class="rounded-xl " />
	</div>
	<div class="title-items">{food.title}</div>
	<div class="">
		{food.description}
	</div>
	<div class="footer-card">
		<div>
			{#each food.tags as tag}
				<button class=" btn-tag">{tag}</button>
			{/each}
		</div>
		<button
			class="btn-danger-small"
			on:click={() => {
				removeFood(food.id);
			}}>delete</button
		>
	</div>
</div>
