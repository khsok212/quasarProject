// src/boot/chart.js
import Chart from 'chart.js/auto'

export default async ({ app }) => {
  // 차트를 전역으로 사용할 수 있도록 설정
  app.config.globalProperties.$chart = Chart
}
