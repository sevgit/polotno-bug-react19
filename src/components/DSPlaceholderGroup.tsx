import type { PlaceholderLayerElement } from "@constech/shared/typings/polotno";
import type { LineConfig } from "konva/lib/shapes/Line";
import { observer } from "mobx-react-lite";
import { ElementType } from "polotno/model/group-model";
import { Circle, Group, Label, Line, Tag, Text } from "react-konva";

export const placeholderTexts = {
	product: "Product",
	image: "Image",
	backgroundImage: "Background\nImage",
	backgroundVideo: "Background\nVideo",
	logoSquare: "Logo\nSquare",
	logoHorizontal: "Logo\nHorizontal",
	logoVertical: "Logo\nVertical",
	logoPrimary: "Primary\nLogo",
	logoSecondary: "Secondary\nLogo",
	logoSalesEvent: "Event\nLogo",
	audio: "Audio",
};
export const isPlaceholderElement = (
	element?: ElementType,
): element is PlaceholderLayerElement => element?.type === "placeholder";

export const logoPlaceholderTexts = [
	placeholderTexts.logoPrimary,
	placeholderTexts.logoSecondary,
	placeholderTexts.logoSalesEvent,
];

export const isLogoPlaceholder = (element: any): element is any => {
	if (!isPlaceholderElement(element)) return false;
	return logoPlaceholderTexts.includes(element.text);
};

type DSPlaceholderGroupProps = {
	element: any;
	strokeLength: number;
	rectWidth: number;
	rectHeight: number;
	setLabelRef: (ref: any) => void;
	labelX: number;
	labelY: number;
	logoCount: number;
};

export const DSPlaceholderGroup = observer(
	({
		element,
		strokeLength,
		rectWidth,
		rectHeight,
		setLabelRef,
		labelX,
		labelY,
		logoCount,
	}: DSPlaceholderGroupProps) => {
		const smallerDimension = Math.min(rectWidth, rectHeight);
		const canvasWidth = element.store?.width || 1080;
		const canvasHeight = element.store?.height || 1080;

		// Base reference canvas size used for calculating scale factor
		const baseCanvasSize = 1080;
		const canvasScaleFactor = Math.sqrt(
			Math.min(canvasWidth, canvasHeight) / baseCanvasSize,
		);
		// Stroke Width
		const maxStrokeWidth = 7;
		const baseStrokeWidth = 6;
		const strokeWidth = Math.max(
			1,
			Math.min(maxStrokeWidth, baseStrokeWidth * canvasScaleFactor),
		);
		// Font Size
		const baseFontSize = 22;
		const fontSizeElementRatio = 17;
		const fontSize = Math.min(
			baseFontSize * canvasScaleFactor,
			smallerDimension / fontSizeElementRatio,
		);
		// Padding
		const basePadding = 8;
		const paddingElementRatio = 22;
		const textPadding = Math.min(
			basePadding * canvasScaleFactor,
			smallerDimension / paddingElementRatio,
		);
		// Corner Radius
		const minCornerRadius = 3;
		const baseCornerRadius = 7;
		const cornerRadius = Math.max(
			minCornerRadius,
			baseCornerRadius * canvasScaleFactor,
		);
		const badgeRadius = Math.max(14, 16 * canvasScaleFactor);
		const isLogo = isLogoPlaceholder(element);
		return (
			<>
				<Group
					x={element.x}
					y={element.y}
					rotation={element.rotation}
					opacity={element.a.opacity}
					hideInExport={!element.showInExport}
				>
					<LineStroke
						points={[0, strokeLength, 0, 0, 0, 0, strokeLength, 0]}
						stroke={element.color}
						strokeWidth={strokeWidth}
					/>
					<LineStroke
						points={[
							rectWidth - strokeLength,
							0,
							rectWidth,
							0,
							rectWidth,
							strokeLength,
							rectWidth,
							0,
						]}
						stroke={element.color}
						strokeWidth={strokeWidth}
					/>
					<LineStroke
						points={[
							rectWidth,
							rectHeight - strokeLength,
							rectWidth,
							rectHeight,
							rectWidth,
							rectHeight,
							rectWidth - strokeLength,
							rectHeight,
						]}
						stroke={element.color}
						strokeWidth={strokeWidth}
					/>
					<LineStroke
						points={[
							strokeLength,
							rectHeight,
							0,
							rectHeight,
							0,
							rectHeight,
							0,
							rectHeight - strokeLength,
						]}
						stroke={element.color}
						strokeWidth={strokeWidth}
					/>
				</Group>

				<Group
					x={element.x}
					y={element.y}
					listening={false}
					opacity={element.a.opacity}
					rotation={element.rotation}
					hideInExport={!element.showInExport}
				>
					<Label
						ref={setLabelRef}
						listening={false}
						opacity={element.opacity}
						align="center"
						verticalAlign="middle"
						x={labelX}
						y={labelY}
					>
						<Tag cornerRadius={cornerRadius} fill={element.color} />
						<Text
							text={element.text}
							listening={false}
							fontSize={fontSize}
							fontStyle="bold"
							fill="white"
							opacity={element.opacity}
							align="center"
							padding={textPadding}
						/>
					</Label>
				</Group>
				{logoCount > 0 && isLogo && (
					<Group
						x={element.x}
						y={element.y}
						listening={false}
						opacity={element.a.opacity}
						rotation={element.rotation}
						hideInExport={!element.showInExport}
					>
						<Group x={rectWidth - badgeRadius - 4} y={0}>
							<Circle radius={badgeRadius} fill={"#9C27B0"} />
							<Text
								text={String(logoCount)}
								fontSize={badgeRadius}
								fill="white"
								fontStyle="bold"
								width={badgeRadius * 2}
								height={badgeRadius * 2}
								offsetX={badgeRadius}
								offsetY={badgeRadius}
								align="center"
								verticalAlign="middle"
							/>
						</Group>
					</Group>
				)}
			</>
		);
	},
);

const LineStroke = (props: LineConfig) => (
	<Line
		listening={false}
		strokeWidth={props.strokeWidth || 8}
		lineCap="round"
		lineJoin="round"
		{...props}
	/>
);
