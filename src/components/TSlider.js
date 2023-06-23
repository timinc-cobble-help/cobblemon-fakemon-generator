import { Slider, Stack, Text } from "@mantine/core";

export default function TSlider({
  title,
  description,
  label,
  value,
  ...props
}) {
  return (
    <>
      <Stack spacing={0}>
        <Text fz="sm" sx={{ fontWeight: 500 }}>
          {title}
        </Text>
        <Text fz="xs" c="dimmed">
          {description}
        </Text>
        <Text>{typeof label === "function" ? label(value) : label}</Text>
      </Stack>
      <Slider {...props} value={value} label={null} />
    </>
  );
}
