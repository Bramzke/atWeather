import { useMemo, useRef, useEffect, memo } from 'react';
import echarts from '../../utils/echartsConfig';
import type { Feature } from '../../models/WeatherResponse';
import type { ParameterSelection } from '../../models/ChartTypes';
import { formatTimestamp } from '../../utils/dateUtils';
import { getParameterColor, getYAxisId, getParameterUnit } from '../../utils/chartHelpers';
import type { ScaleConfig } from '../../hooks/useScaleSynchronization';
import type { useInterpolatedData } from '../../hooks/useInterpolatedData';

interface Props {
  feature: Feature;           // API-Feature einer einzelnen Wetterstation
  timestamps: string[];       // Zeitstempel für die X-Achse (ISO-Format)
  selectedParams: ParameterSelection; // Welche Parameter angezeigt werden sollen
  syncedScales?: ScaleConfig; // Synchronisierte Y-Achsen-Grenzen (optional)
  interpolatedDataCache: ReturnType<typeof useInterpolatedData>; // Vorberechneter Datencache
}

type ParameterType = keyof ParameterSelection;
type ApiParameter = 'TL' | 'RF' | 'RR' | 'SO';

/** Konfiguration für einen darstellbaren Wetterparameter */
interface ParameterConfig {
  key: ParameterType;         // Interner Schlüssel (z.B. 'temperature')
  apiParam: ApiParameter;     // API-Parametername (z.B. 'TL')
  label: string;              // Anzeigetext in Legende und Tooltip
  seriesType: 'line' | 'bar'; // Diagrammtyp
}

/**
 * Feste Konfiguration aller darstellbaren Wetterparameter.
 * Reihenfolge bestimmt die Achsenreihenfolge im Diagramm:
 * Erster Eintrag → linke Y-Achse, alle weiteren → rechte Y-Achsen.
 */
const PARAMETER_CONFIG: ParameterConfig[] = [
  { key: 'temperature', apiParam: 'TL', label: 'Temperatur',      seriesType: 'line' },
  { key: 'humidity',    apiParam: 'RF', label: 'Luftfeuchtigkeit', seriesType: 'line' },
  { key: 'rainfall',   apiParam: 'RR', label: 'Niederschlag',     seriesType: 'line' },
  { key: 'sunshine',   apiParam: 'SO', label: 'Sonnenschein',     seriesType: 'bar'  }
];

/**
 * Custom Hook: ECharts-Instanz verwalten.
 *
 * Initialisiert den Chart einmalig auf dem DOM-Element, aktualisiert ihn bei
 * Optionsänderungen und räumt die Instanz beim Unmount auf. Durch useRef
 * wird der Chart-Container direkt referenziert ohne React-Re-Renders auszulösen.
 */
function useECharts(option: any) {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Chart nur einmalig initialisieren (nicht bei jedem Re-Render neu erstellen)
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current);
    }

    // Optionen aktualisieren (notMerge: altes State vollständig ersetzen)
    instanceRef.current.setOption(option, { notMerge: true, lazyUpdate: true });

    // ResizeObserver: Chart neu zeichnen wenn sich die Container-Größe ändert.
    // Reagiert sowohl auf Fenstergrößenänderungen als auch auf den Vollbild-Toggle.
    const resizeObserver = new ResizeObserver(() => {
      instanceRef.current?.resize();
    });
    resizeObserver.observe(chartRef.current);

    // Cleanup: Observer und Chart-Instanz beim Unmount freigeben
    return () => {
      resizeObserver.disconnect();
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, [option]);

  return chartRef;
}

/**
 * WeatherChart-Komponente: ECharts-Diagramm für eine einzelne Wetterstation.
 *
 * Rendert bis zu 4 Y-Achsen (eine pro Parameter): die erste links, alle weiteren
 * rechts mit je 56px Abstand. Für jede Achse wird ein kleines Einheitensymbol
 * als ECharts-Graphic über dem Diagrammbereich eingeblendet.
 *
 * Umwickelt mit React.memo, um unnötige Re-Renders bei unveränderten Props zu vermeiden.
 */
const WeatherChartComponent = ({ feature, timestamps, selectedParams, syncedScales, interpolatedDataCache }: Props) => {

  /**
   * ECharts-Optionsobjekt: wird nur neu berechnet wenn sich relevante Props ändern.
   * Beinhaltet Y-Achsen, Serien, Grid, Legende, Tooltip und Achsensymbole.
   */
  const option = useMemo(() => {
    const labels = timestamps.map(formatTimestamp); // Zeitstempel in lesbares Format umwandeln
    const yAxis: Record<string, unknown>[] = [];
    const series: Record<string, unknown>[] = [];
    const params = feature.properties.parameters;

    let rightAxisCount = 0; // Zähler für rechte Y-Achsen (bestimmt den Offset)

    // --- Y-Achsen und Serien aufbauen ---
    for (const config of PARAMETER_CONFIG) {
      // Überspringe nicht ausgewählte Parameter
      if (!selectedParams[config.key]) continue;

      // Überspringe Parameter die in den API-Daten nicht vorhanden sind
      const parameter = params[config.apiParam];
      if (!parameter) continue;

      const yAxisId = getYAxisId(config.key);
      const yAxisIndex = yAxis.length;
      const isFirstAxis = yAxisIndex === 0;
      const position = isFirstAxis ? 'left' : 'right';
      // Jede rechte Achse wird um 56px nach außen versetzt um Überlappung zu verhindern
      const offset = isFirstAxis ? 0 : rightAxisCount * 56;
      const syncedScale = syncedScales?.[yAxisId];

      if (!isFirstAxis) {
        rightAxisCount += 1;
      }

      // Vorberechnete interpolierte Daten aus dem Cache holen
      const interpolatedData = interpolatedDataCache.get(feature.properties.station, config.apiParam);

      // Y-Achsen-Grenzen: entweder synchronisiert (alle Stationen gleich) oder lokal (nur diese Station)
      let localMin: number | undefined = syncedScale?.min;
      let localMax: number | undefined = syncedScale?.max;

      if (!syncedScale && interpolatedData && interpolatedData.length > 0) {
        // Keine Synchronisierung aktiv: lokale Min/Max-Werte dieser Station berechnen
        localMin = Math.min(...interpolatedData);
        localMax = Math.max(...interpolatedData);
      }

      yAxis.push({
        id: yAxisId,
        type: 'value',
        position,
        offset,
        min: localMin,
        max: localMax,
        axisLine: { show: true },
        axisTick: { show: true },
        splitLine: { show: isFirstAxis, lineStyle: { color: '#64748b' } }, // Gitterlinien nur für die erste (linke) Achse
        axisLabel: { color: '#cbd5e1' },
        name: '',
        nameLocation: 'end',
        nameGap: 0
      });

      series.push({
        name: `${config.label} (${getParameterUnit(config.key)})`,
        type: config.seriesType,
        yAxisIndex,
        data: interpolatedData || [],
        smooth: false,
        symbol: 'none',       // Keine Datenpunkte an jedem Messwert
        barMaxWidth: 18,      // Maximale Balkenbreite für Sonnenschein-Balken
        lineStyle: {
          width: 2,
          color: getParameterColor(config.key)
        },
        itemStyle: {
          color: getParameterColor(config.key)
        },
        emphasis: {
          focus: 'series'     // Beim Hover: Fokus auf die gesamte Serie
        }
      });
    }

    // Rechter Grid-Rand: Platz für alle rechten Y-Achsen einplanen
    const rightGridPadding = 56 + Math.max(0, rightAxisCount - 1) * 56;

    // --- Achsensymbole (ECharts Graphics) aufbauen ---
    // Kleine Icon-Symbole über jeder Y-Achse zeigen Diagrammtyp und Einheit an
    const graphics: any[] = [];
    let graphicIndex = 0;
    let rightGraphicCount = 0;

    // Gesamtanzahl der rechten Achsen für die umgekehrte Positionierung ermitteln
    const totalParams = PARAMETER_CONFIG.filter(c =>
      selectedParams[c.key] && params[c.apiParam]
    ).length;
    const totalRightAxes = totalParams - 1;

    for (const config of PARAMETER_CONFIG) {
      if (!selectedParams[config.key]) continue;

      const parameter = params[config.apiParam];
      if (!parameter) continue;

      const isFirstAxis = graphicIndex === 0;
      const position = isFirstAxis ? 'left' : 'right';
      const color = getParameterColor(config.key);
      const unit = getParameterUnit(config.key);
      const isBar = config.seriesType === 'bar';

      const yPosition = 30; // Vertikale Position der Symbole (über dem Diagrammbereich)

      // Gruppe für das Achsensymbol (enthält Icon + Einheitentext)
      const graphicGroup: any = {
        type: 'group',
        top: yPosition,
        z: 100,
        children: []
      };

      if (position === 'left') {
        // Linke Achse: Symbol am linken Rand positionieren
        graphicGroup.left = 48;
      } else {
        // Rechte Achsen: von rechts positioniert, in umgekehrter Reihenfolge
        // damit die Achsenreihenfolge mit der Legendenreihenfolge übereinstimmt
        graphicGroup.right = 12 + ((totalRightAxes - rightGraphicCount - 1) * 56);
        rightGraphicCount++;
      }

      graphicIndex++;

      if (isBar) {
        // Balkensymbol: [▌▌] – zwei Rechtecke unterschiedlicher Höhe
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
        // Liniensymbol: [—●—] – Linie mit Mittelpunkt
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

      // Einheitentext neben dem Symbol (z.B. "°C", "%", "mm", "min")
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

    // --- Vollständiges ECharts-Optionsobjekt zusammenstellen ---
    return {
      animation: false, // Animation deaktiviert für bessere Performance bei vielen Datenpunkten
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
        trigger: 'axis' // Tooltip für alle Serien am gleichen Zeitpunkt
      },
      xAxis: {
        type: 'category',
        data: labels,
        boundaryGap: false, // Linie beginnt am linken Rand (kein Einzug)
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisLabel: {
          color: '#cbd5e1',
          rotate: 45,       // 45° Drehung für bessere Lesbarkeit bei vielen Labels
          interval: 'auto', // ECharts bestimmt automatisch welche Labels angezeigt werden
          hideOverlap: true,
          margin: 12
        }
      },
      yAxis,
      series
    };
  }, [feature, selectedParams, syncedScales, timestamps, interpolatedDataCache]);

  const chartRef = useECharts(option);

  return (
    <div className="chart-container" style={{ position: 'relative', height: '600px' }}>
      <div ref={chartRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

// React.memo: verhindert unnötige Re-Renders wenn Props unverändert sind
export const WeatherChart = memo(WeatherChartComponent);
