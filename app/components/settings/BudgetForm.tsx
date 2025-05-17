import { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Box,
  Heading,
  Text,
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import { DailyBudget } from '@/lib/types';
import { useExpense } from '@/contexts/ExpenseContext';

export default function BudgetForm() {
  const { dailyBudget, updateDailyBudget } = useExpense();
  const toast = useToast();
  
  const [budget, setBudget] = useState<DailyBudget>({ ...dailyBudget });
  
  const handleChange = (day: keyof DailyBudget, value: string) => {
    const numValue = parseFloat(value);
    
    setBudget(prev => ({
      ...prev,
      [day]: isNaN(numValue) ? 0 : numValue
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDailyBudget(budget);
    
    toast({
      title: 'Orçamento atualizado',
      description: 'Os valores de orçamento diário foram atualizados com sucesso.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const getDayLabel = (day: string): string => {
    const labels: Record<string, string> = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo',
    };
    
    return labels[day] || day;
  };
  
  const weekdays: Array<keyof DailyBudget> = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const weekend: Array<keyof DailyBudget> = ['saturday', 'sunday'];
  
  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={4}>Orçamento Diário</Heading>
          <Text mb={4} color="gray.600">
            Configure o valor máximo que você deseja gastar em cada dia da semana.
          </Text>
        </Box>
        
        <Box>
          <Heading size="sm" mb={3}>Dias Úteis</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {weekdays.map(day => (
              <FormControl key={day}>
                <FormLabel>{getDayLabel(day)}</FormLabel>
                <NumberInput
                  min={0}
                  precision={2}
                  step={10}
                  value={budget[day]}
                  onChange={(value) => handleChange(day, value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            ))}
          </SimpleGrid>
        </Box>
        
        <Box>
          <Heading size="sm" mb={3}>Final de Semana</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {weekend.map(day => (
              <FormControl key={day}>
                <FormLabel>{getDayLabel(day)}</FormLabel>
                <NumberInput
                  min={0}
                  precision={2}
                  step={10}
                  value={budget[day]}
                  onChange={(value) => handleChange(day, value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            ))}
          </SimpleGrid>
        </Box>
        
        <Button type="submit" colorScheme="blue" size="lg" mt={6}>
          Salvar Orçamento
        </Button>
      </VStack>
    </Box>
  );
}