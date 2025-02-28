<template>
  <q-page class="flex flex-center column">
    <q-card class="q-pa-lg welcome-card">
      <q-card-section class="text-center">
        <q-img src="/images/welcome.png" class="welcome-image" fit="cover" />
      </q-card-section>

      <q-card-section>
        <div class="text-h4 text-bold text-center q-mb-md">환영합니다!</div>
        <p class="text-center text-body1 q-mb-md">
          우리 서비스에 방문해 주셔서 감사합니다. 회원가입 후 다양한 기능을 경험해 보세요.
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup></script>

<style scoped>
.welcome-card {
  max-width: 600px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.welcome-image {
  width: 100%;
  height: 440px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
</style>
