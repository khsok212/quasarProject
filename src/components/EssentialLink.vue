<template>
  <q-item clickable v-if="isExternal" tag="a" target="_blank" :href="props.link">
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-item clickable v-else @click="navigateTo">
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: { type: String, required: true },
  caption: { type: String, default: '' },
  link: { type: String, default: '#' },
  icon: { type: String, default: '' },
})

const router = useRouter()

// 외부 링크인지 내부 라우트인지 판별
const isExternal = computed(() => props.link.startsWith('http') || props.link.startsWith('mailto'))

// 내부 라우트 이동 함수
const navigateTo = () => {
  if (!isExternal.value) {
    router.push(props.link)
  }
}
</script>
