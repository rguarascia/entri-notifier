import { ReactNode } from "react";
import { styled } from "@nextui-org/react";

// Badge component will be available as part of the core library soon
export const StyledBadge = styled("span", {
  display: "inline-block",
  textTransform: "uppercase",
  padding: "$2 $3",
  fontSize: "10px",
  fontWeight: "$bold",
  borderRadius: "14px",
  letterSpacing: "0.6px",
  lineHeight: 1,
  boxShadow: "1px 2px 5px 0px rgb(0 0 0 / 5%)",
  alignItems: "center",
  alignSelf: "center",
  width: "fit-content",
  color: "$white",
  variants: {
    status: {
      active: {
        bg: "$successLight",
        color: "$success",
      },
      paused: {
        bg: "$errorLight",
        color: "$error",
      },
      vacation: {
        bg: "$warningLight",
        color: "$warning",
      },
      primary: {
        bg: "$primaryLight",
        color: "$primary",
      },
    },
  },
  defaultVariants: {
    status: "active",
  },
  length: 0,
});

const NextUIBadge = ({
  children,
  status = "active",
}: {
  children: ReactNode;
  status?: "active" | "paused" | "vacation" | "primary";
}) => {
  // @ts-ignore
  return <StyledBadge status={status}>{children}</StyledBadge>;
};

export default NextUIBadge;
