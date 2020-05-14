import React, { useState } from "react";
import styled from "styled-components";
import { v4 } from "uuid";
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
  const [id] = useState(v4());
  const [checked, setChecked] = useState(props.defaultChecked || false);

  console.log(checked);

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
        <IconButton src="/images/checkbox.svg" clicked={checked} />
      </Label>
    </>
  );
};
