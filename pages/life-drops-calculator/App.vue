<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
</script>

<template>
  <base-page>
    <v-text-field
      v-model="dropRate"
      type="number"
      label="元のドロップ率"
      aria-valuemin="10"
      suffix="%"
      @update:modelValue="onUpdate()"
    />
    <v-text-field
      v-model="luck"
      type="number"
      label="運(属性)"
      aria-valuemin="0"
      hint="Luck属性の値"
      @update:modelValue="onUpdate()"
    />
    <v-text-field
      v-model="luckPercent"
      type="number"
      label="+運(属性)%"
      aria-valuemin="0"
      suffix="%"
      @update:modelValue="onUpdate()"
    />
    <v-checkbox
      v-model="enforceLuckCap"
      label="運の上限(±1024)を強制する"
      @update:modelValue="onUpdate()"
    />
    <v-text-field
      v-model="boostRate"
      type="number"
      label="ブースト倍率"
      aria-valuemin="1"
      suffix="倍"
      @update:modelValue="onUpdate()"
    />
    <v-divider style="margin-bottom: 35px;" />
    <v-text-field
      v-model="finalDropRate"
      label="ドロップ率"
      suffix="%"
      :persistent-hint="true"
      readonly
    />
    <v-text-field
      v-model="shareUrl"
      label="共有URL"
      readonly
    >
      <template v-slot:prepend>
        <v-icon icon="mdi-content-copy" @click="copyToClipboard(shareUrl)"/>
      </template>
    </v-text-field>
    <v-snackbar v-model="toast" color="white">
      {{ toastMessage }}

      <template v-slot:actions>
        <v-btn
          color="black"
          variant="text"
          @click="toast = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </base-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { clamp } from '@/util'

export default defineComponent({
  name: 'App',

  mounted() {
    // try to read data from hash
    try {
      const data = JSON.parse(window.atob(location.hash.substring(1)))
      this.dropRate = data.dropRate
      this.luck = data.luck
      this.luckPercent = data.luckPercent
      this.enforceLuckCap = data.enforceLuckCap
      this.boostRate = data.boostRate
    } catch (e) {
      console.info('Failed to load data from hash', e)
    }
    this.onUpdate()
  },

  data: () => ({
    dropRate: 10,
    luck: 0,
    luckPercent: 0,
    enforceLuckCap: true,
    boostRate: 1,
    finalDropRate: 0,
    toast: false,
    toastMessage: '',
    shareUrl: '',
  }),

  methods: {
    onUpdate() {
      const dropRate = this.dropRate || 0
      const rawLuck = this.luck || 0
      const rawLuckPercent = this.luckPercent || 0
      let luck = rawLuck + (rawLuckPercent / 100 * rawLuck)
      if (this.enforceLuckCap) {
        // In vanilla, the luck value is capped at -1024 and 1024
        luck = clamp(luck, -1024, 1024)
      }
      const boostRate = this.boostRate || 1
      const giveMultiplier = Math.round((100 + luck) * boostRate)
      this.finalDropRate = Math.round(giveMultiplier * (dropRate / 100) * 100) / 100
      location.hash = window.btoa(JSON.stringify({
        dropRate,
        luck: rawLuck,
        luckPercent: rawLuckPercent,
        enforceLuckCap: this.enforceLuckCap,
        boostRate,
      }))
      this.shareUrl = location.href
    },
    copyToClipboard(text: string) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.toast = true
          this.toastMessage = 'URLをコピーしました'
        })
    },
  },
})
</script>
