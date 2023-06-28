import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import RunPage from "./views/RunPage";

import { useAppSelector, useAppDispatch } from "./store/hooks";
import { increment, decrement } from "./store/features/sample";
/**
 * 产品结构：获取由主题给过来的ROM，然后开始加载
 * 目前先不考虑主题给过来的rom
 * 1.加载器
 * 2.手柄控制器
 * 3.按键控制器
 */
function App(props:any) {
  const counter = useAppSelector((state: any) => state.counter);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(increment(1));
  }, []);
  return (
    <div className="App">
      <RunPage/>
     
    </div>
  );
}

export default App;
