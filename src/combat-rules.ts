import DamageSource from '@/damage-source'
import { clamp } from '@/util'

export default class CombatRules {
  public static getLifeDamageAfterAbsorb(damage: number, armor: number, armorToughness: number): number {
    return (damage * (1.0 / (armor * 0.025 + 1) / (armorToughness * 0.025 + 1)))
  }

  public static getLifeDamageAfterAbsorbWithDS(damageSource: DamageSource, damage: number, armor: number, armorToughness: number): number {
    if (!damageSource.bypassArmor) {
      return this.getLifeDamageAfterAbsorb(Math.fround(damage), Math.fround(armor), Math.fround(armorToughness))
    }
    return damage
  }

  public static getVanillaDamageAfterAbsorb(damage: number, armor: number, armorToughness: number): number {
    const f4 = 2.0 + armorToughness / 4.0
    const f5 = clamp(armor - damage / f4, armor * 0.2, 20.0)
    return damage * (1.0 - f5 / 25.0)
  }

  public static getVanillaDamageAfterAbsorbWithDS(damageSource: DamageSource, damage: number, armor: number, armorToughness: number): number {
    if (!damageSource.bypassArmor) {
      return this.getVanillaDamageAfterAbsorb(Math.fround(damage), Math.fround(Math.min(armor, 30)), Math.fround(Math.min(armorToughness, 20)))
    }
    return damage
  }

  public static getDamageAfterMagicAbsorb(damage: number, protectionLevel: number): number {
    const clamped = clamp(protectionLevel, 0, 20)
    return damage * (1.0 - clamped / 25.0)
  }

  public static getDamageAfterMagicAbsorbWithDS(damageSource: DamageSource, damage: number, resistanceLevel: number, protectionLevel: number) {
    if (damageSource.bypassMagic) {
      return damage
    }
    let dmg = damage
    if (resistanceLevel > 0 && damageSource != DamageSource.OUT_OF_WORLD) {
      const amplifier = resistanceLevel * 5
      const resistance = 25 - amplifier
      const f2 = dmg * Math.fround(resistance)
      dmg = Math.max(f2 / 25.0, 0.0)
    }

    if (dmg <= 0.0) {
      return 0.0
    } else if (damageSource.bypassEnchantments) {
      return dmg
    } else {
      if (protectionLevel > 0) {
        dmg = this.getDamageAfterMagicAbsorb(dmg, protectionLevel)
      }
      return dmg
    }
  }

  public static calculateFinalDamageLife(
    damageSource: DamageSource,
    damage: number,
    armor: number,
    armorToughness: number,
    resistanceLevel: number,
    protectionLevel: number,
  ): number {
    const damageAfterAbsorb = this.getLifeDamageAfterAbsorbWithDS(damageSource, damage, armor, armorToughness)
    return this.getDamageAfterMagicAbsorbWithDS(damageSource, damageAfterAbsorb, resistanceLevel, protectionLevel)
  }

  public static calculateFinalDamageVanilla(
    damageSource: DamageSource,
    damage: number,
    armor: number,
    armorToughness: number,
    resistanceLevel: number,
    protectionLevel: number,
  ): number {
    const damageAfterAbsorb = this.getVanillaDamageAfterAbsorbWithDS(damageSource, damage, armor, armorToughness)
    return this.getDamageAfterMagicAbsorbWithDS(damageSource, damageAfterAbsorb, resistanceLevel, protectionLevel)
  }
}
