<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
</script>

<template>
  <base-page>
    <v-select
      v-model="type"
      :items="Object.values(types)"
      label="計算式"
      @update:modelValue="onUpdate()"
    />
    <v-select
      v-model="damageSource"
      :items="Object.keys(damageSources)"
      label="ダメージの種類"
      @update:modelValue="onUpdate()"
    />
    <v-text-field
      v-model="damage"
      type="number"
      label="ダメージ"
      @update:modelValue="onUpdate()"
    />
    <v-text-field
      v-model="armor"
      type="number"
      label="防具(属性)"
      @update:modelValue="onUpdate()"
    />
    <v-text-field
      v-model="armorPercent"
      type="number"
      label="+防具%(属性)"
      suffix="%"
      @update:modelValue="onUpdate()"
    />
    <v-text-field
      v-model="armorToughness"
      type="number"
      label="防具強度(属性)"
      @update:modelValue="onUpdate()"
    />
    <v-text-field
      v-model="armorToughnessPercent"
      type="number"
      label="+防具強度%(属性)"
      suffix="%"
      @update:modelValue="onUpdate()"
    />
    <v-text-field
      v-model="resistance"
      type="number"
      label="耐性(ポーション効果)"
      hint="0で効果なし、1でAmplifier 0、2でAmplifier 1"
      aria-valuemin="0"
      @update:modelValue="onUpdate()"
    />
    <v-text-field
      v-model="protection"
      type="number"
      label="ダメージ軽減(エンチャント)"
      aria-valuemin="0"
      @update:modelValue="onUpdate()"
    />
    <v-divider style="margin-bottom: 35px;" />
    <v-text-field
      v-model="finalDamage"
      label="プレイヤーが受けるダメージ"
      hint="プラグインなどによって多少前後する可能性あり"
      :persistent-hint="true"
      readonly
    />
    <v-text-field
      v-model="reductionPercent"
      label="ダメージ軽減率"
      suffix="%"
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
import CombatRules from '@/combat-rules'
import DamageSource from '@/damage-source'
import { findValue } from '@/util'

export default defineComponent({
  name: 'App',

  mounted() {
    // try to read data from hash
    try {
      const data = JSON.parse(window.atob(location.hash.substring(1)))
      console.log(data)
      if (data.type && data.type in this.types) {
        this.type = this.types[data.type]
      }
      if (findValue(this.damageSources, data.damageSource)) {
        this.damageSource = findValue(this.damageSources, data.damageSource)
      }
      this.damage = data.damage
      this.armor = data.armor
      this.armorPercent = data.armorPercent
      this.armorToughness = data.armorToughness
      this.armorToughnessPercent = data.armorToughnessPercent
      this.resistance = data.resistance
      this.protection = data.protection
    } catch (e) {
      console.info('Failed to load data from hash', e)
    }
    this.onUpdate()
  },

  data: () => ({
    type: 'バニラ',
    damageSource: 'その他',
    damage: null,
    armor: null,
    armorPercent: null,
    armorToughness: null,
    armorToughnessPercent: null,
    resistance: null,
    protection: null,
    finalDamage: 0,
    reductionPercent: 0,
    toast: false,
    toastMessage: '',
    shareUrl: '',
    types: {
      'vanilla': 'バニラ',
      'life': 'Lifeサーバー',
    },
    // These values must be resolvable with DamageSource#valueOf (and this data should not be modified)
    damageSources: {
      'その他': 'Generic',
      '火の中': 'In fire',
      '雷': 'Lightning bolt',
      '炎上状態': 'On fire',
      '溶岩': 'Lava',
      'マグマブロックなど': 'Hot floor',
      '生き埋め': 'In wall',
      '圧死': 'Cramming',
      '溺死': 'Drown',
      '餓死': 'Starve',
      'サボテン': 'Cactus',
      '落下': 'Fall',
      '壁に飛び込み': 'Fly into wall',
      '奈落': 'Out of world',
      '魔法': 'Magic',
      'ウィザー': 'Wither',
      '金床': 'Anvil',
      '落下中のブロック': 'Falling block',
      'ドラゴンブレス': 'Dragon breath',
      'Dry out': 'Dry out',
      'スイートベリー': 'Sweet berry bush',
      '凍死': 'Freeze',
      '落下中の鍾乳石': 'Falling stalactite',
      '鍾乳石': 'Stalagmite',
      'プレイヤー': 'Player',
      'ウォーデンの波動攻撃': 'Sonic boom',
    },
  }),

  methods: {
    onUpdate() {
      const type = findValue(this.types, this.type) || 'vanilla'
      const damageSource = DamageSource.valueOf(this.damageSources[this.damageSource])
      const damage = this.damage || 0
      const rawArmor = this.armor || 0
      const rawArmorPercent = this.armorPercent || 0
      const rawArmorToughness = this.armorToughness || 0
      const rawArmorToughnessPercent = this.armorToughnessPercent || 0
      const armor = Math.max(0, rawArmor + (rawArmorPercent / 100 * rawArmor))
      const armorToughness = Math.max(0, rawArmorToughness + (rawArmorToughnessPercent / 100 * rawArmorToughness))
      const resistance = this.resistance || 0
      const protection = this.protection || 0
      if (type === 'life') {
        this.finalDamage = CombatRules.calculateFinalDamageLife(damageSource, damage, armor, armorToughness, resistance, protection)
      } else {
        this.finalDamage = CombatRules.calculateFinalDamageVanilla(damageSource, damage, armor, armorToughness, resistance, protection)
      }
      if (damage === 0) {
        this.reductionPercent = 0
      } else {
        this.reductionPercent = (1 - this.finalDamage / damage) * 100
      }
      location.hash = window.btoa(JSON.stringify({
        type,
        damageSource: this.damageSources[this.damageSource],
        damage,
        armor: rawArmor,
        armorPercent: rawArmorPercent,
        armorToughness: rawArmorToughness,
        armorToughnessPercent: rawArmorToughnessPercent,
        resistance,
        protection,
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
