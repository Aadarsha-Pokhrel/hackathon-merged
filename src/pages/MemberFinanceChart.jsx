import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Area
} from "recharts";

import { buildCumulativeSeriesFromMember } from "../Member/graphfunction";

// Custom tooltip for better readability
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 border border-gray-700 rounded-lg p-4 shadow-xl">
        <p className="text-white font-semibold mb-3 border-b border-gray-700 pb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-6 mb-1.5">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-300">
                {entry.name}:
              </span>
            </div>
            <span className="font-bold text-sm text-white">
              NPR {entry.value?.toLocaleString() || 0}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Format currency for Y-axis
const formatCurrency = (value) => {
  if (value >= 100000) {
    return `${(value / 100000).toFixed(1)}L`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value;
};

const MemberFinanceChart = ({ memberData }) => {
  const chartData = buildCumulativeSeriesFromMember(memberData);

  // Calculate summary statistics
  const latestData = chartData[chartData.length - 1] || {};
  const totalDeposits = latestData.cumulativeDeposit || 0;
  const totalLoans = latestData.cumulativeLoan || 0;
  const netBalance = totalDeposits - totalLoans;

  return (
    <div className="w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-lg">
      {/* Header with Summary Stats */}
      <div className="mb-6">
        <h3 className="text-white text-xl font-bold mb-4">
          Financial Timeline
        </h3>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <p className="text-emerald-400 text-xs font-medium mb-1">Total Deposits</p>
            <p className="text-white text-lg font-bold">
              NPR {totalDeposits.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
            <p className="text-rose-400 text-xs font-medium mb-1">Total Loans Taken</p>
            <p className="text-white text-lg font-bold">
              NPR {totalLoans.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-400 text-xs font-medium mb-1">Net Position</p>
            <p className={`text-lg font-bold ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              NPR {netBalance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 60 }}
          >
            <defs>
              <linearGradient id="depositGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="loanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              tick={{ fill: '#d1d5db', fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            
            <YAxis 
              stroke="#9ca3af"
              tick={{ fill: '#d1d5db', fontSize: 12 }}
              tickFormatter={formatCurrency}
              label={{ 
                value: 'Amount (NPR)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: '#d1d5db', fontSize: 12 }
              }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="rect"
            />

            {/* Area for cumulative deposits */}
            <Area
              type="monotone"
              dataKey="cumulativeDeposit"
              fill="url(#depositGradient)"
              stroke="#10b981"
              strokeWidth={2}
              name="Cumulative Deposits"
            />

            {/* Area for cumulative loans */}
            <Area
              type="monotone"
              dataKey="cumulativeLoan"
              fill="url(#loanGradient)"
              stroke="#f43f5e"
              strokeWidth={2}
              name="Cumulative Loans"
            />

            {/* Bars for individual deposits */}
            <Bar
              dataKey="depositAmount"
              fill="#10b981"
              opacity={0.6}
              name="Deposit"
              radius={[4, 4, 0, 0]}
            />

            {/* Bars for individual loans */}
            <Bar
              dataKey="loanAmount"
              fill="#f43f5e"
              opacity={0.6}
              name="Loan Taken"
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend explanation */}
      <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded mt-0.5" />
          <p className="text-gray-300 text-xs flex-1">
            <span className="font-semibold text-emerald-400">Deposits:</span> Individual bars show each deposit, and the area shows cumulative total
          </p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 bg-rose-500 rounded mt-0.5" />
          <p className="text-gray-300 text-xs flex-1">
            <span className="font-semibold text-rose-400">Loans:</span> Individual bars show each loan taken, and the area shows cumulative total
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberFinanceChart;