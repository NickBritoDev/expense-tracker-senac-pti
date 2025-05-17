import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  Text,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useExpense } from '@/contexts/ExpenseContext';
import { Expense, PaymentMethod } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface ExpenseFormProps {
  onSuccess?: () => void;
  initialData?: Omit<Expense, 'id'>;
  isEditing?: boolean;
  expenseId?: string;
}

export default function ExpenseForm({ 
  onSuccess, 
  initialData, 
  isEditing = false,
  expenseId 
}: ExpenseFormProps) {
  const { addExpense, editExpense } = useExpense();
  const toast = useToast();
  
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    item: initialData?.item || '',
    value: initialData?.value || 0,
    quantity: initialData?.quantity || 1,
    paymentMethod: initialData?.paymentMethod || 'Cash',
    total: initialData?.total || 0,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.item.trim()) {
      newErrors.item = 'O nome do item é obrigatório';
    }
    
    if (formData.value <= 0) {
      newErrors.value = 'O valor deve ser maior que zero';
    }
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'A quantidade deve ser maior que zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const expenseData = {
      ...formData,
      total: formData.value * formData.quantity,
    };
    
    if (isEditing && expenseId) {
      editExpense(expenseId, expenseData);
      toast({
        title: 'Despesa atualizada',
        description: `${formData.item} foi atualizado com sucesso.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      addExpense(expenseData);
      toast({
        title: 'Despesa adicionada',
        description: `${formData.item} foi adicionado com sucesso.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    
    if (!isEditing) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        item: '',
        value: 0,
        quantity: 1,
        paymentMethod: 'Cash',
        total: 0,
      });
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
      
      if (name === 'value' || name === 'quantity') {
        const numValue = name === 'value' ? parseFloat(value) : prev.value;
        const numQuantity = name === 'quantity' ? parseInt(value, 10) : prev.quantity;
        updatedData.total = numValue * numQuantity;
      }
      
      return updatedData;
    });
  };
  
  const handleNumberInputChange = (name: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    setFormData(prev => {
      const updatedData = { ...prev, [name]: numValue };
      
      if (name === 'value' || name === 'quantity') {
        const calcValue = name === 'value' ? numValue : prev.value;
        const calcQuantity = name === 'quantity' ? numValue : prev.quantity;
        updatedData.total = calcValue * calcQuantity;
      }
      
      return updatedData;
    });
  };
  
  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!errors.date}>
          <FormLabel>Data</FormLabel>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </FormControl>
        
        <FormControl isInvalid={!!errors.item}>
          <FormLabel>Item</FormLabel>
          <Input
            name="item"
            value={formData.item}
            onChange={handleChange}
            placeholder="Nome do item"
          />
          {errors.item && (
            <FormErrorMessage>{errors.item}</FormErrorMessage>
          )}
        </FormControl>
        
        <HStack spacing={4}>
          <FormControl isInvalid={!!errors.value}>
            <FormLabel>Valor</FormLabel>
            <NumberInput
              min={0}
              precision={2}
              step={0.5}
              value={formData.value}
              onChange={(value) => handleNumberInputChange('value', value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {errors.value && (
              <FormErrorMessage>{errors.value}</FormErrorMessage>
            )}
          </FormControl>
          
          <FormControl isInvalid={!!errors.quantity}>
            <FormLabel>Quantidade</FormLabel>
            <NumberInput
              min={1}
              step={1}
              value={formData.quantity}
              onChange={(value) => handleNumberInputChange('quantity', value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {errors.quantity && (
              <FormErrorMessage>{errors.quantity}</FormErrorMessage>
            )}
          </FormControl>
        </HStack>
        
        <FormControl>
          <FormLabel>Forma de Pagamento</FormLabel>
          <Select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="Cash">Dinheiro</option>
            <option value="Credit Card">Cartão de Crédito</option>
            <option value="Debit Card">Cartão de Débito</option>
            <option value="Pix">Pix</option>
            <option value="Other">Outro</option>
          </Select>
        </FormControl>
        
        <Box p={4} bg="gray.50" borderRadius="md">
          <Text fontWeight="bold">Total: {formatCurrency(formData.total)}</Text>
        </Box>
        
        <Button
          type="submit"
          colorScheme="blue"
          isDisabled={!formData.item || formData.value <= 0 || formData.quantity <= 0}
        >
          {isEditing ? 'Atualizar Despesa' : 'Adicionar Despesa'}
        </Button>
      </VStack>
    </Box>
  );
}