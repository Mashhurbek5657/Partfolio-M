import React from 'react';
import styled from 'styled-components';

const StyledButton = ({ children }) => {
  return <Button>{children}</Button>;
};

const Button = styled.button`
  --blue: #2563eb; /* Tailwind blue-600 */
  font-size: 16px;
  padding: 0.7em 2.7em;
  letter-spacing: 0.06em;
  position: relative;
  font-family: inherit;
  border-radius: 0.6em;
  overflow: hidden;
  transition: all 0.3s;
  line-height: 1.4em;
  border: 2px solid var(--blue);
  background: linear-gradient(
    to right,
    rgba(37, 99, 235, 0.1) 1%,
    transparent 40%,
    transparent 60%,
    rgba(37, 99, 235, 0.1) 100%
  );
  color: var(--blue);
  box-shadow: inset 0 0 10px rgba(37, 99, 235, 0.4), 0 0 9px 3px rgba(37, 99, 235, 0.1);

  &:hover {
    background: transparent; /* hoverda bg yo'qoladi */
    color: #2563eb; /* text blue-600 */
    box-shadow: inset 0 0 10px rgba(37, 99, 235, 0.6), 0 0 9px 3px rgba(37, 99, 235, 0.2);
  }

  &:before {
    content: "";
    position: absolute;
    left: -4em;
    width: 4em;
    height: 100%;
    top: 0;
    transition: transform 0.4s ease-in-out;
    background: linear-gradient(
      to right,
      transparent 1%,
      rgba(37, 99, 235, 0.1) 40%,
      rgba(37, 99, 235, 0.1) 60%,
      transparent 100%
    );
  }

  &:hover:before {
    transform: translateX(15em);
  }
`;

export default StyledButton;
