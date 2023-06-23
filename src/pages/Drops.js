import { useCallback, useContext } from "react";
import {
  Button,
  Card,
  Flex,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { MainFormContext } from "../context/MainForm";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import TSlider from "../components/TSlider";

export default function Drops() {
  const {
    values,
    insertListItem,
    removeListItem,
    setFieldValue,
    getInputProps,
  } = useContext(MainFormContext);

  const handleAdd = useCallback(() => {
    insertListItem("drops", {
      name: "",
      quantityLow: 1,
      quantityHigh: 2,
      chance: 50,
    });
  }, []);

  return (
    <Stack>
      <Title>Drops</Title>
      {values.drops.map(({ quantityLow, quantityHigh, chance }, i) => (
        <Card
          withBorder
          shadow="sm"
          padding="lg"
          radius="md"
          sx={{ overflow: "visible" }}
        >
          <Stack spacing="xs">
            <TextInput
              label="Item ID"
              placeholder="minecraft:string"
              onChange={(e) => setFieldValue(`drops.${i}.name`, e.target.value)}
            />
            <Text>Quantity</Text>
            <Flex gap="xs">
              <NumberInput
                min={1}
                value={quantityLow}
                onChange={(val) => {
                  setFieldValue(`drops.${i}.quantityLow`, val);
                  if (quantityHigh < val) {
                    setFieldValue(`drops.${i}.quantityHigh`, val);
                  }
                }}
              />
              <NumberInput
                min={quantityLow}
                value={quantityHigh}
                onChange={(val) =>
                  setFieldValue(`drops.${i}.quantityHigh`, val)
                }
              />
            </Flex>
            <TSlider
              title="Chance"
              min={1}
              max={100}
              value={chance}
              onChange={(val) => setFieldValue(`drops.${i}.chance`, val)}
            />
            <Button onClick={() => removeListItem("drops", i)}>
              <IconMinus />
            </Button>
          </Stack>
        </Card>
      ))}
      <Button onClick={handleAdd}>
        <IconPlus />
      </Button>
      <NumberInput label="Drop Attempts" {...getInputProps("dropAttempts")} />
    </Stack>
  );
}
