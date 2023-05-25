import { useContext } from "react";
import { Stack, Select, Text, Title } from "@mantine/core";
import SelectItem from "../components/SelectItem";
import StatSlider from "../components/StatSlider";
import { MainFormContext } from "../context/MainForm";

export default function BaseStats() {
  const {
    getInputProps,
    pokemon,
    values,
    disableStatLookup,
    handleStatLookup,
    levellingRates,
  } = useContext(MainFormContext);

  return (
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
  );
}
