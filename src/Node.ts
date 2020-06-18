let idx = 1;

interface NodeOptions {
	rootId?: null | string | number;
	idField?: string;
	pidField?: string;
	leafField?: string;
}

interface NodeState {
	expandedMap?: Record<string, boolean>;
}

export default class Node<T = Record<string, any>> {
	id: string | number;
	pid: string | number;
	leaf: boolean;
	data: T;
	loading: boolean;
	root: boolean;
	expanded: boolean;
	depth: number;

	constructor(
		data: T,
		parentNode: Node | null,
		options: NodeOptions = {},
		state: NodeState = {}
	) {
		const { rootId = null, idField = "id", pidField = "pid", leafField = "leaf" } = options;
		const { expandedMap = {} } = state;

		this.id = data[idField];
		this.pid = data[pidField];
		this.leaf = data[leafField];
		this.data = data;

		if (this.id == null && this.id !== rootId) {
			this.id = `node_${idx++}`;
		}

		this.loading = false;
		this.root = !parentNode;
		this.expanded = this.root ? true : !!expandedMap[this.id];
		this.depth = parentNode ? parentNode.depth + 1 : 0;
	}

	getId() {
		return this.id;
	}

	getDepth() {
		return this.depth;
	}

	setDepth(depth: number) {
		this.depth = depth;
	}

	getData() {
		return this.data;
	}

	isRoot() {
		return this.root;
	}

	isLeaf() {
		return this.leaf;
	}

	setExpanded(expanded: boolean) {
		this.expanded = expanded;
	}

	isExpanded() {
		return this.expanded;
	}

	setLoading(loading: boolean) {
		this.loading = loading;
	}

	isLoading() {
		return this.loading;
	}
}
