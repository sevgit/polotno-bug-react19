import { VariableFieldListElement } from '@constech/shared/typings/polotno';
import Konva from 'konva';
import { observer } from 'mobx-react-lite';
import {
  unstable_registerShapeComponent,
  unstable_registerShapeModel,
  unstable_registerTransformerAttrs,
} from 'polotno/config';
import { StoreType } from 'polotno/model/store';
import { Group, Line, Rect, Text } from 'react-konva';
import { DSVariableFieldElement } from './DSVariableFieldElement';

unstable_registerShapeModel({
  type: 'variable-field-list',
  fill: 'transparent',
  subType: 'free',
});

unstable_registerTransformerAttrs('variable-field-list', {
  enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
});

type DSVariableFieldListElementProps = {
  element: VariableFieldListElement;
  store: StoreType;
};

export const DSVariableFieldListElement = observer(
  ({ element }: DSVariableFieldListElementProps) => {
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

    const items = element.custom?.selectedColumns ?? [];

    const minimumWidth = 430;
    const ratio = element.width / minimumWidth;
    const paddingY = 16;
    const lineHeight = paddingY + 61 * ratio;
    const calculateTextWidth = (text: string, font: string) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) return 0;
      context.font = font;
      return context.measureText(text).width;
    };
    const maxWidth = items
      .map((item, index) => `${index + 1}. ${item}`)
      .reduce(
        (acc, curr) =>
          Math.max(acc, calculateTextWidth(curr, `${40 * ratio}px Arial`)),
        element.width,
      );

    const finalWidth = Math.max(maxWidth, element.width);

    return (
      <>
        <Rect
          name="element"
          draggable={!element.locked}
          id={element.id}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          fill="transparent"
          onDragMove={handleChange}
          onTransform={handleChange}
          listening={element.selectable}
        />
        <Group x={element.x} y={element.y}>
          <Group key={items.map((item) => item).join(',')}>
            <Text
              fontSize={40 * ratio}
              text={'Variable Fields'}
              x={0}
              y={10 * ratio}
              fontStyle="bold"
              fontFamily="Arial"
            />
            <Line
              points={[
                0,
                60 * ratio,
                (Math.max(...items.map((item) => item?.length ?? 0)) * 20 +
                  50) *
                  ratio,
                60 * ratio,
              ]}
              stroke="lightgrey"
              strokeWidth={3}
            />
            {items.map((item, index) => (
              <DSVariableFieldElement
                key={item}
                text={`${index + 1}. ${item}`}
                x={0}
                y={66 * ratio + 44 + lineHeight * index}
                lineWidth={finalWidth}
                ratio={ratio}
              />
            ))}
          </Group>
        </Group>
      </>
    );
  },
);

unstable_registerShapeComponent(
  'variable-field-list',
  DSVariableFieldListElement as any,
);
