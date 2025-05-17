'use client'
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, useColorModeValue } from '@chakra-ui/react';
import { Expense, DailyBudget } from '@/lib/types';
import { 
  calculateDailySpending, 
  calculateWeeklySpending, 
  calculateMonthlySpending,
  formatCurrency,
  getDayOfWeek
} from '@/lib/utils';

interface ExpenseSummaryProps {
  expenses: Expense[];
  dailyBudget: DailyBudget;
}

export default function ExpenseSummary({ expenses, dailyBudget }: ExpenseSummaryProps) {
  const today = new Date();
  const dayOfWeek = getDayOfWeek(today);
  
  const dailyTotal = calculateDailySpending(expenses, today);
  const weeklyTotal = calculateWeeklySpending(expenses, today);
  const monthlyTotal = calculateMonthlySpending(expenses, today);
  
  const dailyBudgetValue = dailyBudget[dayOfWeek];
  const dailyRemaining = dailyBudgetValue - dailyTotal;
  
  
  const getWeeklyBudget = () => {
    let total = 0;
    for (const day in dailyBudget) {
      total += dailyBudget[day as keyof DailyBudget];
    }
    return total;
  };
  
  const weeklyBudget = getWeeklyBudget();
  const weeklyRemaining = weeklyBudget - weeklyTotal;
  
  
  const monthlyBudget = weeklyBudget * 4;
  const monthlyRemaining = monthlyBudget - monthlyTotal;
  
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
      <Box p={5} bg={bgColor} borderRadius="lg" boxShadow="sm">
        <Stat>
          <StatLabel color={textColor}>Hoje</StatLabel>
          <StatNumber fontSize="2xl" color="blue.500">{formatCurrency(dailyTotal)}</StatNumber>
          <StatHelpText color={dailyRemaining >= 0 ? 'green.500' : 'red.500'}>
            {dailyRemaining >= 0 
              ? `${formatCurrency(dailyRemaining)} restante`
              : `${formatCurrency(Math.abs(dailyRemaining))} acima do orçamento`}
          </StatHelpText>
        </Stat>
      </Box>
      
      <Box p={5} bg={bgColor} borderRadius="lg" boxShadow="sm">
        <Stat>
          <StatLabel color={textColor}>Esta Semana</StatLabel>
          <StatNumber fontSize="2xl" color="blue.500">{formatCurrency(weeklyTotal)}</StatNumber>
          <StatHelpText color={weeklyRemaining >= 0 ? 'green.500' : 'red.500'}>
            {weeklyRemaining >= 0 
              ? `${formatCurrency(weeklyRemaining)} restante`
              : `${formatCurrency(Math.abs(weeklyRemaining))} acima do orçamento`}
          </StatHelpText>
        </Stat>
      </Box>
      
      <Box p={5} bg={bgColor} borderRadius="lg" boxShadow="sm">
        <Stat>
          <StatLabel color={textColor}>Este Mês</StatLabel>
          <StatNumber fontSize="2xl" color="blue.500">{formatCurrency(monthlyTotal)}</StatNumber>
          <StatHelpText color={monthlyRemaining >= 0 ? 'green.500' : 'red.500'}>
            {monthlyRemaining >= 0 
              ? `${formatCurrency(monthlyRemaining)} restante`
              : `${formatCurrency(Math.abs(monthlyRemaining))} acima do orçamento`}
          </StatHelpText>
        </Stat>
      </Box>
    </SimpleGrid>
  );
}