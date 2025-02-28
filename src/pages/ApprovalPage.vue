<template>
  <q-page class="flex flex-center column">
    <q-card class="q-pa-lg request-card">
      <q-card-section class="text-center">
        <q-img src="/images/approval.png" class="request-image" fit="cover" />
        <!-- 승인 완료 이미지를 사용 -->
      </q-card-section>

      <q-card-section>
        <div class="text-h4 text-bold text-center q-mb-md">승인이 완료되었습니다!</div>
        <p class="text-center text-body1 q-mb-md">
          귀하의 요청이 성공적으로 승인되었습니다. 이용해 주셔서 감사합니다.
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup></script>

<style scoped>
.request-card {
  max-width: 600px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.request-image {
  width: 100%;
  height: 400px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
</style>
