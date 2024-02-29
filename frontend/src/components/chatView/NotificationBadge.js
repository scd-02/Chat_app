import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const custom = defineStyle({
  backgroundColor: "red",
  color: "white",
  fontFamily: "serif",
  fontWeight: "normal",
  border: "1px solid", // change the appearance of the border
  borderRadius: "50%", // remove the border radius
});

export const NotificationBadge = defineStyleConfig({
  variants: {
    custom: custom,
  },
});
