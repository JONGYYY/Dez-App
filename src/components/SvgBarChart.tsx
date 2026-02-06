import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { Colors } from '../theme';

type Point = { label: string; hours: number };

type Props = {
  data: Point[];
  height?: number;
};

export function SvgBarChart({ data, height = 240 }: Props) {
  const { max, ticks } = useMemo(() => {
    const m = Math.max(1, ...data.map((d) => d.hours));
    const rounded = Math.ceil(m);
    const t = [0, Math.ceil(rounded / 2), rounded];
    return { max: rounded, ticks: t };
  }, [data]);

  // Layout
  const w = 320; // rendered by viewBox scaling
  const h = height;
  const padL = 44;
  const padR = 10;
  const padT = 14;
  const padB = 34;

  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const barCount = Math.max(1, data.length);
  const gap = barCount > 1 ? 10 : 0;
  const barW = Math.max(8, (innerW - gap * (barCount - 1)) / barCount);

  function yFor(v: number) {
    const t = Math.max(0, Math.min(max, v));
    return padT + innerH - (t / max) * innerH;
  }

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Grid lines */}
        {ticks.map((t, i) => (
          <Line
            key={`g-${i}`}
            x1={padL}
            x2={w - padR}
            y1={yFor(t)}
            y2={yFor(t)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}

        {/* Y labels */}
        {ticks.map((t, i) => (
          <SvgText
            key={`yl-${i}`}
            x={padL - 8}
            y={yFor(t) + 4}
            fontSize="10"
            fill="rgba(255,255,255,0.55)"
            textAnchor="end"
          >
            {t}
          </SvgText>
        ))}

        {/* Axis */}
        <Line
          x1={padL}
          x2={padL}
          y1={padT}
          y2={padT + innerH}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1}
        />
        <Line
          x1={padL}
          x2={w - padR}
          y1={padT + innerH}
          y2={padT + innerH}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1}
        />

        {/* Bars + X labels */}
        {data.map((d, idx) => {
          const x = padL + idx * (barW + gap);
          const y = yFor(d.hours);
          const barH = padT + innerH - y;
          return (
            <React.Fragment key={`${d.label}-${idx}`}>
              <Rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill={Colors.blue}
                opacity={0.85}
                rx={6}
                ry={6}
              />
              <SvgText
                x={x + barW / 2}
                y={padT + innerH + 18}
                fontSize="10"
                fill="rgba(255,255,255,0.55)"
                textAnchor="middle"
              >
                {d.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>

      <Text style={styles.axisHint}>Hours</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  axisHint: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.40)',
    fontSize: 11,
    fontWeight: '700',
  },
});


