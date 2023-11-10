import React from 'react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';

interface Props extends ButtonProps {
  text: string;
}

const MyButton: React.FC<Props> = ({ text, ...props }) => {
  return <Button {...props}>{text}</Button>;
};

export default MyButton;
