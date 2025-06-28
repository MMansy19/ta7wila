"use client";

import useCurrency from '@/app/[lang]/dashboard/Shared/useCurrency';
import { useTranslation } from '@/hooks/useTranslation';
import {
    BarElement,
    CategoryScale,
    ChartData,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    Title,
    Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PaymentBreakdown {
  count: number;
  totalAmount: number;
}

interface TransactionStats {
  transactionCount: number;
  totalAmount: number;
  totalAmountExcludeFees: number;
  totalPlatformFees: number;
  totalDeveloperFees: number;
  totalFees: number;
}

interface TransactionPeriodData {
  period: string;
  startDate: string;
  endDate: string;
  stats: TransactionStats;
  paymentBreakdown: Record<string, PaymentBreakdown>;
}

interface TransactionAnalysisProps {
  data: TransactionPeriodData[];
  timeframe: string;
  period: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export default function TransactionAnalysisChart({ 
  data = [], 
  timeframe = "weekly", 
  period = "current", 
  dateRange = {
    start: new Date().toISOString(),
    end: new Date().toISOString()
  }
}: TransactionAnalysisProps) {
  const translations = useTranslation();
  const formatCurrency = useCurrency();

  if (!data || data.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-xl p-6 shadow-lg w-full">
        <div className="text-center py-8">
          <p className="text-xl text-white/70 mb-2">{translations.transactions.noData}</p>
          <p className="text-sm text-white/50">{translations.transactions.noTransactions}</p>
        </div>
      </div>
    );
  }

  // Calculate overall totals
  const totals = data.reduce((acc, item) => ({
    transactionCount: acc.transactionCount + item.stats.transactionCount,
    totalAmount: acc.totalAmount + item.stats.totalAmount,
    totalFees: acc.totalFees + item.stats.totalFees
  }), {
    transactionCount: 0,
    totalAmount: 0,
    totalFees: 0
  });

  // Get all unique payment methods and sort them by total amount
  const paymentMethods = Array.from(new Set(
    data.flatMap(item => Object.keys(item.paymentBreakdown))
  )).sort((a, b) => {
    const totalA = data.reduce((sum, item) => sum + (item.paymentBreakdown[a]?.totalAmount || 0), 0);
    const totalB = data.reduce((sum, item) => sum + (item.paymentBreakdown[b]?.totalAmount || 0), 0);
    return totalB - totalA;
  });

  // Define consistent colors for payment methods
  const brandColors = {
    primary: { base: 'rgba(83, 180, 171, %a)', solid: 'rgba(83, 180, 171, 1)' },
    secondary: { base: 'rgba(245, 140, 123, %a)', solid: 'rgba(245, 140, 123, 1)' },
    accent: { base: 'rgba(13, 219, 200, %a)', solid: 'rgba(13, 219, 200, 1)' },
    gray: { base: 'rgba(126, 126, 126, %a)', solid: 'rgba(126, 126, 126, 1)' },
    darkGray: { base: 'rgba(42, 42, 42, %a)', solid: 'rgba(42, 42, 42, 1)' }
  } as const;

  // Prepare chart data
  const chartData: ChartData<'bar'> = {
    labels: data.map(item => item.period),
    datasets: paymentMethods.map((method, index) => {
      const colorKey = ['primary', 'secondary', 'accent', 'gray', 'darkGray'][index % 5] as keyof typeof brandColors;
      return {
        label: method.toUpperCase(),
        data: data.map(item => item.paymentBreakdown[method]?.totalAmount || 0),
        backgroundColor: brandColors[colorKey].base.replace('%a', '0.8'),
        borderColor: brandColors[colorKey].solid,
        borderWidth: 1,
        borderRadius: 4,
      };
    }),
  };

  // Prepare chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: `${translations.transactions.analysis.title} (${timeframe} - ${period})`,
        color: 'white',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'rgba(255, 255, 255, 0.7)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            return `${context.dataset.label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        stacked: true,
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11
          },
          callback: (value) => formatCurrency(value as number)
        }
      }
    }
  };

  return (
    <div className="bg-neutral-900 rounded-xl p-6 shadow-lg w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#1E1E1E] p-5 rounded-xl shadow-lg hover:bg-[#1a1a1a] transition-colors duration-200">
          <h3 className="text-lg font-semibold mb-2 text-white">
            {translations.transactions.analysis.stats.totalTransactions}
          </h3>
          <div className="text-2xl font-medium text-[#53B4AB]">
            {totals.transactionCount.toLocaleString()}
          </div>
        </div>
        <div className="bg-[#1E1E1E] p-5 rounded-xl shadow-lg hover:bg-[#1a1a1a] transition-colors duration-200">
          <h3 className="text-lg font-semibold mb-2 text-white">
            {translations.transactions.analysis.stats.totalAmount}
          </h3>
          <div className="text-2xl font-medium text-[#53B4AB]">
            {formatCurrency(totals.totalAmount)}
          </div>
        </div>
        <div className="bg-[#1E1E1E] p-5 rounded-xl shadow-lg hover:bg-[#1a1a1a] transition-colors duration-200">
          <h3 className="text-lg font-semibold mb-2 text-white">
            {translations.transactions.analysis.stats.totalFees}
          </h3>
          <div className="text-2xl font-medium text-[#53B4AB]">
            {formatCurrency(totals.totalFees)}
          </div>
        </div>
      </div>

      <div className="text-sm text-neutral-400 mb-4">
        {translations.transactions.analysis.dateRange.title}:{" "}
        <span className="text-white">
          {new Date(dateRange.start).toLocaleDateString()} -{" "}
          {new Date(dateRange.end).toLocaleDateString()}
        </span>
      </div>

      <div className="h-[400px]">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
}
