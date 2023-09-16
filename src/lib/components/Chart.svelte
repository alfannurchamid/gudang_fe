<script>
	export let databar;

	import { Bar } from 'svelte-chartjs';
	let data = {
		labels: databar.label,
		datasets: databar.data
	};

	import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
</script>

<Bar {data} options={{ responsive: true }} />
