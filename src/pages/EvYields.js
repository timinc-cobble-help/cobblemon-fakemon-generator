import { useContext } from "react";
import { Stack, Checkbox, Title, NumberInput } from "@mantine/core";
import EvSlider from "../components/EvSlider";
import { MainFormContext } from "../context/MainForm";

export default function EvYields() {
  const {
    getInputProps,
    autoCalculate,
    autoCalculatedEvYields,
    splitAutoCalc,
    setSplitAutoCalc,
    setAutoCalculate,
  } = useContext(MainFormContext);

  return (
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
  );
}
