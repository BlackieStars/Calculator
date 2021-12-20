import "./App.css";
import React, { useReducer } from "react";
import { ReactDOM } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE:"evaluate"
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite) {return {
        ...state,
        currentOperand:payload.digit,
        overwrite:false

      }
    }
      if (payload.digit == "0" && state.currentOperand == "0") return state;
      if (payload.digit == "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
      break;
    case ACTIONS.CLEAR:
      return {};
      break;
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state;
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      if(state.currentOperand==null){
        return {
          ...state,
          operation:payload.operation,

        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
      break;
      case ACTIONS.DELETE_DIGIT:
        if(state.overwrite) return {
          ...state,
          overwrite:false,
          currentOperand:null
        }
        if(state.currentOperand==null) return state
        if(state.currentOperand.length===1) return {
          ...state,
          currentOperand:null
        }
        return{
          ...state,
          currentOperand:state.currentOperand.slice(0,-1)
        }
        break;
      case ACTIONS.EVALUATE:
        if(state.operation==null||state.currentOperand==null||state.previousOperand==null) return state
  
         return{
           ...state,
           overwrite:true,
           previousOperand:null,
           currentOperand:evaluate(state),
           operation:null
         }

    default:
      break;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits:0,
})

function formatOperand(operand){
  if(operand==null) return null
  const [integer,decimal] = operand.split(".")
  if(decimal==null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <>
      <div id="heading">Calculator</div>
      <div class="container-box">
        <div id="output-box">
          <div id="prev-output">
            {formatOperand(previousOperand)} {operation}
          </div>
          <div id="curr-output">{formatOperand(currentOperand)}</div>
        </div>
        <button
          id="cancel"
          onClick={() => {
            dispatch({ type: ACTIONS.CLEAR });
          }}
        >
          AC
        </button>
        <button id="delete"  onClick={() => {
            dispatch({ type: ACTIONS.DELETE_DIGIT });
          }}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch} id="divide" />
        <DigitButton digit="1" id="one" dispatch={dispatch} />
        <DigitButton digit="2" id="two" dispatch={dispatch} />
        <DigitButton digit="3" id="three" dispatch={dispatch} />
        <OperationButton id="mul" dispatch={dispatch} operation="*" />
        <DigitButton digit="4" id="four" dispatch={dispatch} />
        <DigitButton digit="5" id="five" dispatch={dispatch} />
        <DigitButton digit="6" id="six" dispatch={dispatch} />
        <OperationButton id="plus" dispatch={dispatch} operation="+" />
        <DigitButton digit="7" id="seven" dispatch={dispatch} />
        <DigitButton digit="8" id="eight" dispatch={dispatch} />
        <DigitButton digit="9" id="nine" dispatch={dispatch} />
        <OperationButton id="minus" dispatch={dispatch} operation="-" />
        <DigitButton digit="." id="dot" dispatch={dispatch} />
        <DigitButton digit="0" id="zero" dispatch={dispatch} />
        <button id="equals" onClick={() => {
            dispatch({ type: ACTIONS.EVALUATE });
          }} operation="=" >= </button>
      </div>
    </>
  );
}

export default App;
