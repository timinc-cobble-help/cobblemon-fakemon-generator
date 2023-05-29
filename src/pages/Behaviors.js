import { useContext } from "react";
import {
  Stack,
  TextInput,
  MultiSelect,
  Select,
  Flex,
  Checkbox,
  Title,
} from "@mantine/core";
import { IconGenderMale, IconGenderFemale } from "@tabler/icons-react";
import Slider from "../components/TSlider";
import SelectedItem from "../components/SelectedItem";
import SelectItem from "../components/SelectItem";
import { MainFormContext } from "../context/MainForm";
import { lowercaseAlpha } from "../util/string";
import TSlider from "../components/TSlider";

export default function Behaviors() {
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
            {...getInputProps("canSwim")}
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
