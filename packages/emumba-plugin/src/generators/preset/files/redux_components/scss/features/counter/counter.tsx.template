import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { decrement, increment, selectCount } from "./counterSlice";
import "./counter.scss";

export default function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div className={"row"}>
        <button
          className={"button"}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <span className={"value"}>{count}</span>
        <button
          className={"button"}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
      </div>
    </div>
  );
}
