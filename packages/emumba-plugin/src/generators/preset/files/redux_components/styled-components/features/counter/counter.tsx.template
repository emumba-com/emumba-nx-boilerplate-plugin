import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { decrement, increment, selectCount } from "./counterSlice";



const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & > button {
    margin-left: 4px;
    margin-right: 8px;
  }

  &:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const Value = styled.span`
  font-size: 78px;
  padding-left: 16px;
  padding-right: 16px;
  margin-top: 2px;
  font-family: "Courier New", Courier, monospace;
`;

const Button = styled.button`
  appearance: none;
  background: none;
  font-size: 32px;
  padding-left: 12px;
  padding-right: 12px;
  outline: none;
  border: 2px solid transparent;
  color: rgb(112,76,182);
  padding-bottom: 4px;
  cursor: pointer;
  background-color: rgba(112,76,182,0.1);
  border-radius: 2px;
  
  &:hover,
  &:focus {
    border:2px solid rgba(112,76,182,0.4);
   }

   &:active {
    background-color: rgba(112,76,182,0.2);
   }
`;

export default function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return (
    <div>
       <Row>
          <Button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
            -
          </Button>
                <Value>{count}</Value>
          <Button aria-label="Increment value" onClick={() => dispatch(increment())}>
            +
          </Button>
      </Row>
    </div>
  );
}
