import {
  Box,
  Grid,
  GridItem,
  Heading,
  VStack,
  Flex,
  Text,
  useDisclosure,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';
import { PlusCircle } from 'lucide-react';
import { useExpense } from '@/contexts/ExpenseContext';
import ExpenseForm from '@/app/components/expenses/ExpenseForm';
import ExpenseCard from '@/app/components/expenses/ExpenseCard';
import DailyProgress from '@/app/components/expenses/DailyProgress';
import FilterBar from '@/app/components/expenses/FilterBar';

export default function HomePage() {
  const { expenses, filteredExpenses } = useExpense();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  
  const groupedExpenses: Record<string, typeof filteredExpenses> = {};
  filteredExpenses.forEach(expense => {
    const date = new Date(expense.date).toLocaleDateString('pt-BR');
    if (!groupedExpenses[date]) {
      groupedExpenses[date] = [];
    }
    groupedExpenses[date].push(expense);
  });

  return (
    <Box px={4}>
      <Flex direction="column" width="100%" gap={6}>
        <DailyProgress />
        
        <Flex justify="space-between" align="center">
          <Heading size="lg" mb={2}>Despesas Diárias</Heading>
          <Button
            leftIcon={<PlusCircle size={20} />}
            colorScheme="blue"
            onClick={onOpen}
          >
            Nova Despesa
          </Button>
        </Flex>
        
        <FilterBar />
        
        {filteredExpenses.length === 0 ? (
          <Box
            p={8}
            bg="white"
            borderRadius="lg"
            textAlign="center"
            boxShadow="sm"
          >
            <Text fontSize="lg" color="gray.500" mb={4}>
              Nenhuma despesa encontrada
            </Text>
            <Button colorScheme="blue" onClick={onOpen} size="md">
              Adicionar Primeira Despesa
            </Button>
          </Box>
        ) : (
          <VStack spacing={6} align="stretch">
            {Object.entries(groupedExpenses)
              .sort((a, b) => {
                
                const dateA = new Date(a[0].split('/').reverse().join('-'));
                const dateB = new Date(b[0].split('/').reverse().join('-'));
                return dateB.getTime() - dateA.getTime();
              })
              .map(([date, dateExpenses]) => (
                <Box key={date}>
                  <Flex mb={3} align="center">
                    <Text fontWeight="bold" color="gray.700">
                      {date}
                    </Text>
                    <Divider ml={3} />
                  </Flex>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {dateExpenses.map(expense => (
                      <ExpenseCard key={expense.id} expense={expense} />
                    ))}
                  </SimpleGrid>
                </Box>
              ))}
          </VStack>
        )}
      </Flex>
      
      {/* New Expense Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Adicionar Nova Despesa</DrawerHeader>
          
          <DrawerBody>
            <Box mt={4}>
              <ExpenseForm onSuccess={onClose} />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}