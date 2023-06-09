import JSZip from "jszip";

function shakeUndefineds(obj) {
  return JSON.stringify(obj, null, 2);
}

const requirementParsers = {
  weather: ({ weather }) => ({
    variant: "weather",
    isRaining: weather === "raining" || weather === "thundering",
    isThundering: weather === "thundering",
  }),
};

function generateSpeciesFiles(data) {
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
        canSleep: data.canFallAsleep,
        depth: "normal",
        light: data.isNocturnal
          ? `${data.sleepLightLevel}-15`
          : `0-${data.sleepLightLevel}`,
        willSleepOnBed: data.willSleepOnBedWithPlayer,
      },
      moving: {
        canLook: data.canLookAround,
        walk: {
          canWalk: data.canWalk,
          avoidsLand: data.prefersWater,
        },
        swim: {
          swimSpeed: 0.3,
          canSwimInWater: data.canSwim,
          canBreatheUnderwater: data.canBreatheUnderwater,
        },
        fly: {
          canFly: data.canFly,
          flySpeedHorizontal: 0.3,
        },
        wanderChance: 1,
      },
    },
    catchRate: data.catchRate,
    maleRatio: data.genderless ? -1 : data.genderRatio / 100,
    shoulderMountable: data.canShoulderMount,

    baseExperienceYield: data.experienceYield,
    experienceGroup: data.growthRate,
    eggCycles: data.hatchRate,
    eggGroups: data.eggGroups,
    drops: {
      amount: data.dropAttempts,
      entries: data.drops.map(
        ({ name, quantityLow, quantityHigh, chance }) => ({
          item: name,
          quantityRange: `${quantityLow}-${quantityHigh}`,
          percentage: chance,
        })
      ),
    },
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
    evolutions: data.evolutions.map((evolution) => ({
      id: `${data.name}-${evolution.to}-${evolution.variant}`,
      variant: evolution.variant,
      result: `${[evolution.to, ...evolution.resultTags].join(" ")}`,
      consumeHeldItem: evolution.consumeHeldItem,
      learnableMoves: evolution.learnableMoves,
      requirements: evolution.requirements.map((req) =>
        req.variant in requirementParsers
          ? requirementParsers[req.variant](req)
          : req
      ),
      requiredContext: evolution.requiredContext,
    })),
  });
}

export function exportToCobblemon(data) {
  const zip = new JSZip();
  zip.file(
    `data/cobblemon/species/${data.name}.json`,
    generateSpeciesFiles(data),
    {
      createFolders: true,
    }
  );
  return zip.generateAsync({ type: "blob" });
}
