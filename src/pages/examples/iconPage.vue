<template>
  <q-page class="q-pa-md">
    <q-input filled v-model="search" label="아이콘 검색..." dense class="q-mb-md" />
    <div class="icon-grid">
      <div v-for="icon in filteredIcons" :key="icon" class="icon-item">
        <q-icon :name="icon" size="32px" color="primary" />
        <div>{{ icon }}</div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const icons = [
      'home',
      'person',
      'warning',
      'notifications',
      'event',
      'photo_camera',
      'shopping_cart',
      'check_circle',
      'access_time',
      'cloud',
      'delete',
      'file_download',
      'email',
      'favorite',
      'info',
      'lightbulb',
      'lock',
      'search',
      'place',
      'menu',
      'chat',
      'phone',
      'add',
      'refresh',
      'settings',
      'star',
      'file_upload',
      'wifi',
      'alarm',
      'attachment',
      'camera_alt',
      'clear',
      'edit',
      'folder',
      'help',
      'keyboard',
      'location_on',
      'menu_open',
      'more_horiz',
      'thumb_up',
      'cloud_done',
      'cloud_off',
      'cloud_queue',
      'cloud_upload',
      'do_not_disturb',
      'downloads',
      'expand_more',
      'expand_less',
      'folder_open',
      'gavel',
      'group',
      'history',
      'image',
      'insert_drive_file',
      'language',
      'launch',
      'live_tv',
      'lock_open',
      'map',
      'more_vert',
      'music_note',
      'notification_important',
      'person_add',
      'photo',
      'place',
      'power_settings_new',
      'push_pin',
      'remove',
      'save',
      'search_off',
      'security',
      'share',
      'shopping_basket',
      'sms',
      'support',
      'swap_horiz',
      'text_fields',
      'text_format',
      'thumb_down',
      'toc',
      'top_app_bar',
      'touch_app',
      'translate',
      'trending_up',
      'visibility',
      'vpn_key',
      'wallet_giftcard',
      'watch_later',
      'work',
      'zoom_in',
      'zoom_out',
    ]

    const search = ref('')

    const filteredIcons = computed(() => {
      return icons.filter((icon) => icon.includes(search.value.toLowerCase()))
    })

    return { search, filteredIcons }
  },
})
</script>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}
.icon-item {
  text-align: center;
  padding: 10px;
}
</style>
