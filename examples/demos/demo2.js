import React, { Component } from "react";
import { TreeStore } from "xtree-store";
import Tree from "../../src";
import data from "../data.json";

const dataSource = new TreeStore(data, {
	simpleData: true,
});

export default class DEMO extends Component {
	state = {
		expandedIds: [1, 3, 8],
	};

	localData = Object.create(null);

	constructor(props) {
		super(props);

		this.store = new TreeStore(data, {
			simpleData: true,
		});
	}

	loadData = (node) => {
		console.log("loadData", node);

		const id = node.id;

		if (!this.localData[id]) {
			return new Promise((resolve) => {
				setTimeout(() => {
					this.localData[id] = dataSource.getChildren(node.id).map((node) => node.data);
					resolve();
				}, 500);
			});
		}

		return this.localData[id];
	};

	handleNodeClick(data) {
		if (data.leaf) return;

		const { expandedIds } = this.state;
		if (expandedIds.indexOf(data.id) === -1) {
			this.setState({
				expandedIds: [...expandedIds, data.id],
			});
		} else {
			const idx = expandedIds.indexOf(data.id);
			expandedIds.splice(idx, 1);
			this.setState({
				expandedIds: [...expandedIds],
			});
		}
	}

	renderItem = (opts) => {
		const data = opts.data;
		const node = opts.node;
		console.log("renderItem", opts);
		return (
			<div
				className="rw-tree-item"
				style={{
					paddingLeft: (node.getDepth() - 1) * 16,
				}}
				onClick={this.handleNodeClick.bind(this, data)}
			>
				<span
					style={{
						display: "inline-block",
						width: 20,
						textAlign: "center",
					}}
				>
					{opts.leaf ? "" : opts.expanded ? " [-] " : " [+] "}
				</span>
				{data.label}(id:{data.id})
				{opts.loading ? (
					<span
						style={{
							marginLeft: 8,
							fontSize: 12,
							color: "#ccc",
						}}
					>
						加载中...
					</span>
				) : null}
			</div>
		);
	};

	render() {
		const { expandedIds } = this.state;
		return (
			<Tree
				loadRender={(opts) => (opts.root ? "加载中..." : null)}
				expandedIds={expandedIds}
				loadData={this.loadData}
				itemRender={this.renderItem}
			/>
		);
	}
}
