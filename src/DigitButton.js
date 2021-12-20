import { ACTIONS } from "./App";
export default function DigitButton({ dispatch, digit, id }) {
  return (
    <button
      onClick={() => {dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}}
      id={id}
    >
      {digit}
    </button>
  );
}
