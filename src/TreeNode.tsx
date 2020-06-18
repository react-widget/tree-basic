import React from "react";
import warning from "warning";
import isPromise from "is-promise";
import TreeContext, { ContextValue } from "./TreeContext";
import Node from "./Node";

export type DataType = Record<string, any>;
export type renderProps<T> = Omit<TreeNodeProps<T>, "render" | "childrenRender">;

export interface TreeNodeProps<T = DataType> {
	node: Node<T>;
	isRoot: boolean;
	render?: (
		props: renderProps<T>,
		nodeItem: React.ReactNode,
		children: React.ReactNode
	) => React.ReactNode;
}

export interface TreeNodeState {
	isLoading: boolean;
}

class TreeNode<T> extends React.Component<TreeNodeProps<T>, TreeNodeState> {
	static defaultProps = {
		node: {},
		isRoot: false,
	};

	static contextType = TreeContext;
	context: ContextValue<T>;

	constructor(props: TreeNodeProps<T>, context: React.ContextType<typeof TreeContext>) {
		super(props, context);

		this.state = {
			isLoading: false,
		};
	}

	getTree() {
		return this.context.tree;
	}
	getTreeProps() {
		const tree = this.getTree();
		return tree.props;
	}

	getNodeList(list: T[]) {
		const tree = this.getTree();
		const { node: pNode } = this.props;
		const options = this.getTreeProps();
		const state = tree.state;

		return list.map((data, i) => {
			const node = new Node(data, pNode, options, state);

			return <TreeNode render={options.nodeRender} node={node} key={node.getId()} />;
		});
	}

	loadNodeChildren() {
		const { node, isRoot } = this.props;
		const { isLoading } = this.state;
		const { loadData, asyncTestDelay, loadRender } = this.getTreeProps();

		if (isLoading) {
			return loadRender
				? loadRender({
						root: isRoot,
						node: node,
						data: node.data,
				  })
				: null;
		}

		let asyncTimer: number | null = null;
		const onfulfilled = () => {
			if (asyncTimer) {
				clearTimeout(asyncTimer);
				asyncTimer = null;
			}

			node.setLoading(false);

			this.setState({
				isLoading: false,
			});
		};
		const onrejected = onfulfilled;
		const results = loadData(node.data, node);

		if (isPromise(results)) {
			asyncTimer = (setTimeout(() => {
				asyncTimer = null;

				node.setLoading(true);

				this.setState({
					isLoading: true,
				});
			}, asyncTestDelay) as unknown) as number;

			results.then(onfulfilled, onrejected);

			return null;
		} else {
			return this.getNodeList(results);
		}
	}

	renderNodeChildren() {
		const { maxDepth, childrenRender } = this.getTreeProps();
		const { node, isRoot } = this.props;
		const leaf = node.isLeaf();
		const expanded = !leaf && node.isExpanded();

		if (expanded && node.getDepth() >= maxDepth) {
			warning(false, `react-widget-tree-basic: maximum depth: ${maxDepth}`);
			return null;
		}

		return leaf
			? null
			: childrenRender({
					getChildren: () => this.loadNodeChildren(),
					loading: node.isLoading(),
					root: isRoot,
					expanded,
					node: node,
					data: node.data,
			  });
	}

	render() {
		const { node, isRoot, render } = this.props;
		const { itemRender, childrenRender } = this.getTreeProps();

		if (isRoot) {
			return childrenRender({
				getChildren: () => this.loadNodeChildren(),
				loading: node.isLoading(),
				root: true,
				expanded: true,
				node: node,
				data: node.data,
			});
		}

		const item = itemRender({
			node,
			loading: node.isLoading(),
			leaf: node.isLeaf(),
			data: node.getData(),
			expanded: node.isExpanded(),
		});

		return render ? (
			render(this.props, item, this.renderNodeChildren())
		) : (
			<>
				{item}
				{this.renderNodeChildren()}
			</>
		);
	}
}

export default TreeNode;
