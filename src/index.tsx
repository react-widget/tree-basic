import React from "react";
import classNames from "classnames";
import TreeContext from "./TreeContext";
import Node from "./Node";
import TreeNode, { renderProps } from "./TreeNode";

export const version = "%VERSION%";

export interface childrenRenderProps {
	getChildren: () => React.ReactNode;
	expanded: boolean;
	loading: boolean;
	root: boolean;
	node: Node;
	data: Record<string, any>;
}

export interface itemRenderProps {
	expanded: boolean;
	loading: boolean;
	leaf: boolean;
	node: Node;
	data: Record<string, any>;
}

export function toMarked(array: any[] = []) {
	const marked = Object.create(null);

	array.forEach((value) => {
		marked[value] = true;
	});

	return marked;
}

export type DataType = Record<string, any>;
export type IdType = string | number;
export type nodeRenderProps = renderProps;

export interface LoadRenderProps {
	root: boolean;
	node: Node;
	data: Record<string, any>;
}

export interface TreeProps {
	prefixCls: string;
	className?: string;
	style?: React.CSSProperties;
	rootId: string | number | null;
	idField: string;
	leafField: string;
	pidField: string;
	// labelField: string;
	loadData: (data: DataType, node: Node) => DataType[] | Promise<any>;
	maxDepth: number;
	asyncTestDelay: number;
	expandedIds: (string | number)[];
	nodeRender?: (
		props: nodeRenderProps,
		item: React.ReactNode,
		children: React.ReactNode
	) => React.ReactNode;
	itemRender: (props: itemRenderProps) => React.ReactNode;
	childrenRender: (props: childrenRenderProps) => React.ReactNode;
	loadRender?: (props: LoadRenderProps) => React.ReactNode;
	rootComponent: React.ElementType;
}

export interface TreeState {
	expandedIds: (string | number)[];
	expandedMap: Record<string, boolean>;
}

export class TreeBasic extends React.Component<TreeProps, TreeState> {
	static defaultProps = {
		prefixCls: "rw-tree",
		rootId: null,
		idField: "id",
		leafField: "leaf",
		pidField: "pid",
		// labelField: "label",
		maxDepth: 99, //最大层级99   Number.MAX_VALUE
		asyncTestDelay: 16,
		expandedIds: [],
		childrenRender(props: childrenRenderProps) {
			if (!props.expanded) return null;
			return props.getChildren();
		},
		rootComponent: "div",
	};

	static getDerivedStateFromProps(nextProps: TreeProps) {
		return {
			expandedIds: nextProps.expandedIds,
			expandedMap: toMarked(nextProps.expandedIds),
		};
	}

	constructor(props: TreeProps) {
		super(props);

		this.state = {
			expandedIds: [],
			expandedMap: {},
		};
	}

	getRootNode() {
		const { rootId, idField, pidField, leafField } = this.props;

		const node = new Node(
			{
				[idField]: rootId,
				[pidField]: null,
				[leafField]: false,
			},
			null,
			this.props,
			this.state
		);

		return node;
	}

	getContext(this: TreeBasic) {
		return {
			tree: this,
		};
	}

	render() {
		const { prefixCls, className, style, rootComponent: Component, itemRender } = this.props;

		if (!itemRender) {
			throw new Error("react-widget-tree-basic: itemRender cannot be empty.");
		}

		let classes = classNames({
			[prefixCls]: true,
			[className!]: className,
		});

		return (
			<TreeContext.Provider value={this.getContext()}>
				<Component className={classes} style={style}>
					<TreeNode node={this.getRootNode()} isRoot />
				</Component>
			</TreeContext.Provider>
		);
	}
}

export default TreeBasic;
