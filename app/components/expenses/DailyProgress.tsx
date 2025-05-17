import { Box, Progress, Text, Flex, Badge } from '@chakra-ui/react';
import { useExpense } from '@/contexts/ExpenseContext';
import { calculateDailySpending, formatCurrency, getDayOfWeek } from '@/lib/utils';

export default function DailyProgress() {
  const { expenses, dailyBudget } = useExpense();
  const today = new Date();
  const dayOfWeek = getDayOfWeek(today);
  const todayBudget = dailyBudget?.[dayOfWeek] ?? 0;
  const todaySpending = calculateDailySpending(expenses, today);

  const percentage =
    todayBudget > 0
      ? Math.min(100, (todaySpending / todayBudget) * 100)
      : 100;

  const getProgressColor = () => {
    if (percentage < 50) return 'green';
    if (percentage < 80) return 'yellow';
    return 'red';
  };

  const getDayName = () => {
    const days = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo',
    };
    return days[dayOfWeek];
  };

  const isOverBudget = todaySpending > todayBudget;

  return (
    <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
      <Flex justify="space-between" align="center" mb={2}>
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            Orçamento de Hoje
          </Text>
          <Text color="gray.600">{getDayName()}</Text>
        </Box>
        <Badge
          colorScheme={isOverBudget ? 'red' : 'green'}
          fontSize="md"
          py={1}
          px={2}
          borderRadius="md"
        >
          {isOverBudget ? 'Acima do orçamento' : 'Dentro do orçamento'}
        </Badge>
      </Flex>

      <Progress
        value={percentage}
        size="md"
        colorScheme={getProgressColor()}
        borderRadius="md"
        mt={4}
        hasStripe
        isAnimated={percentage < 100}
      />

      <Flex justify="space-between" mt={2}>
        <Text>Gasto: {formatCurrency(todaySpending)}</Text>
        <Text>Orçamento: {formatCurrency(todayBudget)}</Text>
      </Flex>

      <Flex justify="center" mt={3}>
        <Text
          fontWeight="semibold"
          color={isOverBudget ? 'red.500' : 'green.500'}
        >
          {isOverBudget
            ? `Excedido: ${formatCurrency(todaySpending - todayBudget)}`
            : `Restante: ${formatCurrency(todayBudget - todaySpending)}`}
        </Text>
      </Flex>
    </Box>
  );
}
