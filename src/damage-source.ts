export default class DamageSource {
  public static readonly IN_FIRE = new DamageSource('inFire').apply((source) => {
    source._bypassArmor = true
  })
  public static readonly LIGHTNING_BOLT = new DamageSource('lightningBolt')
  public static readonly ON_FIRE = new DamageSource('onFire').apply((source) => {
    source._bypassArmor = true
  })
  public static readonly LAVA = new DamageSource('lava')
  public static readonly HOT_FLOOR = new DamageSource('hotFloor')
  public static readonly IN_WALL = new DamageSource('inWall').apply((source) => {
    source._bypassArmor = true
  })
  public static readonly CRAMMING = new DamageSource('cramming').apply((source) => {
    source._bypassArmor = true
  })
  public static readonly DROWN = new DamageSource('drown').apply((source) => {
    source._bypassArmor = true
  })
  public static readonly STARVE = new DamageSource('starve').apply((source) => {
    source._bypassArmor = true
    source._bypassMagic = true
  })
  public static readonly CACTUS = new DamageSource('cactus')
  public static readonly FALL = new DamageSource('fall').apply((source) => {
    source._bypassArmor = true
  })
  public static readonly FLY_INTO_WALL = new DamageSource('flyIntoWall').apply((source) => {
    source._bypassArmor = true
  })
  public static readonly OUT_OF_WORLD = new DamageSource('outOfWorld').apply((source) => {
    source._bypassArmor = true
  })
  public static readonly GENERIC = new DamageSource('generic')
  public static readonly MAGIC = new DamageSource('magic').apply((source) => {
    source._bypassArmor = true
  })
  public static readonly WITHER = new DamageSource('wither').apply((source) => {
    source._bypassArmor = true
  })
  public static readonly ANVIL = new DamageSource('anvil')
  public static readonly FALLING_BLOCK = new DamageSource('fallingBlock')
  public static readonly DRAGON_BREATH = new DamageSource('dragonBreath').apply((source) => {
    source._bypassArmor = true
  })
  public static readonly DRY_OUT = new DamageSource('dryout')
  public static readonly SWEET_BERRY_BUSH = new DamageSource('sweetBerryBush')
  public static readonly FREEZE = new DamageSource('freeze').apply((source) => {
    source._bypassArmor = true
  })
  public static readonly FALLING_STALACTITE = new DamageSource('fallingStalactite')
  public static readonly STALAGMITE = new DamageSource('stalagmite').apply((source) => {
    source._bypassArmor = true
  })

  public static readonly PLAYER = new DamageSource('player')
  public static readonly SONIC_BOOM = new DamageSource('sonic_boom').apply((source) => {
    source._bypassEnchantments = true
  })

  public static readonly KEYS: string[] =
    Object.getOwnPropertyNames(DamageSource).filter((key) => key.toUpperCase() === key)

  /**
   * Attempt to get a DamageSource by its name and returns GENERIC if not found.
   * @param name The name of the DamageSource. May be lowercase or uppercase and may contain spaces.
   */
  public static valueOf(name: string): DamageSource {
    const upper = name.toUpperCase().replace(' ', '_')
    if (DamageSource.KEYS.includes(upper)) {
      const key = upper as keyof typeof DamageSource
      return <DamageSource>DamageSource[key]
    }
    return DamageSource.GENERIC
  }

  public readonly name: string
  private _bypassArmor = false
  private _bypassMagic = false
  private _bypassEnchantments = false

  constructor(name: string) {
    this.name = name
  }

  public get bypassArmor(): boolean {
    return this._bypassArmor
  }

  public get bypassMagic(): boolean {
    return this._bypassMagic
  }

  public get bypassEnchantments(): boolean {
    return this._bypassEnchantments
  }

  private apply(fn: (source: DamageSource) => unknown): DamageSource {
    fn(this)
    return this
  }
}
