import { useState } from 'react';
import { Box, Flex, Text, Select } from '@chakra-ui/react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Sector } from 'recharts';
import { Expense, PaymentMethod } from '@/lib/types';
import { groupExpensesByDay, formatCurrency } from '@/lib/utils';

interface ExpenseChartProps {
  expenses: Expense[];
}

type ChartType = 'daily' | 'payment';

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  const [chartType, setChartType] = useState<ChartType>('daily');
  const [activeIndex, setActiveIndex] = useState(0);
  
  const getDailyData = () => {
    const groupedExpenses = groupExpensesByDay(expenses);
    
    return Object.entries(groupedExpenses)
      .map(([date, exps]) => ({
        date,
        total: exps.reduce((sum, exp) => sum + exp.total, 0),
      }))
      .sort((a, b) => {
        const dateA = a.date.split('/').reverse().join('-');
        const dateB = b.date.split('/').reverse().join('-');
        return dateA.localeCompare(dateB);
      })
      .slice(-7); 
  };
  
  
  const getPaymentMethodData = () => {
    const paymentMethods: Record<PaymentMethod | string, number> = {};
    
    expenses.forEach(expense => {
      const method = expense.paymentMethod;
      if (!paymentMethods[method]) {
        paymentMethods[method] = 0;
      }
      paymentMethods[method] += expense.total;
    });
    
    return Object.entries(paymentMethods).map(([name, value]) => ({ name, value }));
  };
  
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box bg="white" p={2} border="1px solid" borderColor="gray.200" borderRadius="md" boxShadow="sm">
          <Text fontWeight="bold">{label}</Text>
          <Text color="blue.500">{formatCurrency(payload[0].value)}</Text>
        </Box>
      );
    }
    return null;
  };
  
  
  const renderActiveShape = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
    
    const getPaymentMethodLabel = (method: string) => {
      switch (method) {
        case 'Cash': return 'Dinheiro';
        case 'Credit Card': return 'Cartão de Crédito';
        case 'Debit Card': return 'Cartão de Débito';
        case 'Pix': return 'Pix';
        default: return method;
      }
    };
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontSize={12}>{getPaymentMethodLabel(payload.name)}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={12}>
          {`${(percent * 100).toFixed(2)}%`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={36} textAnchor={textAnchor} fill="#333" fontSize={12}>
          {formatCurrency(value)}
        </text>
      </g>
    );
  };
  
  const dailyData = getDailyData();
  const paymentMethodData = getPaymentMethodData();
  
  
  const barColor = '#0078D7'; 
  const pieColors = ['#0078D7', '#FF8C00', '#00A3C4', '#9F7AEA', '#38A169'];
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">Análise de Despesas</Text>
        <Select 
          value={chartType} 
          onChange={(e) => setChartType(e.target.value as ChartType)}
          width="auto"
        >
          <option value="daily">Diário</option>
          <option value="payment">Forma de Pagamento</option>
        </Select>
      </Flex>
      
      <Box height="300px">
        {chartType === 'daily' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis formatter={(value: number) => formatCurrency(value).split(' ')[1]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="total" name="Total Gasto" fill={barColor} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
}