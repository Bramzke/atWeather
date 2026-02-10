import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { Feature } from '../../models/WeatherResponse';
import type { ParameterSelection } from '../../models/ChartTypes';
import { interpolateData } from '../../utils/interpolation';
import { formatTimestamp } from '../../utils/dateUtils';
import { getParameterColor, getYAxisId, getParameterUnit } from '../../utils/chartHelpers';
import type { ScaleConfig } from '../../hooks/useScaleSynchronization';

interface Props {
  feature: Feature;
  timestamps: string[];
  selectedParams: ParameterSelection;
  syncedScales?: ScaleConfig;
}

type ParameterType = keyof ParameterSelection;
type ApiParameter = 'TL' | 'RF' | 'RR' | 'SO';

interface ParameterConfig {
  key: ParameterType;
  apiParam: ApiParameter;
  label: string;
  seriesType: 'line' | 'bar';
}

const PARAMETER_CONFIG: ParameterConfig[] = [
  { key: 'temperature', apiParam: 'TL', label: 'Temperatur', seriesType: 'line' },
  { key: 'humidity', apiParam: 'RF', label: 'Luftfeuchtigkeit', seriesType: 'line' },
  { key: 'rainfall', apiParam: 'RR', label: 'Niederschlag', seriesType: 'line' },
  { key: 'sunshine', apiParam: 'SO', label: 'Sonnenschein', seriesType: 'bar' }
];

export const WeatherChart = ({ feature, timestamps, selectedParams, syncedScales }: Props) => {
  const option = useMemo(() => {
    const labels = timestamps.map(formatTimestamp);
    const yAxis: Record<string, unknown>[] = [];
    const series: Record<string, unknown>[] = [];
    const params = feature.properties.parameters;

    let rightAxisCount = 0;

    for (const config of PARAMETER_CONFIG) {
      if (!selectedParams[config.key]) {
        continue;
      }

      const parameter = params[config.apiParam];
      if (!parameter) {
        continue;
      }

      const yAxisId = getYAxisId(config.key);
      const yAxisIndex = yAxis.length;
      const isFirstAxis = yAxisIndex === 0;
      const position = isFirstAxis ? 'left' : 'right';
      const offset = isFirstAxis ? 0 : rightAxisCount * 56;
      const syncedScale = syncedScales?.[yAxisId];

      if (!isFirstAxis) {
        rightAxisCount += 1;
      }

      yAxis.push({
        id: yAxisId,
        type: 'value',
        position,
        offset,
        min: syncedScale?.min,
        max: syncedScale?.max,
        axisLine: { show: true },
        axisTick: { show: true },
        splitLine: { show: isFirstAxis },
        axisLabel: { color: '#cbd5e1' },
        name: '',
        nameLocation: 'end',
        nameGap: 0
      });

      series.push({
        name: `${config.label} (${getParameterUnit(config.key)})`,
        type: config.seriesType,
        yAxisIndex,
        data: interpolateData(parameter.data),
        smooth: false,
        symbol: 'none',
        barMaxWidth: 18,
        lineStyle: {
          width: 2,
          color: getParameterColor(config.key)
        },
        itemStyle: {
          color: getParameterColor(config.key)
        },
        emphasis: {
          focus: 'series'
        }
      });
    }

    const rightGridPadding = 56 + Math.max(0, rightAxisCount - 1) * 56;

    // Generate axis symbol graphics
    const graphics: any[] = [];
    let graphicIndex = 0;
    let rightGraphicCount = 0;

    // Count total parameters for right axes positioning
    const totalParams = PARAMETER_CONFIG.filter(c =>
      selectedParams[c.key] && params[c.apiParam]
    ).length;
    const totalRightAxes = totalParams - 1;

    for (const config of PARAMETER_CONFIG) {
      if (!selectedParams[config.key]) {
        continue;
      }

      const parameter = params[config.apiParam];
      if (!parameter) {
        continue;
      }

      const isFirstAxis = graphicIndex === 0;
      const position = isFirstAxis ? 'left' : 'right';
      const color = getParameterColor(config.key);
      const unit = getParameterUnit(config.key);
      const isBar = config.seriesType === 'bar';

      // Calculate positioning
      const yPosition = 30;

      // Create graphic group for this axis
      const graphicGroup: any = {
        type: 'group',
        top: yPosition,
        z: 100,
        children: []
      };

      if (position === 'left') {
        graphicGroup.left = 48;
      } else {
        // Right axes: position from right edge (reversed order)
        graphicGroup.right = 12 + ((totalRightAxes - rightGraphicCount - 1) * 56);
        rightGraphicCount++;
      }

      graphicIndex++;

      if (isBar) {
        // BAR SYMBOL: [▌▌]
        graphicGroup.children.push(
          {
            type: 'rect',
            shape: { x: 0, y: 2, width: 3, height: 10 },
            style: { fill: color }
          },
          {
            type: 'rect',
            shape: { x: 5, y: 5, width: 3, height: 7 },
            style: { fill: color }
          }
        );
      } else {
        // LINE SYMBOL: [—●—]
        graphicGroup.children.push(
          {
            type: 'line',
            shape: { x1: 0, y1: 7, x2: 8, y2: 7 },
            style: { stroke: color, lineWidth: 2 }
          },
          {
            type: 'circle',
            shape: { cx: 10, cy: 7, r: 3 },
            style: { fill: color }
          },
          {
            type: 'line',
            shape: { x1: 12, y1: 7, x2: 20, y2: 7 },
            style: { stroke: color, lineWidth: 2 }
          }
        );
      }

      // Add unit text next to symbol in parentheses
      graphicGroup.children.push({
        type: 'text',
        style: {
          text: `(${unit})`,
          fill: '#cbd5e1',
          font: '500 12px sans-serif'
        },
        left: isBar ? 12 : 24,
        top: 0
      });

      graphics.push(graphicGroup);
    }

    return {
      animation: false,
      graphic: graphics,
      grid: {
        top: 56,
        right: rightGridPadding,
        bottom: 80,
        left: 64,
        containLabel: false
      },
      legend: {
        top: 10,
        textStyle: {
          color: '#e5e7eb'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: labels,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#64748b' } },
        axisLabel: {
          color: '#cbd5e1',
          rotate: 45,
          interval: 'auto',
          hideOverlap: true,
          margin: 12
        }
      },
      yAxis,
      series
    };
  }, [feature, selectedParams, syncedScales, timestamps]);

  return (
    <div className="chart-container" style={{ position: 'relative', height: '600px' }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge lazyUpdate />
    </div>
  );
};
