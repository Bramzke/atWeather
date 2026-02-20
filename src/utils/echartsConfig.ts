// ECharts Tree-Shaking: Nur tatsächlich verwendete Module importieren.
// Dadurch wird die Bundle-Größe deutlich reduziert gegenüber dem
// vollständigen ECharts-Import ("import * as echarts from 'echarts'").
import * as echarts from 'echarts/core';

// Diagrammtypen: Liniendiagramm (Temperatur, Luftfeuchtigkeit, Niederschlag)
//                Balkendiagramm (Sonnenscheindauer)
import { LineChart, BarChart } from 'echarts/charts';

// Komponenten die in den Charts verwendet werden
import {
  GridComponent,      // Zeichenfläche (Koordinatensystem)
  TooltipComponent,   // Hover-Tooltip mit Messwerten
  LegendComponent,    // Legende (Parameternamen)
  GraphicComponent    // Benutzerdefinierte Grafiken (Achsensymbole)
} from 'echarts/components';

// Renderer: Canvas ist performanter als SVG für viele Datenpunkte
import { CanvasRenderer } from 'echarts/renderers';

// Alle verwendeten Module bei ECharts registrieren
echarts.use([
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  GraphicComponent,
  CanvasRenderer
]);

export default echarts;
