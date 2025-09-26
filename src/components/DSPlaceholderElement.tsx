import Konva from "konva";
import { observer } from "mobx-react-lite";
import {
	unstable_registerShapeComponent,
	unstable_registerShapeModel,
	unstable_registerTransformerAttrs,
} from "polotno/config";
import type { StoreType } from "polotno/model/store";
import { useState } from "react";
import { Rect } from "react-konva";
import { DSPlaceholderGroup } from "./DSPlaceholderGroup";

unstable_registerShapeModel({
	type: "placeholder",
	width: 100,
	height: 100,
	fill: "transparent",
	stroke: "green",
	color: "green",
	text: "placeholder",
	subType: "free",
	showInExport: false,
});

unstable_registerTransformerAttrs("placeholder", {
	enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
});

type DSPlaceholderElementProps = {
	element: any;
	store: StoreType;
};

export const DSPlaceholderElement = observer(
	({ element }: DSPlaceholderElementProps) => {
		const [labelRef, setLabelRef] = useState<Konva.Label | null>(null);
		const rectWidth = element.width ?? 100;
		const rectHeight = element.height ?? 100;
		const labelWidth = labelRef?.getWidth() ?? 50;
		const labelHeight = labelRef?.getHeight() ?? 50;
		const labelX = Math.max(0, (rectWidth - labelWidth) / 2);
		const labelY = Math.max(0, (rectHeight - labelHeight) / 2);
		const strokeLength = Math.min(rectWidth, rectHeight) / 4;
		const opacity = element?.a?.opacity ?? element.opacity;

		const handleChange = (e: Konva.KonvaEventObject<Event>) => {
			const node = e.currentTarget;
			const scaleX = node.scaleX();
			const scaleY = node.scaleY();
			element.set({
				x: node.x(),
				y: node.y(),
				width: element.width * scaleX,
				height: element.height * scaleY,
				rotation: node.rotation(),
			});

			// Reset scale
			node.scaleX(1);
			node.scaleY(1);
		};

		// This prevents unnecessary re-renders and
		// ensures proper label centering when the element is resized
		const handleLabelRef = (ref: Konva.Label | null) => {
			if (ref !== labelRef) {
				setLabelRef(ref);
			}
		};

		return (
			<>
				<Rect
					name="element"
					draggable={!element.locked}
					id={element.id}
					x={element.x}
					y={element.y}
					onDragMove={handleChange}
					onTransform={handleChange}
					opacity={opacity}
					width={element.width}
					height={element.height}
					fill={element.fill}
					rotation={element.rotation}
					hideInExport={!element.showInExport}
					listening={element.selectable}
				/>
				<DSPlaceholderGroup
					element={element}
					strokeLength={strokeLength}
					rectWidth={rectWidth}
					rectHeight={rectHeight}
					setLabelRef={handleLabelRef}
					labelX={labelX}
					labelY={labelY}
					logoCount={0}
				/>
			</>
		);
	},
);

unstable_registerShapeComponent("placeholder", DSPlaceholderElement as any);
