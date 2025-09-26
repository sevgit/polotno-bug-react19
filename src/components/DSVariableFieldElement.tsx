import { Group, Line, Text } from 'react-konva';

type DSVariableFieldElementProps = {
  text: string;
  x: number;
  y: number;
  lineWidth: number;
  ratio: number;
};

export const DSVariableFieldElement = ({
  text,
  x,
  y,
  lineWidth,
  ratio,
}: DSVariableFieldElementProps) => {
  return (
    <Group>
      <Text fontSize={40 * ratio} text={text} x={x} y={y} fontFamily="Arial" />
      <Line
        points={[0, y + 58 * ratio, lineWidth, y + 58 * ratio]}
        stroke="lightgrey"
        strokeWidth={1}
      />
    </Group>
  );
};
