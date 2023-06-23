import { useContext } from "react";
import { Stack, Checkbox, Title } from "@mantine/core";
import { MainFormContext } from "../context/MainForm";
import TSlider from "../components/TSlider";

export default function Behaviors() {
  const { getInputProps, values } = useContext(MainFormContext);

  return (
    <Stack>
      <Title>Behaviors</Title>
      <Checkbox
        label="Can this monster fall asleep?"
        {...getInputProps("canFallAsleep")}
      />
      {values.canFallAsleep && (
        <>
          <Checkbox
            label="Is this monster nocturnal?"
            {...getInputProps("isNocturnal")}
          />
          <TSlider
            title="Light level to fall asleep at (inverted if nocturnal)"
            min={0}
            max={15}
            inverted={!values.isNocturnal}
            {...getInputProps("sleepLightLevel")}
          />
        </>
      )}
      <Checkbox
        label="Will this monster sleep on a bed with the player?"
        {...getInputProps("willSleepOnBedWithPlayer")}
      />
      <Checkbox label="Can this monster walk?" {...getInputProps("canWalk")} />
      <Checkbox label="Can this monster swim?" {...getInputProps("canSwim")} />
      {values.canSwim && (
        <>
          <Checkbox
            label="Does this monster prefer water?"
            description="If this is true, this monster will run to the water. Think of fish."
            {...getInputProps("prefersWater")}
          />
          <Checkbox
            label="Can this monster breathe underwater?"
            {...getInputProps("canBreatheUnderwater")}
          />
        </>
      )}
      <Checkbox label="Can this monster fly?" {...getInputProps("canFly")} />
      <Checkbox
        label="Can this monster perch on your shoulder?"
        {...getInputProps("canShoulderMount")}
      />
      <Checkbox
        label="Can this monster look around?"
        {...getInputProps("canLookAround")}
      />
    </Stack>
  );
}
