<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">입력 예제 모음</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-subtitle1">📌 Input (TextField)</div>
        <q-input filled v-model="textValue" label="이름을 입력하세요" />

        <q-separator spaced />

        <div class="text-subtitle1">📌 Select (드롭다운)</div>
        <q-select filled v-model="selectedOption" :options="options" label="옵션 선택" />

        <q-separator spaced />

        <div class="text-subtitle1">📌 File Picker</div>
        <q-file filled v-model="file" label="파일 선택" />

        <q-separator spaced />

        <div class="text-subtitle1">📌 Date Picker</div>
        <q-input filled v-model="date" label="날짜 선택">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date v-model="date" mask="YYYY-MM-DD" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-separator spaced />

        <div class="text-subtitle1">📌 Checkbox & Radio</div>
        <q-checkbox v-model="isChecked" label="동의합니다" />
        <q-option-group v-model="selectedRadio" :options="radioOptions" type="radio" />

        <q-separator spaced />

        <div class="text-subtitle1">📌 Toggle</div>
        <q-toggle v-model="isToggled" label="활성화 여부" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const textValue = ref('')
const selectedOption = ref(null)
const options = ref(['옵션 1', '옵션 2', '옵션 3'])

const file = ref(null)
const date = ref(null)

const isChecked = ref(false)
const selectedRadio = ref('옵션 1')
const radioOptions = ref([
  { label: '옵션 1', value: '옵션 1' },
  { label: '옵션 2', value: '옵션 2' },
])

const isToggled = ref(false)
</script>

<style scoped>
.q-separator {
  margin: 16px 0;
}
</style>
