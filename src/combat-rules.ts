import DamageSource from '@/damage-source'

export default class CombatRules {
  private static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max))
  }

  public static getDamageAfterAbsorb(damage: number, armor: number, armorToughness: number): number {
    return (damage * (1.0 / (armor * 0.025 + 1) / (armorToughness * 0.025 + 1)))
  }

  public static getDamageAfterAbsorbWithDS(damageSource: DamageSource, damage: number, armor: number, armorToughness: number): number {
    if (!damageSource.bypassArmor) {
      return this.getDamageAfterAbsorb(Math.fround(damage), Math.fround(armor), Math.fround(armorToughness))
    }
    return damage
  }

  public static getDamageAfterMagicAbsorb(damage: number, protectionLevel: number): number {
    const clamped = this.clamp(protectionLevel, 0, 20)
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

  public static calculateFinalDamage(
    damageSource: DamageSource,
    damage: number,
    armor: number,
    armorToughness: number,
    resistanceLevel: number,
    protectionLevel: number,
  ): number {
    const damageAfterAbsorb = this.getDamageAfterAbsorbWithDS(damageSource, damage, armor, armorToughness)
    return this.getDamageAfterMagicAbsorbWithDS(damageSource, damageAfterAbsorb, resistanceLevel, protectionLevel)
  }
}
