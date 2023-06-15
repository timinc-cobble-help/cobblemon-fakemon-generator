import { useCallback, useEffect, useMemo, useState } from "react";
import catchRates from "./catchRates.json";
import hatchRates from "./hatchRates.json";
import levellingRates from "./levellingRates.json";
import evoTypes from "./evoTypes.json";
import evoRequirementTypes from "./evoRequirementTypes.json";
import moveLearnTypes from "./moveLearnTypes.json";
import weatherTypes from "./weather.json";
import worlds from "./worlds.json";
import { fetchDirectory, fetchFile } from "./gitlab";
import { capitalize } from "../util/string";
import { useLocalStorage } from "@mantine/hooks";

const eggGroupRegex = /([0-9A-Z_]+)\(\"(.+)\"\),/;
const moonPhaseRegex = /([A-Z_]+)[,;]/;
const timeRangeRegex =
  /"([a-z]+)" to TimeRange\(((?:[0-9]+\.\.[0-9]+(?:, )*)*)\)/;

export default function usePokeData() {
  const [langData, setLangData] = useLocalStorage({
    key: "langData",
    defaultValue: null,
  });
  const [cachedPokemonRefs, setCachedPokemonRefs] = useLocalStorage({
    key: "cachedPokemonRefs",
    defaultValue: [],
  });
  const [cachedPokemonData, setCachedPokemonData] = useLocalStorage({
    key: "cachedPokemonData",
    defaultValue: {},
  });
  const [biomes, setBiomes] = useLocalStorage({
    key: "biomes",
    defaultValue: [],
  });
  const [eggGroups, setEggGroups] = useLocalStorage({
    key: "eggGroups",
    defaultValue: [],
  });
  const [moonPhases, setMoonPhases] = useLocalStorage({
    key: "moonPhases",
    defaultValue: [],
  });
  const [timeRanges, setTimeRanges] = useLocalStorage({
    key: "timeRanges",
    defaultValue: [],
  });

  const huntForPokemon = useCallback(
    async (pokemonName) => {
      const currentKnownPokemon = [...cachedPokemonRefs];
      while (
        !currentKnownPokemon.some(({ name }) => name === `${pokemonName}.json`)
      ) {
        const data = await fetchDirectory(
          "common/src/main/resources/data/cobblemon/species",
          { page: currentKnownPokemon.length / 20 + 1, recursive: true }
        );
        if (data.length === 0)
          throw new Error("Pokemon not found: " + pokemonName);
        currentKnownPokemon.push(...data);
      }
      setCachedPokemonRefs(currentKnownPokemon);
      return currentKnownPokemon.find(
        ({ name }) => name === `${pokemonName}.json`
      );
    },
    [cachedPokemonRefs]
  );

  useEffect(() => {
    async function fetchLangData() {
      const data = await fetchFile(
        "common/src/main/resources/assets/cobblemon/lang/en_us.json"
      );
      setLangData(data);
    }
    fetchLangData();
  }, []);

  useEffect(() => {
    async function fetchBiomes() {
      const data = await fetchDirectory(
        "common/src/main/resources/data/cobblemon/tags/worldgen/biome",
        { pageSize: 100 }
      );
      setBiomes(
        data
          .filter(({ type }) => type === "blob")
          .map(({ name }) => ({
            label: capitalize(name.split(".")[0].split("_").pop()),
            value: `#cobblemon:${name.split(".")[0]}`,
          }))
          .sort((a, b) => (a.value > b.value ? 1 : -1))
      );
    }
    fetchBiomes();
  }, []);

  useEffect(() => {
    async function fetchEggGroups() {
      const data = await fetchFile(
        "common/src/main/kotlin/com/cobblemon/mod/common/api/pokemon/egg/EggGroup.kt",
        { type: "text" }
      );
      setEggGroups(
        data
          .split("\n")
          .filter((line) => eggGroupRegex.test(line))
          .map((line) => ({
            value: line.match(eggGroupRegex)[1].toLowerCase(),
            label: line.match(eggGroupRegex)[2],
          }))
          .sort((a, b) => (a.value > b.value ? 1 : -1))
      );
    }
    fetchEggGroups();
  }, []);

  useEffect(() => {
    async function fetchMoonPhases() {
      const data = await fetchFile(
        "common/src/main/kotlin/com/cobblemon/mod/common/api/spawning/condition/MoonPhase.kt",
        { type: "text" }
      );
      setMoonPhases(
        data
          .split("\n")
          .filter((line) => moonPhaseRegex.test(line))
          .map((line) => ({
            value: line.match(moonPhaseRegex)[1],
            label: capitalize(line.match(moonPhaseRegex)[1].toLowerCase()),
          }))
      );
    }
    fetchMoonPhases();
  }, []);

  useEffect(() => {
    async function fetchTimeRanges() {
      const data = await fetchFile(
        "common/src/main/kotlin/com/cobblemon/mod/common/api/spawning/TimeRange.kt",
        { type: "text" }
      );
      setTimeRanges(
        data
          .split("\n")
          .filter((line) => timeRangeRegex.test(line))
          .map((line) => {
            const match = line.match(timeRangeRegex);
            return {
              value: match[1],
              label: capitalize(match[1].toLowerCase()),
              description: match[2]
                .split(", ")
                .map((e) => e.match(/(\d+)\.\.(\d+)/))
                .sort((a, b) => +a[1] - +b[1])
                .map((e) => `${e[1]} to ${e[2]}`)
                .join(", "),
            };
          })
          .filter(({ value }) => value !== "any")
          .sort((a, b) => (a.value > b.value ? 1 : -1))
      );
    }
    fetchTimeRanges();
  }, []);

  const abilities = useMemo(() => {
    if (!langData) return [];
    return Object.entries(langData)
      .filter(([k]) => {
        return /cobblemon\.ability\.[^.]+$/.test(k);
      })
      .map(([k, v]) => ({
        value: k.match(/cobblemon\.ability\.([^.]+)$/)[1],
        label: v,
      }));
  }, [langData]);

  const moves = useMemo(() => {
    if (!langData) return [];
    return Object.entries(langData)
      .filter(([k]) => {
        return /cobblemon\.move\.[^.]+$/.test(k);
      })
      .map(([k, v]) => ({
        value: k.match(/cobblemon\.move\.([^.]+)$/)[1],
        label: v,
      }));
  }, [langData]);

  const pokemon = useMemo(() => {
    if (!langData) return [];
    return Object.entries(langData)
      .filter(([k]) => {
        return /cobblemon\.species\.[^.]+\.name/.test(k);
      })
      .map(([k, v]) => ({
        value: k.match(/cobblemon\.species\.([^.]+)\.name/)[1],
        label: v,
      }));
  }, [langData]);

  const types = useMemo(() => {
    if (!langData) return [];
    return Object.entries(langData)
      .filter(([k]) => {
        return /cobblemon\.type\.[^.]+$/.test(k);
      })
      .map(([k, v]) => ({
        value: k.match(/cobblemon\.type\.([^.]+)$/)[1],
        label: v,
      }));
  }, [langData]);

  const getPokemonStats = useCallback(
    async (pokemonName) => {
      if (cachedPokemonData[pokemonName])
        return cachedPokemonData[pokemonName].baseStats;

      const matchingPokemon = await huntForPokemon(pokemonName);
      const data = await fetchFile(matchingPokemon.path);
      setCachedPokemonData((prev) => ({ ...prev, [pokemonName]: data }));
      return {
        ...data.baseStats,
        defense: data.baseStats.defence,
        specialAttack: data.baseStats.special_attack,
        specialDefense: data.baseStats.special_defence,
      };
    },
    [cachedPokemonData]
  );

  return {
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
    evoTypes,
    evoRequirementTypes,
    biomes,
    weatherTypes,
    timeRanges,
    moonPhases,
    worlds,
  };
}
