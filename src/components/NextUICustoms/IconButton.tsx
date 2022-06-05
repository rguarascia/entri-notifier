import { styled } from "@nextui-org/react";
import { ReactNode } from "react";

// IconButton component will be available as part of the core library soon
export const CustomIconButton = styled("button", {
  dflex: "center",
  border: "none",
  outline: "none",
  cursor: "pointer",
  padding: "0",
  margin: "0",
  bg: "transparent",
  transition: "$default",
  "&:hover": {
    opacity: "0.8",
  },
  "&:active": {
    opacity: "0.6",
  },
  "&:disabled": {
    opacity: "0.4",
    cursor: "none",
    pointerEvents: "none",
  },
  length: 0,
});

const IconButton = ({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <CustomIconButton disabled={disabled} onClick={onClick} type={"button"}>
      {children}
    </CustomIconButton>
  );
};

export default IconButton;
