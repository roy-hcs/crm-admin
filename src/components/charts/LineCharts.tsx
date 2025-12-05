import { getCssVar } from '@/lib/utils';
import {
  Chart as ChartJS,
  type Chart as ChartType,
  type ChartArea,
  type Plugin,
  type ChartDataset,
  type Point,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { useEffect, useState, type FC } from 'react';
import { Line } from 'react-chartjs-2';

// Register the components we need
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

type ChartPoint = {
  x: number;
  y: number;
  options?: { radius?: number };
};
interface LineChartProps {
  lineChartProps: {
    labels?: string[];
    datasets: {
      label?: string;
      data: number[];
      borderColor?: string;
      borderWidth?: number;
      tension?: number;
      pointRadius?: number;
      pointHoverRadius?: number;
      pointStyle?: string;
      pointBackgroundColor?: string;
    }[];
  };
}

const gradientFillPlugin: Plugin<'line'> = {
  id: 'gradientFillPlugin',
  beforeDatasetsDraw(chart: ChartType<'line'>) {
    const ctx = chart?.ctx as CanvasRenderingContext2D | null;
    const chartArea = chart.chartArea as ChartArea | undefined;
    if (!chartArea || !ctx) return;

    const CACHE_TOP = '_gradientChartAreaTop';
    const CACHE_BOTTOM = '_gradientChartAreaBottom';

    const parseHex = (hex: string) => {
      const cleaned = hex.replace('#', '').trim();
      if (!/^[0-9a-fA-F]+$/.test(cleaned)) return null;
      // support 3,4,6,8 length
      if (cleaned.length === 3 || cleaned.length === 4) {
        const r = cleaned[0] + cleaned[0];
        const g = cleaned[1] + cleaned[1];
        const b = cleaned[2] + cleaned[2];
        return { r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16) };
      }
      if (cleaned.length === 6 || cleaned.length === 8) {
        const r = cleaned.substring(0, 2);
        const g = cleaned.substring(2, 4);
        const b = cleaned.substring(4, 6);
        return { r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16) };
      }
      return null;
    };

    const toRgbaWithAlpha = (colorStr: string, alpha: number) => {
      try {
        const s = colorStr.trim();
        if (s.startsWith('#')) {
          const rgb = parseHex(s);
          if (rgb) return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
        }
        if (s.startsWith('rgb(')) {
          return s.replace(/rgb\(([^)]+)\)/, (_m, inner) => `rgba(${inner},${alpha})`);
        }
        if (s.startsWith('rgba(')) {
          // replace existing alpha with provided alpha
          return s.replace(
            /rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/,
            (_m, r, g, b) => `rgba(${r},${g},${b},${alpha})`,
          );
        }
        // fallback to use the string as-is (may be a css color name) — can't reliably inject alpha
        return s;
      } catch {
        return null;
      }
    };

    chart.data.datasets.forEach((ds: ChartDataset<'line', (number | Point | null)[]>) => {
      // Respect dataset-level backgroundColor (scriptable or explicit)
      if (ds.backgroundColor != null) return;

      // Recreate gradient only when chart area changed
      if (
        (ds as unknown as Record<string, unknown>)[CACHE_TOP] === chartArea.top &&
        (ds as unknown as Record<string, unknown>)[CACHE_BOTTOM] === chartArea.bottom
      )
        return;

      const bc = String(ds.borderColor ?? '');

      let gradient: CanvasGradient | string;
      try {
        gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        const topColor = toRgbaWithAlpha(bc, 0.4) || 'rgba(0,0,0,0.4)';
        gradient.addColorStop(0, topColor);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
      } catch {
        gradient = 'rgba(0,0,0,0.08)';
      }

      try {
        (ds as unknown as Record<string, unknown>).backgroundColor = gradient;
        if (ds.fill == null) (ds as unknown as Record<string, unknown>).fill = 'start';
        (ds as unknown as Record<string, unknown>)[CACHE_TOP] = chartArea.top;
        (ds as unknown as Record<string, unknown>)[CACHE_BOTTOM] = chartArea.bottom;
      } catch {
        // ignore if dataset is frozen/unexpected shape
      }
    });
  },
};

const pointValuePlugin: Plugin<'line'> = {
  id: 'pointValuePlugin',
  afterDatasetsDraw(chart: ChartType<'line'>) {
    const ctx = chart.ctx as CanvasRenderingContext2D | null;
    if (!ctx) return;

    chart.data.datasets.forEach(
      (dataset: ChartDataset<'line', (number | Point | null)[]>, datasetIndex: number) => {
        const meta = chart.getDatasetMeta(datasetIndex) as { data?: ChartPoint[] } | null;
        if (!meta || !meta.data) return;
        meta.data.forEach((point: ChartPoint, index: number) => {
          const dsData = dataset.data ?? [];
          const val = dsData[index];
          if (val === null || val === undefined) return;
          const radius = point.options?.radius ?? dataset.pointRadius ?? 4;
          const x = point.x;
          const y = point.y - (radius as number) - 4; // 4px above the top of the point

          // Prefer a legendColor set on chart options.plugins.pointValuePlugin.legendColor
          const opts = chart.options as ChartOptions<'line'> | undefined;
          const pluginOpts = (opts?.plugins as Record<string, unknown> | undefined)
            ?.pointValuePlugin as { legendColor?: string } | undefined;
          const fill = pluginOpts?.legendColor ?? '#000';
          ctx.save();
          ctx.fillStyle = String(fill);
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          const text = typeof val === 'number' ? `$${val}` : String(val);
          ctx.fillText(text, x, y);
          ctx.restore();
        });
      },
    );
  },
};

export const LineChart: FC<LineChartProps> = ({ lineChartProps }) => {
  const [legendColor, setLegendColor] = useState(() => getCssVar('--card-foreground', '#0a0a0a'));
  const [borderColor, setBorderColor] = useState(() => getCssVar('--border', '#E1E3EA'));

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      // pass legendColor for pointValuePlugin to use when drawing values
      pointValuePlugin: {
        legendColor,
      },
    } as unknown as ChartOptions<'line'>['plugins'],
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: { display: false },
      },
      y: {
        grid: {
          display: true,
          color: borderColor,
          lineWidth: 1,
        },
        border: { display: false },
      },
    },
  };

  useEffect(() => {
    const handler = () => {
      setLegendColor(getCssVar('--card-foreground', '#0a0a0a'));
      setBorderColor(getCssVar('--border', 'red'));
    };
    window.addEventListener('themechange', handler as EventListener);
    return () => window.removeEventListener('themechange', handler as EventListener);
  }, []);

  return (
    <div className="h-full w-full">
      <Line
        options={lineOptions}
        data={lineChartProps}
        plugins={[gradientFillPlugin, pointValuePlugin]}
      />
    </div>
  );
};
