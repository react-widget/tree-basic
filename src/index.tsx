import React from "react";
import classNames from "classnames";
import TreeContext from "./TreeContext";
import Node from "./Node";
import TreeNode, { renderProps } from "./TreeNode";

export const version = "%VERSION%";

export interface childrenRenderProps<T = DataType> {
	getChildren: () => React.ReactNode;
	expanded: boolean;
	loading: boolean;
	root: boolean;
	node: Node<T>;
	data: T;
}

export interface itemRenderProps<T = DataType> {
	expanded: boolean;
	loading: boolean;
	leaf: boolean;
	node: Node<T>;
	data: T;
}

export function toMarked(array: any[]) {
	const marked = Object.create(null);

	array.forEach((value) => {
		marked[value] = true;
	});

	return marked;
}

export type DataType = Record<string, any>;
export type IdType = string | number;
export type nodeRenderProps<T> = renderProps<T>;

export interface LoadRenderProps<T = DataType> {
	root: boolean;
	node: Node;
	data: T;
}

export interface TreeBasicProps<T = DataType> {
	/** 样式前缀 */
	prefixCls: string;
	/** 样式名称 */
	className?: string;
	/** 样式属性 */
	style?: React.CSSProperties;
	/** 树根节点ID */
	rootId: string | number | null;
	/** tree 数据结构 id 属性名称 */
	idField: string;
	/** tree 数据结构 leaf 属性名称 */
	leafField: string;
	/** tree 数据结构 parent 属性名称 */
	pidField: string;
	/** 最大展开层级限制没，默认：99 */
	maxDepth: number;
	/** 异步检测耗时机制，超过该时长即认定为异步加载，默认：16 ms */
	asyncTestDelay: number;
	/** 已展开的节点ID */
	expandedIds: (string | number)[];
	/** Tree数据加载器，必填 */
	loadData: (data: T, node: Node<T>) => T[] | Promise<any>;
	/** 自定义TreeNode的render返回 */
	nodeRender?: (
		props: nodeRenderProps<T>,
		item: React.ReactNode,
		children: React.ReactNode
	) => React.ReactNode;
	/** 自定义TreeItem的render返回，必填 */
	itemRender: (props: itemRenderProps<T>) => React.ReactNode;
	/** 自定义TreeNode的子节点渲染，一般动画需要使用。*/
	childrenRender: (props: childrenRenderProps<T>) => React.ReactNode;
	/** 异步加载时的加载内容返回，默认为：null */
	loadRender?: (props: LoadRenderProps<T>) => React.ReactNode;
	/** 自定义Tree容器组件*/
	rootComponent: React.ElementType;
}

export interface TreeState {
	expandedIds: (string | number)[];
	expandedMap: Record<string, boolean>;
}

export class TreeBasic<T = DataType> extends React.Component<TreeBasicProps<T>, TreeState> {
	static defaultProps = {
		prefixCls: "rw-tree",
		rootId: null,
		idField: "id",
		leafField: "leaf",
		pidField: "pid",
		maxDepth: 99, //最大层级99   Number.MAX_VALUE
		asyncTestDelay: 16,
		expandedIds: [],
		childrenRender(props: childrenRenderProps) {
			if (!props.expanded) return null;
			return props.getChildren();
		},
		rootComponent: "div",
	};

	static getDerivedStateFromProps<T>(nextProps: TreeBasicProps<T>) {
		return {
			expandedIds: nextProps.expandedIds,
			expandedMap: toMarked(nextProps.expandedIds || []),
		};
	}

	constructor(props: TreeBasicProps<T>) {
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

	getContext(this: TreeBasic<T>) {
		return {
			tree: this,
		};
	}

	render() {
		const {
			prefixCls,
			className,
			style,
			rootComponent: Component,
			itemRender,
			loadData,
		} = this.props;

		if (!itemRender) {
			throw new Error("react-widget-tree-basic: itemRender cannot be empty.");
		}
		if (!loadData) {
			throw new Error("react-widget-tree-basic: loadData cannot be empty.");
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
