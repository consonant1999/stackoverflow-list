import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
} from "react";
import { getRequest } from "./api";

const fetchTags = () =>
  getRequest("tags?order=desc&sort=popular&site=stackoverflow", {
    params: { page: 1, pagesize: 10 },
  });

const fetchLists = (page = 1, pagesize = 20, tagged = '') =>
  getRequest(
    "questions?order=desc&sort=activity&site=stackoverflow",
    {
      params: { page, pagesize, tagged },
    }
  );

const ListContext = createContext();
const initialState = {
  status: "tagLoading",
  query: "",
  tags: [],
  listItems: [],
  listPage: 1,
};
const ListStateActionType = {
  GET_TAGS_REQUEST: "GET_TAGS_REQUEST",
  GET_TAGS_SUCCEEDED: "GET_TAGS_SUCCEEDED",
  GET_TAGS_FAILED: "GET_TAGS_FAILED",
  GET_LISTS_REQUEST: "GET_LISTS_REQUEST",
  GET_LISTS_SUCCEEDED: "GET_LISTS_SUCCEEDED",
  GET_LISTS_FAILED: "GET_LISTS_FAILED",
  ADVANCE_LIST_PAGE: "ADVANCE_LIST_PAGE",
  RESET_LIST_PAGE: "RESET_LIST_PAGE",
};
const reducer = function (state, action) {
  switch (action.type) {
    case ListStateActionType.GET_TAGS_REQUEST:
      return {
        ...state,
        status: "tagLoading",
        listItems: [],
        listPage: 1,
      };
    case ListStateActionType.GET_TAGS_SUCCEEDED:
      return {
        ...state,
        status: "resolved",
        tags: action.payload,
      };
    case ListStateActionType.GET_TAGS_FAILED:
      return {
        ...state,
        status: "rejected",
        tags: [],
      };
    case ListStateActionType.GET_LISTS_REQUEST:
      return {
        ...state,
        status: "listLoading",
        listPage: 1,
      };
    case ListStateActionType.GET_LISTS_SUCCEEDED:
      return {
        ...state,
        status: "resolved",
        listItems: action.payload,
      };
    case ListStateActionType.GET_LISTS_FAILED:
      return {
        ...state,
        status: "rejected",
        listItems: [],
      };
    case ListStateActionType.ADVANCE_LIST_PAGE_REQUEST:
      return {
        ...state,
        status: "listLoading",
        listPage: state.listPage + 1,
      };
    case ListStateActionType.ADVANCE_LIST_PAGE_SUCCEEDED:
      return {
        ...state,
        status: "resolved",
        listItems: state.listItems.concat(action.payload),
      };
    case ListStateActionType.RESET_LIST_PAGE:
      return {
        ...state,
        listPage: 1,
      };
    default:
      return state;
  }
};


function ListContextProvider({ children }) {
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );
  const getTags = useCallback(async () => {
    dispatch({ type: ListStateActionType.GET_TAGS_REQUEST });
    try {
      const tags = await fetchTags();
      dispatch({
        type: ListStateActionType.GET_TAGS_SUCCEEDED,
        payload: tags.items,
      });
    } catch (error) {
      dispatch({ type: ListStateActionType.GET_TAGS_FAILED });
    }
  }, []);
  const getLists = useCallback(async (tag) => {
    dispatch({ type: ListStateActionType.GET_LISTS_REQUEST });
    try {
      const lists = await fetchLists(undefined, undefined, tag);
      dispatch({
        type: ListStateActionType.GET_LISTS_SUCCEEDED,
        payload: lists.items,
      });
    } catch (error) {
      dispatch({ type: ListStateActionType.GET_TAGS_FAILED });
    }
  }, []);
  const goNextPage = useCallback(
    async (tag) => {
      dispatch({ type: ListStateActionType.ADVANCE_LIST_PAGE_REQUEST });
      try {
        const lists = await fetchLists(state.listPage, undefined, tag);
        dispatch({
          type: ListStateActionType.ADVANCE_LIST_PAGE_SUCCEEDED,
          payload: lists.items,
        });
      } catch (error) {
        dispatch({ type: ListStateActionType.GET_TAGS_FAILED });
      }
    },
    [state.listPage]
  );
  const resetPage = useCallback(
    () => dispatch({ type: ListStateActionType.RESET_LIST_PAGE }),
    []
  );
  const listState = useMemo(
    () => state,
    [state]
  );

  return (
    <ListContext.Provider
      value={{ state: listState, getTags, getLists, goNextPage, resetPage }}
    >
      {children}
    </ListContext.Provider>
  );
}

function useListContext() {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error(
      'useListContext must be used within a ListContextProvider',
    );
  }
  return context;
}

export { ListContextProvider, useListContext };