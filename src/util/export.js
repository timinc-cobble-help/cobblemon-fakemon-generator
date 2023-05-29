function shakeUndefineds(obj) {
  return JSON.stringify(obj, null, 2);
}

export function exportToCobblemon(data) {
  return shakeUndefineds({
    implemented: true,
    name: data.name,
    nationalPokedexNumber: 9999,
    primaryType: data.types[0],
    secondaryType: data.types[1],
    abilities: [
      ...data.abilities,
      data.hiddenAbility ? `h:${data.hiddenAbility}` : undefined,
    ],
    baseStats: {
      hp: data.hp,
      attack: data.attack,
      defence: data.defense,
      special_attack: data.specialAttack,
      special_defence: data.specialDefense,
      speed: data.speed,
    },
    behaviour: {
      resting: {
        canSleep: true,
        depth: "normal",
        light: "0-4",
      },
      moving: {
        canLook: false,
        walk: {
          canWalk: true,
          avoidsLand: false,
        },
        swim: {
          swimSpeed: 0.1,
          canSwimInWater: true,
          canBreatheUnderwater: false,
        },
        wanderChance: 1,
      },
    },
    catchRate: data.catchRate,
    maleRatio: data.genderless ? -1 : data.genderRatio / 100,
    shoulderMountable: false,

    baseExperienceYield: data.experienceYield,
    experienceGroup: data.growthRate,
    eggCycles: data.hatchRate,
    eggGroups: data.eggGroups,

    moves: [
      data.moves.map(
        ({ type, level, name }) => `${type === "level" ? level : type}:${name}`
      ),
    ],
    labels: ["custom"],
    pokedex: [
      `cobblemon.species.${data.name}.desc1`,
      `cobblemon.species.${data.name}.desc2`,
    ],

    baseScale: data.inGameScale,
    hitbox: {
      width: data.hitboxWidth,
      height: data.hitboxHeight,
      fixed: false,
    },
    baseFriendship: 50,
    evYield: {
      hp: data.evHp,
      attack: data.evAttack,
      defence: data.evDefense,
      special_attack: data.evSpecialAttack,
      special_defence: data.evSpecialDefense,
      speed: data.evSpeed,
    },
    height: 1,
    weight: 1,
  });
}
