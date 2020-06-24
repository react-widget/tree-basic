# react-widget-tree-basic

Tree基础组件


## 安装

```
npm install --save react-widget-tree-basic
```

## 使用

[![Edit react-widget-tree-basic](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-widget-tree-basic-bsqjd?fontsize=14&hidenavigation=1&theme=dark)

```js

import TreeBasic from 'react-widget-tree-basic';

export default () => <TreeBasic loadData={...} itemRender={...} />

```

### Interfaces

```ts
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
    nodeRender?: (props: nodeRenderProps<T>, item: React.ReactNode, children: React.ReactNode) => React.ReactNode;
    /** 自定义TreeItem的render返回，必填 */
    itemRender: (props: itemRenderProps<T>) => React.ReactNode;
    /** 自定义TreeNode的子节点渲染，一般动画需要使用。*/
    childrenRender: (props: childrenRenderProps<T>) => React.ReactNode;
    /** 异步加载时的加载内容返回，默认为：null */
    loadRender?: (props: LoadRenderProps<T>) => React.ReactNode;
    /** 自定义Tree容器组件*/
    rootComponent: React.ElementType;
}

export declare type renderProps<T> = Omit<TreeNodeProps<T>, "render" | "childrenRender">;
export interface TreeNodeProps<T = DataType> {
    node: Node<T>;
    isRoot: boolean;
    render?: (props: renderProps<T>, nodeItem: React.ReactNode, children: React.ReactNode) => React.ReactNode;
}

export interface TreeNodeProps {
	node: Node;
	isRoot: boolean;
	render?: (
		props: renderProps,
		nodeItem: React.ReactNode,
		children: React.ReactNode
	) => React.ReactNode;
}
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
export declare function toMarked(array: any[]): any;
export declare type DataType = Record<string, any>;
export declare type IdType = string | number;
export declare type nodeRenderProps<T> = renderProps<T>;
export interface LoadRenderProps<T = DataType> {
    root: boolean;
    node: Node;
    data: T;
}

```

### defaultProps

```js
{
	prefixCls: "rw-tree",
	rootId: null,
	idField: "id",
	leafField: "leaf",
	pidField: "pid",
	maxDepth: 99, 
	asyncTestDelay: 16,
	expandedIds: [],
	childrenRender(props) {
		if (!props.expanded) return null;
		return props.getChildren();
	},
	rootComponent: "div",
}
```
