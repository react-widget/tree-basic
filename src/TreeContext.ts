import React from "react";
import Tree from "./index";
export interface ContextValue<T = {}> {
	tree: Tree<T>;
}

export default React.createContext<ContextValue>({ tree: {} as Tree });
