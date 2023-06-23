import { useContext } from "react";
import {
  Stack,
  TextInput,
  MultiSelect,
  Select,
  Flex,
  Checkbox,
  NumberInput,
} from "@mantine/core";
import { IconGenderMale, IconGenderFemale } from "@tabler/icons-react";
import Slider from "../components/TSlider";
import SelectedItem from "../components/SelectedItem";
import SelectItem from "../components/SelectItem";
import { MainFormContext } from "../context/MainForm";
import { lowercaseAlpha } from "../util/string";

export default function BasicInfo() {
  const {
    getInputProps,
    types,
    abilities,
    catchRates,
    hatchRates,
    values,
    eggGroups,
    setFieldValue,
  } = useContext(MainFormContext);

  return (
    <Stack>
      <TextInput
        label="Name"
        {...getInputProps("name")}
        onChange={(e) => setFieldValue("name", lowercaseAlpha(e.target.value))}
      />
      <NumberInput
        label="Pokedex Number"
        {...getInputProps("nationalPokedexNumber")}
      />
      <MultiSelect
        label="Types"
        data={types}
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
  );
}
