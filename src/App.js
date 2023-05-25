import {
  Group,
  Stack,
  TextInput,
  MultiSelect,
  Select,
  Text,
  Flex,
  Checkbox,
  Title,
  NumberInput,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconGenderMale, IconGenderFemale } from "@tabler/icons-react";
import Slider from "./components/TSlider";
import SelectedItem from "./components/SelectedItem";
import SelectItem from "./components/SelectItem";
import usePokeData from "./data/usePokeData";
import { useCallback, useEffect, useMemo, useState } from "react";
import { camelCase, lowercaseAlpha } from "./util/string";
import EvSlider from "./components/EvSlider";
import StatSlider from "./components/StatSlider";
import downloadFile from "downloadfile-js";
import { exportToCobblemon } from "./util/export";

export default function App() {
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
  } = usePokeData();

  const { getInputProps, values, setValues, onSubmit, setFieldValue } = useForm(
    {
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
      },
      validate: {
        name: (v) => (v.length === 0 ? "Required" : null),
        types: (v) => (v.length === 0 ? "Required" : null),
        abilities: (v) => (v.length === 0 ? "Required" : null),
        eggGroups: (v) => (v.length === 0 ? "Required" : null),
      },
    }
  );

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

  return (
    <Stack
      component="form"
      onSubmit={onSubmit((values) => handleDownload(values))}
      h="100%"
    >
      <Group align="start" grow sx={{ flexGrow: 1 }}>
        <Stack>
          <TextInput
            label="Name"
            {...getInputProps("name")}
            onChange={(e) =>
              setFieldValue("name", lowercaseAlpha(e.target.value))
            }
          />
          <MultiSelect
            label="Types"
            data={types}
            itemComponent={SelectItem}
            valueComponent={SelectedItem}
            clearable
            searchable
            maxSelectedValues={2}
            {...getInputProps("types")}
          />
          <MultiSelect
            label="Abilities"
            data={abilities}
            clearable
            searchable
            maxSelectedValues={2}
            {...getInputProps("abilities")}
          />
          <Select
            label="Hidden Ability"
            data={abilities}
            searchable
            {...getInputProps("hiddenAbility")}
          />
          <Slider
            title="Catch Rate"
            label={(val) =>
              `${
                catchRates.find((cr) => cr.min <= val && cr.max >= val).label
              } (${val})`
            }
            min={1}
            max={255}
            marks={catchRates.slice(1).map((e) => ({ value: e.min }))}
            {...getInputProps("catchRate")}
          />
          <Slider
            title="Hatch Rate"
            label={(val) =>
              `${
                hatchRates.find((cr) => cr.min <= val && cr.max >= val).label
              } (${val})`
            }
            min={1}
            max={150}
            marks={hatchRates.slice(1).map((e) => ({ value: e.min }))}
            {...getInputProps("hatchRate")}
          />
          <Slider
            title="Gender Ratio"
            label={(val) => (
              <Flex>
                {val} <IconGenderMale size="1rem" /> / {100 - val}{" "}
                <IconGenderFemale size="1rem" />
              </Flex>
            )}
            min={0}
            max={100}
            marks={[{ value: 50 }]}
            disabled={values.genderless}
            {...getInputProps("genderRatio")}
          />
          <Checkbox label="Genderless" {...getInputProps("genderless")} />
          <MultiSelect
            label="Egg Groups"
            data={eggGroups}
            maxSelectedValues={2}
            clearable
            searchable
            {...getInputProps("eggGroups")}
          />
        </Stack>
        <Stack>
          <Title>Base Stats</Title>
          <StatSlider statName="HP" {...getInputProps("hp")} />
          <StatSlider statName="Attack" {...getInputProps("attack")} />
          <StatSlider statName="Defense" {...getInputProps("defense")} />
          <StatSlider
            statName="Special Attack"
            {...getInputProps("specialAttack")}
          />
          <StatSlider
            statName="Special Defense"
            {...getInputProps("specialDefense")}
          />
          <StatSlider statName="Speed" {...getInputProps("speed")} />
          <Text>
            Total:{" "}
            {values.hp +
              values.attack +
              values.defense +
              values.specialAttack +
              values.specialDefense +
              values.speed}
          </Text>
          <Select
            label="Copy Existing"
            data={pokemon.map((e) => ({
              value: e.name,
              label: e.name,
            }))}
            searchable
            disabled={disableStatLookup}
            onChange={handleStatLookup}
          />
          <Select
            label="Leveling Rate"
            data={levellingRates}
            itemComponent={SelectItem}
          />
        </Stack>
        <Stack>
          <Stack spacing={0}>
            <Title>EV Yields</Title>
          </Stack>
          <EvSlider
            statName="HP"
            disabled={autoCalculate}
            inputProps={getInputProps("evHp")}
            calcedValue={autoCalculatedEvYields.evHp}
          />
          <EvSlider
            statName="Attack"
            disabled={autoCalculate}
            inputProps={getInputProps("evAttack")}
            calcedValue={autoCalculatedEvYields.evAttack}
          />
          <EvSlider
            statName="Defense"
            disabled={autoCalculate}
            inputProps={getInputProps("evDefense")}
            calcedValue={autoCalculatedEvYields.evDefense}
          />
          <EvSlider
            statName="Special Attack"
            disabled={autoCalculate}
            inputProps={getInputProps("evSpecialAttack")}
            calcedValue={autoCalculatedEvYields.evSpecialAttack}
          />
          <EvSlider
            statName="Special Defense"
            disabled={autoCalculate}
            inputProps={getInputProps("evSpecialDefense")}
            calcedValue={autoCalculatedEvYields.evSpecialDefense}
          />
          <EvSlider
            statName="Speed"
            disabled={autoCalculate}
            inputProps={getInputProps("evSpeed")}
            calcedValue={autoCalculatedEvYields.evSpeed}
          />
          <Checkbox
            label="Auto-Calculate"
            onChange={(e) => setAutoCalculate(e.target.checked)}
            checked={autoCalculate}
          />
          <Checkbox
            label="Split"
            disabled={!autoCalculate}
            onChange={(e) => setSplitAutoCalc(e.target.checked)}
            checked={splitAutoCalc}
          />
          <NumberInput
            label="Evo Stage"
            min={1}
            max={3}
            {...getInputProps("evoStage")}
          />
          <NumberInput
            label="Experience Yield"
            {...getInputProps("experienceYield")}
          />
        </Stack>
      </Group>
      <Button type="submit">Download</Button>
    </Stack>
  );
}
