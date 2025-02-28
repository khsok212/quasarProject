<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// chart.js 구성 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// 차트 데이터와 옵션 설정
const chartData = {
  labels: ['1월', '2월', '3월', '4월', '5월'], // X축 레이블
  datasets: [
    {
      label: '매출',
      data: [1200000, 1500000, 1300000, 1700000, 1600000], // Y축 값
      backgroundColor: 'rgba(75, 192, 192, 0.2)', // 막대 색상
      borderColor: 'rgba(75, 192, 192, 1)', // 테두리 색상
      borderWidth: 1,
    },
  ],
}

const chartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: '2025년 매출 추이', // 차트 제목
    },
    tooltip: {
      enabled: true,
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
