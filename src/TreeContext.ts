import React from "react";
import Tree from "./index";
export interface ContextValue {
	tree: Tree;
}

export default React.createContext<ContextValue>({ tree: {} as Tree });
