import { useCallback, useContext, useState } from "react";
import {
  Box,
  Button,
  Card,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Switch,
  TextInput,
  Title,
} from "@mantine/core";
import { MainFormContext } from "../context/MainForm";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import SelectItem from "../components/SelectItem";

export default function Evolutions() {
  const {
    values,
    insertListItem,
    removeListItem,
    setFieldValue,
    moves,
    getInputProps,
    evoTypes,
    evoRequirementTypes,
    biomes,
    weatherTypes,
    timeRanges,
    types,
    moonPhases,
  } = useContext(MainFormContext);
  const [additionalBiomes, setAdditionalBiomes] = useState([]);

  const handleAdd = useCallback(() => {
    insertListItem("evolutions", {
      to: "",
      variant: "",
      resultTags: [],
      consumeHeldItem: false,
      learnableMoves: [],
      requiredContext: "",
      requirements: [],
    });
  }, []);

  return (
    <Stack>
      <Title>Evolutions</Title>
      {values.evolutions?.map(
        (
          { variant, resultTags = [], learnableMoves, requirements = [] },
          i
        ) => (
          <Card
            withBorder
            shadow="sm"
            padding="lg"
            radius="md"
            sx={{ overflow: "visible" }}
          >
            <Stack spacing="xs">
              <Select
                label="Evolution Type"
                description="What triggers this evolution?"
                data={evoTypes}
                value={variant}
                onChange={(val) =>
                  setFieldValue(`evolutions.${i}.variant`, val)
                }
              />
              <TextInput
                label="Evolves Into"
                {...getInputProps(`evolutions.${i}.to`)}
              />
              {variant === "block_click" && (
                <TextInput
                  label="Block Clicked"
                  description="Which block triggers this evolution?"
                  {...getInputProps(`evolutions.${i}.requiredContext`)}
                />
              )}
              {variant === "item_interact" && (
                <TextInput
                  label="Item Used"
                  description="Which item triggers this evolution?"
                  {...getInputProps(`evolutions.${i}.requiredContext`)}
                />
              )}
              <MultiSelect
                label="Result Tags"
                data={resultTags}
                creatable
                searchable
                clearable
                getCreateLabel={(query) => `+ Create ${query}`}
                multiple
                value={resultTags}
                onCreate={(newVal) => {
                  insertListItem(`evolutions.${i}.resultTags`, newVal);
                  return newVal;
                }}
                onChange={(newVal) =>
                  setFieldValue(`evolutions.${i}.resultTags`, newVal)
                }
              />
              <MultiSelect
                label="Learnable Moves"
                description="Moves learned when this evolution takes place"
                data={moves}
                value={learnableMoves}
                itemComponent={SelectItem}
                clearable
                searchable
                limit={20}
                onChange={(val) =>
                  setFieldValue(`evolutions.${i}.learnableMoves`, val)
                }
              />

              <Box
                sx={(theme) => ({
                  background:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[6]
                      : theme.colors.gray[0],
                  borderRadius: 5,
                  padding: theme.spacing.xs,
                })}
              >
                <Stack>
                  <Title order={2}>Requirements</Title>
                  {requirements?.map(({ variant }, j) => (
                    <Card
                      withBorder
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      sx={{ overflow: "visible" }}
                    >
                      <Stack>
                        <Select
                          label="Requirement Type"
                          data={evoRequirementTypes.filter(
                            (evoReqType) =>
                              !requirements.some(
                                (req, k) =>
                                  req.variant === evoReqType.value && k !== j
                              )
                          )}
                          {...getInputProps(
                            `evolutions.${i}.requirements.${j}.variant`
                          )}
                        />
                        {variant === "level" && (
                          <NumberInput
                            label="Level"
                            {...getInputProps(
                              `evolutions.${i}.requirements.${j}.minLevel`
                            )}
                          />
                        )}
                        {variant === "held_item" && (
                          <>
                            <TextInput
                              label="Item"
                              {...getInputProps(
                                `evolutions.${i}.requirements.${j}.item`
                              )}
                            />
                            <Switch
                              label="Consume"
                              description="Will this item be consumed when this evolution takes place?"
                              {...getInputProps(
                                `evolutions.${i}.consumeHeldItem`
                              )}
                            />
                          </>
                        )}
                        {variant === "biome" && (
                          <Select
                            label="Biome"
                            data={[...additionalBiomes, ...biomes]}
                            searchable
                            clearable
                            creatable
                            getCreateLabel={(query) => `+ Create ${query}`}
                            onCreate={(newVal) => {
                              setAdditionalBiomes((prev) => [...prev, newVal]);
                              setFieldValue(
                                `evolutions.${i}.requirements.${j}.biomeCondition`,
                                newVal
                              );
                            }}
                            {...getInputProps(
                              `evolutions.${i}.requirements.${j}.biomeCondition`
                            )}
                          />
                        )}
                        {variant === "weather" && (
                          <Select
                            label="Weather"
                            data={weatherTypes}
                            {...getInputProps(
                              `evolutions.${i}.requirements.${j}.weather`
                            )}
                          />
                        )}
                        {variant === "walked_steps" && (
                          <NumberInput
                            label="Amount"
                            {...getInputProps(
                              `evolutions.${i}.requirements.${j}.amount`
                            )}
                          />
                        )}
                        {variant === "time_range" && (
                          <Select
                            label="Range"
                            data={timeRanges}
                            {...getInputProps(
                              `evolutions.${i}.requirements.${j}.range`
                            )}
                          />
                        )}
                        {variant === "use_move" && (
                          <>
                            <Select
                              label="Move"
                              data={moves}
                              {...getInputProps(
                                `evolutions.${i}.requirements.${j}.move`
                              )}
                            />
                            <NumberInput
                              label="Amount"
                              {...getInputProps(
                                `evolutions.${i}.requirements.${j}.amount`
                              )}
                            />
                          </>
                        )}
                        {variant === "recoil" && (
                          <NumberInput
                            label="Amount"
                            {...getInputProps(
                              `evolutions.${i}.requirements.${j}.amount`
                            )}
                          />
                        )}
                        {variant === "party_member" && (
                          <TextInput
                            label="Party Member Description"
                            {...getInputProps(
                              `evolutions.${i}.requirements.${j}.target`
                            )}
                          />
                        )}
                        {variant === "properties" && (
                          <TextInput
                            label="Pokemon Properties"
                            {...getInputProps(
                              `evolutions.${i}.requirements.${j}.target`
                            )}
                          />
                        )}
                        {variant === "has_move_type" && (
                          <Select
                            label="Move Types"
                            data={types}
                            {...getInputProps(
                              `evolutions.${i}.requirements.${j}.type`
                            )}
                          />
                        )}
                        {variant === "moon_phase" && (
                          <Select
                            label="Moon Phase"
                            data={moonPhases}
                            {...getInputProps(
                              `evolutions.${i}.requirements.${j}.moonPhase`
                            )}
                          />
                        )}
                        <Button
                          onClick={() =>
                            removeListItem(`evolutions.${i}.requirements`, j)
                          }
                        >
                          <IconMinus />
                        </Button>
                      </Stack>
                    </Card>
                  ))}
                  <Button
                    onClick={() =>
                      insertListItem(`evolutions.${i}.requirements`, {
                        variant: "",
                      })
                    }
                    disabled={
                      !evoRequirementTypes.some(
                        ({ value }) =>
                          !requirements.some((req) => req.variant === value)
                      )
                    }
                  >
                    <IconPlus />
                  </Button>
                </Stack>
              </Box>

              <Button onClick={() => removeListItem("evolutions", i)}>
                <IconMinus />
              </Button>
            </Stack>
          </Card>
        )
      )}
      <Button onClick={handleAdd}>
        <IconPlus />
      </Button>
    </Stack>
  );
}
