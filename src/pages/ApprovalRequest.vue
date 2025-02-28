<template>
  <q-page class="flex flex-center column">
    <q-card class="q-pa-lg request-card">
      <q-card-section class="text-center">
        <q-img src="/images/request.png" class="request-image" fit="cover" />
      </q-card-section>

      <q-card-section>
        <div class="text-h4 text-bold text-center q-mb-md">승인 요청 중입니다!</div>
        <p class="text-center text-body1 q-mb-md">
          귀하의 요청이 처리되고 있습니다. 잠시만 기다려 주시면 승인 여부를 알려드리겠습니다.
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
