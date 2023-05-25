import { useContext, useState } from "react";
import { Group, Stack, Button, Tabs } from "@mantine/core";
import { MainFormContext, MainFormProvider } from "./context/MainForm";
import BasicInfo from "./pages/BasicInfo";
import BaseStats from "./pages/BaseStates";
import EvYields from "./pages/EvYields";

function App() {
  const { handleDownload } = useContext(MainFormContext);

  return (
    <Tabs defaultValue="basic" sx={{ height: "100%" }}>
      <Stack component="form" onSubmit={handleDownload} h="100%">
        <Tabs.List>
          <Tabs.Tab value="basic">Basic Info</Tabs.Tab>
          <Tabs.Tab value="baseStats">Base Stats</Tabs.Tab>
          <Tabs.Tab value="evYields">EV Yields</Tabs.Tab>
        </Tabs.List>
        <Group align="center" position="center" grow sx={{ flexGrow: 1 }}>
          <Tabs.Panel value="basic">
            <BasicInfo />
          </Tabs.Panel>
          <Tabs.Panel value="baseStats">
            <BaseStats />
          </Tabs.Panel>
          <Tabs.Panel value="evYields">
            <EvYields />
          </Tabs.Panel>
        </Group>
        <Button type="submit">Download</Button>
      </Stack>
    </Tabs>
  );
}

export default function WrappedApp() {
  return (
    <MainFormProvider>
      <App />
    </MainFormProvider>
  );
}
