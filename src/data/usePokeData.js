import { useCallback, useEffect, useMemo, useState } from "react";
import types1 from "./types.json";
import types2 from "./types2.json";
import catchRates from "./catchRates.json";
import hatchRates from "./hatchRates.json";
import levellingRates from "./levellingRates.json";
import rawMoves from "./moves.json";
import moveLearnTypes from "./moveLearnTypes.json";
import { camelCase, capitalize } from "../util/string";

export default function usePokeData() {
  const [abilities, setAbilities] = useState([]);
  const [eggGroups, setEggGroups] = useState([]);
  const [pokemon, setPokemon] = useState([]);
  const [cachedStats, setCachedStats] = useState({});

  useEffect(() => {
    async function fetchAbilities() {
      const response = await fetch(
        "https://pokeapi.co/api/v2/ability?limit=100000"
      );
      const data = await response.json();
      setAbilities(
        data.results.map((e) => ({
          value: e.name.replace("-", ""),
          label: capitalize(e.name),
        }))
      );
    }
    fetchAbilities();
  }, []);

  useEffect(() => {
    async function fetchEggGroups() {
      const response = await fetch("https://pokeapi.co/api/v2/egg-group");
      const data = await response.json();
      setEggGroups(
        data.results.map((e) => ({ value: e.name, label: capitalize(e.name) }))
      );
    }
    fetchEggGroups();
  }, []);

  useEffect(() => {
    async function fetchPokemon() {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=10000"
      );
      const data = await response.json();
      setPokemon(data.results);
    }
    fetchPokemon();
  }, []);

  const types = useMemo(
    () =>
      types1.map((type1) => ({
        ...type1,
        ...types2.find((type2) => type2.label === type1.label),
      })),
    []
  );

  const moves = useMemo(
    () =>
      rawMoves.map(({ type, ...props }) => ({
        ...props,
        image: types1.find((type1) => type1.label === type).image,
        color: types2.find((type2) => type2.label === type).color,
      })),
    []
  );

  const getPokemonStats = useCallback(
    async (pokemonName) => {
      if (cachedStats[pokemonName]) return cachedStats[pokemonName];

      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/" + pokemonName
      );
      const data = await response.json();
      const stats = data.stats.reduce(
        (acc, { base_stat, stat: { name } }) => ({
          ...acc,
          [camelCase(name)]: base_stat,
        }),
        {}
      );
      setCachedStats((prev) => ({ ...prev, [pokemonName]: stats }));
      return stats;
    },
    [cachedStats]
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
  };
}
