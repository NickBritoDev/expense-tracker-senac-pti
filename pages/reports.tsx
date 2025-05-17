import {
  Box,
  Heading,
  VStack,
  Flex,
  SimpleGrid,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useExpense } from '@/contexts/ExpenseContext';
import FilterBar from '@/components/expenses/FilterBar';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import ExpenseSummary from '@/components/reports/ExpenseSummary';
import ExpenseChart from '@/components/reports/ExpenseChart';
import ExportOptions from '@/components/reports/ExportOptions';
import { formatDate } from '@/lib/utils';

export default function ReportsPage() {
  const { expenses, filteredExpenses, dailyBudget, filterOptions } = useExpense();
  
  const groupExpensesByDay = () => {
    const grouped: Record<string, typeof filteredExpenses> = {};
    
    filteredExpenses.forEach(expense => {
      const date = formatDate(expense.date);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(expense);
    });
    
    return grouped;
  };
  
  const groupedExpenses = groupExpensesByDay();
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => {
    const dateA = new Date(a.split('/').reverse().join('-'));
    const dateB = new Date(b.split('/').reverse().join('-'));
    return dateB.getTime() - dateA.getTime();
  });
  
  return (
    <Box>
      <Flex direction="column" width="100%" gap={6}>
        <Flex justify="space-between" align="center" mb={2}>
          <Heading size="lg">Relatórios</Heading>
          <ExportOptions expenses={filteredExpenses} />
        </Flex>
        
        <ExpenseSummary expenses={expenses} dailyBudget={dailyBudget} />
        
        <ExpenseChart expenses={filteredExpenses} />
        
        <Box mt={6}>
          <Heading size="md" mb={4}>Detalhes das Despesas</Heading>
          <FilterBar />
          
          {filteredExpenses.length === 0 ? (
            <Box
              p={8}
              bg="white"
              borderRadius="lg"
              textAlign="center"
              boxShadow="sm"
              mt={4}
            >
              <Text fontSize="lg" color="gray.500">
                Nenhuma despesa encontrada com os filtros atuais
              </Text>
            </Box>
          ) : (
            <Tabs variant="enclosed" mt={4}>
              <TabList>
                <Tab>Lista</Tab>
                <Tab>Por Data</Tab>
              </TabList>
              
              <TabPanels>
                {/* List View */}
                <TabPanel p={0} pt={4}>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {filteredExpenses.map(expense => (
                      <ExpenseCard key={expense.id} expense={expense} />
                    ))}
                  </SimpleGrid>
                </TabPanel>
                
                {/* By Date View */}
                <TabPanel p={0} pt={4}>
                  <VStack spacing={6} align="stretch">
                    {sortedDates.map(date => (
                      <Box key={date}>
                        <Flex 
                          bg="blue.50" 
                          p={2} 
                          px={4} 
                          borderRadius="md" 
                          mb={3} 
                          alignItems="center"
                        >
                          <Text fontWeight="bold" color="blue.700">
                            {date}
                          </Text>
                        </Flex>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                          {groupedExpenses[date].map(expense => (
                            <ExpenseCard key={expense.id} expense={expense} />
                          ))}
                        </SimpleGrid>
                      </Box>
                    ))}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </Box>
      </Flex>
    </Box>
  );
}