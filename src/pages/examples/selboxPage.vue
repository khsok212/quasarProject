<template>
  <q-page class="q-pa-md">
    <!-- Filled 영역 -->
    <div class="q-gutter-md filled-section">
      <q-toolbar>
        <q-toolbar-title>selectBox</q-toolbar-title>
      </q-toolbar>

      <q-select
        class="custom-input"
        v-model="model"
        :options="options"
        label="Standard"
        :dense="dense"
        :options-dense="denseOpts"
      ></q-select>

      <q-select
        class="custom-input"
        filled
        v-model="model"
        :options="options"
        label="Filled"
        :dense="dense"
        :options-dense="denseOpts"
      ></q-select>

      <q-select
        class="custom-input"
        outlined
        v-model="model"
        :options="options"
        label="Outlined"
        :dense="dense"
        :options-dense="denseOpts"
      ></q-select>

      <q-select
        class="custom-input"
        standout
        v-model="model"
        :options="options"
        label="Standout"
        :dense="dense"
        :options-dense="denseOpts"
      ></q-select>

      <q-select
        class="custom-input"
        standout="bg-teal text-white"
        v-model="model"
        :options="options"
        label="Custom standout"
        :dense="dense"
        :options-dense="denseOpts"
      ></q-select>

      <q-select
        class="custom-input"
        square
        filled
        v-model="model"
        :options="options"
        label="Square filled"
        :dense="dense"
        :options-dense="denseOpts"
      ></q-select>

      <q-select
        class="custom-input"
        square
        outlined
        v-model="model"
        :options="options"
        label="Square outlined"
        :dense="dense"
        :options-dense="denseOpts"
      ></q-select>

      <q-select
        class="custom-input"
        color="grey-3"
        outlined
        label-color="orange"
        v-model="model"
        :options="options"
        label="Label"
      >
        <template v-slot:append>
          <q-icon name="event" color="orange"></q-icon>
        </template>
      </q-select>

      <q-select
        class="custom-input"
        clearable
        filled
        color="purple-12"
        v-model="model"
        :options="options"
        label="Label"
      ></q-select>

      <div class="q-gutter-md row">
        <q-select
          disable
          filled
          v-model="model"
          :options="options"
          hint="Disable"
          style="width: 250px"
        ></q-select>

        <q-select
          readonly
          filled
          v-model="model"
          :options="options"
          hint="Readonly"
          style="width: 250px"
        ></q-select>

        <q-select
          disable
          readonly
          filled
          v-model="model"
          :options="options"
          hint="Disable and readonly"
          style="width: 250px"
        ></q-select>
      </div>

      <q-select
        filled
        v-model="multiple"
        multiple
        :options="options"
        label="Multiple"
        style="width: 250px; height: auto"
      ></q-select>
    </div>

    <!-- Clearable 영역 -->
    <div class="q-gutter-md inputtype-section">
      <q-toolbar>
        <q-toolbar-title>Input</q-toolbar-title>
      </q-toolbar>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const text = ref('')
    const dense = ref(false)
    const model = ref('')
    const options = ref(['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'])
    const denseOpts = ref(false)
    const multiple = ref(null)

    return {
      text,
      dense,
      options,
      model,
      denseOpts,
      multiple,
    }
  },
}
</script>

<style scoped>
.q-gutter-md {
  max-width: 1000px;
  margin: 0 auto;
}

/* Input Section */
.input-section {
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.input-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: space-between; /* 요소들 간의 간격을 일정하게 유지 */
}

.custom-input {
  flex-grow: 1;
  width: 400px; /* 모든 입력 필드의 width를 동일하게 설정 */
}

.input-value {
  width: 400px;
  margin-left: 10px;
  font-size: 1.1em;
  color: #0077b6;
  font-weight: bold;
  white-space: nowrap; /* 텍스트가 한 줄로만 표시되도록 함 */
  text-overflow: ellipsis; /* 텍스트가 너무 길면 ... 처리 */
  overflow: hidden; /* 텍스트가 영역을 넘지 않도록 함 */
}

/* Filled Section */
.filled-section {
  padding: 20px;
  background-color: #e8f4f8;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.inputtype-section {
  padding: 20px;
  background-color: #e9e9e9e1;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}
</style>
