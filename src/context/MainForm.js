import { useCallback, useMemo, useState, createContext } from "react";
import { useForm } from "@mantine/form";
import usePokeData from "../data/usePokeData";
import { camelCase } from "../util/string";
import downloadFile from "downloadfile-js";
import { exportToCobblemon } from "../util/export";

export const MainFormContext = createContext();

export function MainFormProvider({ children }) {
  const [disableStatLookup, setDisableStatLookup] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [splitAutoCalc, setSplitAutoCalc] = useState(true);
  const {
    types,
    abilities,
    catchRates,
    hatchRates,
    eggGroups,
    pokemon,
    getPokemonStats,
    levellingRates,
    moves,
    moveLearnTypes,
  } = usePokeData();

  const {
    getInputProps,
    values,
    setValues,
    onSubmit,
    setFieldValue,
    errors,
    insertListItem,
    removeListItem,
  } = useForm({
    initialValues: {
      name: "",
      types: [],
      abilities: [],
      hiddenAbility: "",
      catchRate: 150,
      hatchRate: 25,
      genderRatio: 50,
      genderless: false,
      eggGroups: [],
      hp: 1,
      attack: 1,
      defense: 1,
      specialAttack: 1,
      specialDefense: 1,
      speed: 1,
      evHp: 0,
      evAttack: 0,
      evDefense: 0,
      evSpecialAttack: 0,
      evSpecialDefense: 0,
      evSpeed: 0,
      evoStage: 1,
      experienceYield: 100,
      moves: [],
      inGameScale: 1,
      hitboxWidth: 1,
      hitboxHeight: 1,
      canFallAsleep: true,
      isNocturnal: false,
      sleepLightLevel: 4,
      willSleepOnBedWithPlayer: false,
      canWalk: true,
      canSwim: true,
      prefersWater: false,
      canBreatheUnderwater: false,
      canFly: false,
      canShoulderMount: false,
      canLookAround: false,
    },
    validate: {
      name: (v) => (v.length === 0 ? "Required" : null),
      types: (v) => (v.length === 0 ? "Required" : null),
      abilities: (v) => (v.length === 0 ? "Required" : null),
      eggGroups: (v) => (v.length === 0 ? "Required" : null),
    },
  });

  const autoCalculatedEvYields = useMemo(() => {
    const stats = {
      hp: values.hp,
      attack: values.attack,
      defense: values.defense,
      specialAttack: values.specialAttack,
      specialDefense: values.specialDefense,
      speed: values.speed,
    };
    const sorted = Object.entries(stats)
      .sort(([_n1, v1], [_n2, v2]) => v2 - v1)
      .reduce(
        (acc, [n, _v], i) => ({
          ...acc,
          [camelCase(`ev-${n}`)]:
            i <= (splitAutoCalc ? 1 : 0)
              ? splitAutoCalc
                ? i === 0
                  ? Math.ceil(values.evoStage / 2)
                  : Math.floor(values.evoStage / 2)
                : values.evoStage
              : 0,
        }),
        {}
      );
    return sorted;
  }, [
    splitAutoCalc,
    values.hp,
    values.attack,
    values.defense,
    values.specialAttack,
    values.specialDefense,
    values.speed,
    values.evoStage,
  ]);

  const handleStatLookup = useCallback(
    async (value) => {
      setDisableStatLookup(true);
      const stats = await getPokemonStats(value);
      setValues((prev) => ({ ...prev, ...stats }));
      setDisableStatLookup(false);
    },
    [getPokemonStats, setValues]
  );

  const handleDownload = useCallback(
    (values) => {
      const data = autoCalculate
        ? { ...values, ...autoCalculatedEvYields }
        : values;
      const exportData = exportToCobblemon(data);
      console.log(data, JSON.parse(exportData));
      downloadFile(exportData, `${values.name}.json`);
    },
    [autoCalculate, autoCalculatedEvYields]
  );

  const getPoolOfErrors = useCallback(
    (keys) => {
      return keys.reduce(
        (acc, key) =>
          errors[key] ? [...acc, { key, error: errors[key] }] : acc,
        []
      );
    },
    [errors]
  );

  return (
    <MainFormContext.Provider
      value={{
        handleDownload: onSubmit((values) => handleDownload(values)),
        getInputProps,
        values,
        pokemon,
        disableStatLookup,
        handleStatLookup,
        levellingRates,
        autoCalculate,
        autoCalculatedEvYields,
        splitAutoCalc,
        types,
        abilities,
        catchRates,
        hatchRates,
        eggGroups,
        setAutoCalculate,
        setSplitAutoCalc,
        setFieldValue,
        getPoolOfErrors,
        insertListItem,
        removeListItem,
        moves,
        moveLearnTypes,
      }}
    >
      {children}
    </MainFormContext.Provider>
  );
}
