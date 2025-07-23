import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist';

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}

const { persistAtom } = recoilPersist({
  key: "toDos",
  storage: localStorage,
})

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "To Do": [],
    Doing: [],
    Done: [],
  },
  effects_UNSTABLE: [persistAtom]
});