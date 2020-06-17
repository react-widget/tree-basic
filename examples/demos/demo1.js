import React, { Component } from "react";
import { TreeStore } from "xtree-store";
import Tree from "../../src";
import data from "../data.json";

export default class DEMO extends Component {
	state = {
		expandedIds: [1],
	};

	constructor(props) {
		super(props);

		this.store = new TreeStore(data, {
			simpleData: true,
		});
	}

	loadData = (node) => {
		console.log("loadData", node);
		const store = this.store;
		return store.getChildren(node.id).map((node) => node.data);
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
			</div>
		);
	};

	render() {
		const { expandedIds } = this.state;
		return (
			<Tree expandedIds={expandedIds} loadData={this.loadData} itemRender={this.renderItem} />
		);
	}
}
