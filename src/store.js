import { configureStore } from "@reduxjs/toolkit";
import gameReducer from './slice';

export const store = configureStore({
    reducer: {
        game: gameReducer
    }
});
