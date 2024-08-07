import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from 'react-redux';
import type { RootState, AppDispatch, AppStore } from '.';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
