import React from 'react';
import Button from '@mui/material/Button';

interface Props {
  text: string;
  onClick: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
}

const MyButton: React.FC<Props> = ({
  text,
  onClick,
  variant = 'contained',
  color = 'primary',
}) => {
  return (
    <Button variant={variant} color={color} onClick={onClick}>
      {text}
    </Button>
  );
};

export default MyButton;
