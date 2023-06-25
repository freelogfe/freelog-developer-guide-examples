import { configureStore } from "@reduxjs/toolkit";
import sample from "./features/sample";
export const store = configureStore({
  reducer: {
    counter: sample,
  },
});
/**
 * 慎用异步action，只有当例如需要loading状态改变，避免需要使用多个dispacth,这种情况可以用,
 * 所以封装一个公共的异步，将前后值传入，在异步执行前后执行变更
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
