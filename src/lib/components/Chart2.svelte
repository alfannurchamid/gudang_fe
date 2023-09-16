<script lang="ts">
	export let totalkab: number[];
	export let totalGlobal: number;

	import { Doughnut } from 'svelte-chartjs';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	if (!totalkab) {
		totalkab = [1, 1, 1, 1, 1, 1];
		totalGlobal = 1;
		// totalkab = totalkab;
	}
	let ttkab: number[] = [10, 10, 10, 10, 10, 10];
	let i: number = 0;
	for (let a in totalkab) {
		ttkab[i] = Number(((totalkab[i] / totalGlobal) * 100).toFixed(1));
		i = i + 1;
	}

	let bg = [
		'rgb(248 113 113)',
		'rgb(167 139 250)',
		'rgb(251 146 60)',
		'rgb(244 114 182)',
		'rgb(163 230 53)',
		'rgb(192 38 211)'
	];
	// let bg = ['#FF0000', '#FF8383', '#FFFFFF', 'rgb(156 163 175)', 'rgb(55 65 81)', '#000000'];

	// let data: {
	// 	labels: string[];
	// 	datasets: {
	// 		label: string;
	// 		data: number[];
	// 		backgroundColor: string[];
	// 		hoverOffset: number;
	// 		color: string;
	// 	}[];
	// };

	const data = {
		labels: [
			'aktif : % ',
			'loyal : % ',
			'simpati : % ',
			'memperhatikan : % ',
			'cuek : % ',
			'benci : % '
		],
		datasets: [
			{
				label: 'My First Dataset',
				data: [2, 3, 4, 2, 3, 5],
				backgroundColor: bg,
				hoverOffset: 4,
				color: 'black'
			}
		]
	};
	// var config = {
	// 	type: 'doughnut',
	// 	data: data,
	// 	borderWidth: 10,
	// 	options: {
	// 		plugins: {
	// 			legend: false,
	// 			value: false
	// 		}
	// 	}
	// };

	const options = {
		plugins: {
			legend: false
		}
	};
</script>

<Doughnut {data} {options} />
