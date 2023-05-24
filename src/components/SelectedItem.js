import { Box, CloseButton } from "@mantine/core";

export default function SelectedItem({
  value,
  label,
  onRemove,
  classNames,
  color,
  ...others
}) {
  return (
    <div {...others}>
      <Box
        sx={(theme) => ({
          display: "flex",
          cursor: "default",
          alignItems: "center",
          backgroundColor: color,
          border: `1 solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.gray[4]
          }`,
          paddingLeft: theme.spacing.xs,
          borderRadius: theme.radius.sm
        })}
      >
        <Box sx={{ lineHeight: 1, fontSize: 12 }}>{label}</Box>
        <CloseButton
          onMouseDown={onRemove}
          variant="transparent"
          size={22}
          iconSize={14}
          tabIndex={-1}
        />
      </Box>
    </div>
  );
}
