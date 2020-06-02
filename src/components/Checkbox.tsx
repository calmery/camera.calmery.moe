import React, { useState } from "react";
import styled from "styled-components";
import { IconButton } from "./IconButton";

const Input = styled.input`
  display: none;
`;

const Label = styled.label`
  img {
    vertical-align: middle;
  }
`;

export const Checkbox: React.FC<{
  defaultChecked?: boolean;
  onChange: (checked: boolean) => void;
}> = (props) => {
  const [id] = useState(Math.random().toString(32).substring(2));
  const [checked, setChecked] = useState(props.defaultChecked || false);

  return (
    <>
      <Input
        id={id}
        type="checkbox"
        onChange={() => {
          props.onChange && props.onChange(!checked);
          setChecked(!checked);
        }}
      />
      <Label htmlFor={id}>
        <IconButton src="/images/components/checkbox.svg" clicked={checked} />
      </Label>
    </>
  );
};
