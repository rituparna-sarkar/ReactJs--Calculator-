import { useReducer } from 'react';
import './App.css'
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTION = {
  ADD_DIGIT: "add-digit",
  DELETE_DIGIT: "delete-digit",
  CLEAR: "clear",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: 'evaluate'
}



function reducer(state, { type, payload }) {
  switch (type) {
    case ACTION.ADD_DIGIT:

    if(state.overwrite){
      return{
        ...state,
        currentOperand:payload.digit,
        overwrite:false,
      }
    }
    
    
      if (payload.digit ==="0" && state.currentOperand==="0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes('.')) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    // Add other cases as needed
    case ACTION.CHOOSE_OPERATION:
      if(state.currentOperand==null && state.previousOperand==null){
        return state
      }

      if(state.currentOperand==null){
        return{
          ...state,
          operation:payload.operation,
        }
      }

      if (state.previousOperand== null){
        return{
          ...state,
          operation:payload.operation,
          previousOperand:state.currentOperand,
          currentOperand:null,
        }
      }
      return{
        ...state,
        previousOperand:evaluate(state),
        operation:payload.operation,
        currentOperand:null,
      }
    case ACTION.CLEAR:
      return{}

      case ACTION.DELETE_DIGIT:
        if(state.overwrite){
          return{
            ...state,
            overwrite:false,
            currentOperand:null
          }
        }

        if(state.currentOperand==null)return state

        if(state.currentOperand.length===1){
          return{
            ...state,
            currentOperand:null
          }
        }

        return{
          ...state,
          currentOperand: state.currentOperand.slice(0,-1)
        }

      case ACTION.EVALUATE:
        if(state.previousOperand==null || state.currentOperand==null || state.operation==null){
          return state
        }
        return {
          ...state,
          overwrite:true,
          previousOperand:null,
          currentOperand:evaluate(state),
          operation:null,
        }

  }
}

function evaluate({currentOperand,previousOperand,operation}){
  const previousValue=parseFloat(previousOperand)
  const currentValue=parseFloat(currentOperand)
  if(isNaN(previousValue) && isNaN(currentValue)) return ''

  let computation=""

  switch(operation){
    case'+':
    computation=previousValue+currentValue;
    break;

    case'-':
    computation=previousValue-currentValue;
    break;

    case'*':
    computation=previousValue*currentValue
    break;

    case'÷':
    computation=previousValue/currentValue;

  }
  return computation.toString()

}

const INTEGER_FORMATTR=new Intl.NumberFormat("en-us",{
  maximumFractionDigits:0,
})
 function formatOperand(operand){
  if(operand==null) return
  const [integer,decimal]=operand.split('.')
  if(decimal==null) return INTEGER_FORMATTR.format(integer)

  return`${INTEGER_FORMATTR.format(integer)}.${decimal}`
 }

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" 
      onClick={()=>dispatch({type:ACTION.CLEAR})}
      >AC</button>
      <button>DEL</button>
      <OperationButton operation='÷' dispatch={dispatch} />
      <DigitButton digit='1' dispatch={dispatch} />
      <DigitButton digit='2' dispatch={dispatch} />
      <DigitButton digit='3' dispatch={dispatch} />

      <OperationButton operation='*' dispatch={dispatch} />

      <DigitButton digit='4' dispatch={dispatch} />
      <DigitButton digit='5' dispatch={dispatch} />
      <DigitButton digit='6' dispatch={dispatch} />

      <OperationButton operation='+' dispatch={dispatch} />
      <DigitButton digit='7' dispatch={dispatch} />
      <DigitButton digit='8' dispatch={dispatch} />
      <DigitButton digit='9' dispatch={dispatch} />
      <OperationButton operation='-' dispatch={dispatch} />
      <DigitButton digit='.' dispatch={dispatch} />
      <DigitButton digit='0' dispatch={dispatch} />
      <OperationButton className='span-two' 
      onClick={()=>dispatch({type:ACTION.EVALUATE})}
      operation='=' dispatch={dispatch} />
    </div>
  );
}

export default App;
