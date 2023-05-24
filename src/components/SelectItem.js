import { Group, Avatar, Text } from "@mantine/core";
import { forwardRef } from "react";

const SelectItem = forwardRef(
  ({ image, label, description, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        {image && <Avatar src={image} />}

        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.65}>
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

export default SelectItem;
