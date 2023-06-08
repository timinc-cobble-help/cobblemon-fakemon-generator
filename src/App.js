import { useContext, useState } from "react";
import {
  Group,
  Stack,
  Button,
  Tabs,
  Text,
  Modal,
  ScrollArea,
  MantineProvider,
} from "@mantine/core";
import { MainFormContext, MainFormProvider } from "./context/MainForm";
import BasicInfo from "./pages/BasicInfo";
import BaseStats from "./pages/BaseStates";
import EvYields from "./pages/EvYields";
import Moves from "./pages/Moves";
import Scales from "./pages/Scales";
import Behaviors from "./pages/Behaviors";
import Drops from "./pages/Drops";
import Evolutions from "./pages/Evolutions";

function App() {
  const { handleDownload, getPoolOfErrors, reset } =
    useContext(MainFormContext);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    reset();
    setConfirmReset(false);
  };

  return (
    <>
      <Tabs defaultValue="basic" sx={{ height: "100%" }}>
        <Stack component="form" onSubmit={handleDownload} h="100%">
          <Tabs.List>
            <Tabs.Tab value="basic">
              <Text
                color={
                  getPoolOfErrors(["name", "types", "abilities", "eggGroups"])
                    .length
                    ? "red"
                    : undefined
                }
              >
                Basic Info
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="baseStats">Base Stats</Tabs.Tab>
            <Tabs.Tab value="evYields">EV Yields</Tabs.Tab>
            <Tabs.Tab value="moves">Moves</Tabs.Tab>
            <Tabs.Tab value="scales">Scales</Tabs.Tab>
            <Tabs.Tab value="behaviors">Behaviors</Tabs.Tab>
            <Tabs.Tab value="drops">Drops</Tabs.Tab>
            <Tabs.Tab value="evolutions">Evolutions</Tabs.Tab>
          </Tabs.List>
          <Group
            align="start"
            position="center"
            sx={{
              flexGrow: 1,
              flexBasis: 0,
              minHeight: 0,
              "&>*": {
                width: "100%",
                maxWidth: 1000,
              },
            }}
          >
            <ScrollArea h="100%">
              <Tabs.Panel value="basic">
                <BasicInfo />
              </Tabs.Panel>
              <Tabs.Panel value="baseStats">
                <BaseStats />
              </Tabs.Panel>
              <Tabs.Panel value="evYields">
                <EvYields />
              </Tabs.Panel>
              <Tabs.Panel value="moves">
                <Moves />
              </Tabs.Panel>
              <Tabs.Panel value="scales">
                <Scales />
              </Tabs.Panel>
              <Tabs.Panel value="behaviors">
                <Behaviors />
              </Tabs.Panel>
              <Tabs.Panel value="drops">
                <Drops />
              </Tabs.Panel>
              <Tabs.Panel value="evolutions">
                <Evolutions />
              </Tabs.Panel>
            </ScrollArea>
          </Group>
          <Group grow>
            <Button type="submit">Download</Button>
            <Button color="yellow" onClick={() => setConfirmReset(true)}>
              Reset
            </Button>
          </Group>
        </Stack>
      </Tabs>
      {confirmReset && (
        <Modal
          opened={confirmReset}
          onClose={() => setConfirmReset(false)}
          title="Are you sure you want to reset?"
          centered
          styles={{ inner: { width: "90vw" } }}
        >
          <Group grow>
            <Button color="red" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={() => setConfirmReset(false)}>Cancel</Button>
          </Group>
        </Modal>
      )}
    </>
  );
}

export default function WrappedApp() {
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <MainFormProvider>
        <App />
      </MainFormProvider>
    </MantineProvider>
  );
}
