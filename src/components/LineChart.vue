<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// chart.js 구성 요소 등록
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend)

const chartData = {
  labels: ['1월', '2월', '3월', '4월', '5월'], // X축 레이블
  datasets: [
    {
      label: '방문자 수',
      data: [8000, 12000, 10000, 15000, 13000], // Y축 값
      fill: false, // 선 밑을 채우지 않음
      borderColor: 'rgba(54, 162, 235, 1)', // 선 색상
      tension: 0.1, // 선의 곡선 정도
    },
  ],
}

const chartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: '2025년 방문자 추이', // 차트 제목
    },
  },
  scales: {
    y: {
      beginAtZero: true, // Y축 값이 0부터 시작
    },
  },
}
</script>

<style scoped>
.chart-container {
  height: 300px; /* 차트 높이 조정 */
}
</style>
