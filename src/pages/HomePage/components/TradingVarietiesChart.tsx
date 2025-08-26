import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { Plugin, Chart, ArcElement as ArcElementType } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const pieData = {
  labels: ['EURUSD', 'USDJPY', 'GBPUSD', 'USDJPY', 'EURUSD'],
  datasets: [
    {
      data: [64, 12, 8, 8, 8], // 百分比
      backgroundColor: [
        '#B684E6', // 紫色
        '#3995F2', // 蓝色
        '#F25A5A', // 红色
        '#F2A65A', // 橙色
        '#4FA64F', // 绿色
      ],
      borderWidth: 0,
    },
  ],
};

const pieOptions = {
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: ({ label, parsed }: { label: string; parsed: number }) => {
          return `${label}: ${parsed}%`;
        },
      },
    },
  },
};

const assetList = [
  { color: '#4FA64F', name: 'USDJPY', volume: '100.23' },
  { color: '#3995F2', name: 'EURUSD', volume: '100.23' },
  { color: '#F25A5A', name: 'GBPUSD', volume: '100.23' },
  { color: '#F2A65A', name: 'USDJPY', volume: '100.23' },
  { color: '#B684E6', name: 'EURUSD', volume: '100.23' },
];

export default function TradingVarietiesChart() {
  // Pie图中间显示百分比（类型安全的插件）
  const centerTextPlugin: Plugin<'pie'> = {
    id: 'centerText',
    afterDraw(chart: Chart<'pie'>) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      meta.data.forEach((el, i) => {
        const arc = el as unknown as ArcElementType;
        const start = arc.startAngle;
        const end = arc.endAngle;
        const angle = start + (end - start) / 2;
        const radius = arc.outerRadius * 0.7;
        const value = chart.data.datasets[0].data[i] as number;

        ctx.save();
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const x = chart.chartArea.left + chart.chartArea.width / 2 + radius * Math.cos(angle);
        const y = chart.chartArea.top + chart.chartArea.height / 2 + radius * Math.sin(angle);
        ctx.fillText(`${value}%`, x, y);
        ctx.restore();
      });
    },
  };
  const plugins: Plugin<'pie'>[] = [centerTextPlugin];

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: 300, height: 300 }}>
        <Pie data={pieData} options={pieOptions} plugins={plugins} />
      </div>
      <div style={{ marginLeft: 162 }}>
        <div style={{ display: 'flex', fontWeight: 600, fontSize: 16, marginBottom: 16 }}>
          <div style={{ width: 120 }}>Asset</div>
          <div>Volume(Lot)</div>
        </div>
        {assetList.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: item.color,
                marginRight: 10,
              }}
            ></span>
            <div style={{ width: 110, color: '#222' }}>{item.name}</div>
            <div style={{ color: '#222' }}>{item.volume}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
