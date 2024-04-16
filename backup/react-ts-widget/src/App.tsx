import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { increment, decrement } from "./store/features/sample";

function App(props:any) {
  const counter = useAppSelector((state: any) => state.counter);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(increment(1));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React {counter.count}
        </a>
      </header>
    </div>
  );
}

export default App;
