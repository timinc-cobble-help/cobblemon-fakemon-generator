import { useContext } from "react";
import { NumberInput, Stack, TextInput } from "@mantine/core";
import { MainFormContext } from "../context/MainForm";

export default function Scales() {
  const { getInputProps } = useContext(MainFormContext);

  return (
    <Stack>
      <NumberInput
        label="In-Game Scale"
        type="number"
        step={0.1}
        precision={1}
        stepHoldDelay={500}
        stepHoldInterval={100}
        {...getInputProps("inGameScale")}
      />
      <NumberInput
        label="Hitbox Width"
        type="number"
        step={0.1}
        precision={1}
        stepHoldDelay={500}
        stepHoldInterval={100}
        {...getInputProps("hitboxWidth")}
      />
      <NumberInput
        label="Hitbox Height"
        type="number"
        step={0.1}
        precision={1}
        stepHoldDelay={500}
        stepHoldInterval={100}
        {...getInputProps("hitboxHeight")}
      />
    </Stack>
  );
}
