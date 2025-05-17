import { useState } from 'react';
import {
  Box,
  Flex,
  Input,
  Select,
  Button,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  IconButton,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useExpense } from '@/contexts/ExpenseContext';
import { FilterOptions, PaymentMethod } from '@/lib/types';

export default function FilterBar() {
  const { filterOptions, setFilterOptions, clearFilters } = useExpense();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [localFilters, setLocalFilters] = useState<FilterOptions>({
    ...filterOptions
  });
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'startDate') {
      setLocalFilters(prev => ({
        ...prev,
        startDate: value ? new Date(value) : undefined
      }));
    } else if (name === 'endDate') {
      setLocalFilters(prev => ({
        ...prev,
        endDate: value ? new Date(value) : undefined
      }));
    }
  };
  
  const handleAmountChange = (name: string, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    
    setLocalFilters(prev => ({
      ...prev,
      [name]: numValue
    }));
  };
  
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      paymentMethod: value === 'All' ? 'All' : value as PaymentMethod
    }));
  };
  
  const handleApplyFilters = () => {
    setFilterOptions(localFilters);
    onClose();
  };
  
  const handleClearFilters = () => {
    clearFilters();
    setLocalFilters({
      paymentMethod: 'All',
    });
  };
  
  return (
    <>
      <Box mb={4}>
        <Flex 
          justify="space-between" 
          align="center" 
          bg="white" 
          p={3} 
          borderRadius="md" 
          boxShadow="sm"
        >
          <HStack spacing={4}>
            <Select
              placeholder="Forma de Pagamento"
              value={filterOptions.paymentMethod || 'All'}
              onChange={(e) => {
                const value = e.target.value;
                setFilterOptions({
                  ...filterOptions,
                  paymentMethod: value === 'All' ? 'All' : value as PaymentMethod
                });
              }}
              width={{ base: '100%', md: '200px' }}
            >
              <option value="All">Todas</option>
              <option value="Cash">Dinheiro</option>
              <option value="Credit Card">Cartão de Crédito</option>
              <option value="Debit Card">Cartão de Débito</option>
              <option value="Pix">Pix</option>
              <option value="Other">Outro</option>
            </Select>
            
            <Input
              placeholder="Data Inicial"
              type="date"
              value={filterOptions.startDate?.toISOString().split('T')[0] || ''}
              onChange={(e) => {
                setFilterOptions({
                  ...filterOptions,
                  startDate: e.target.value ? new Date(e.target.value) : undefined
                });
              }}
              display={{ base: 'none', md: 'inline-flex' }}
              maxWidth="200px"
            />
            <Input
              placeholder="Data Final"
              type="date"
              value={filterOptions.endDate?.toISOString().split('T')[0] || ''}
              onChange={(e) => {
                setFilterOptions({
                  ...filterOptions,
                  endDate: e.target.value ? new Date(e.target.value) : undefined
                });
              }}
              display={{ base: 'none', md: 'inline-flex' }}
              maxWidth="200px"
            />
          </HStack>
          
          <HStack>
            <Button
              leftIcon={<X size={16} />}
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              colorScheme="gray"
            >
              Limpar
            </Button>
            <IconButton
              icon={<SlidersHorizontal size={18} />}
              aria-label="Mais filtros"
              variant="outline"
              size="sm"
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
            />
          </HStack>
        </Flex>
      </Box>
      
      {/* Mobile Filter Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Filtros</DrawerHeader>
          
          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              <FormControl>
                <FormLabel>Forma de Pagamento</FormLabel>
                <Select
                  value={localFilters.paymentMethod || 'All'}
                  onChange={handlePaymentMethodChange}
                >
                  <option value="All">Todas</option>
                  <option value="Cash">Dinheiro</option>
                  <option value="Credit Card">Cartão de Crédito</option>
                  <option value="Debit Card">Cartão de Débito</option>
                  <option value="Pix">Pix</option>
                  <option value="Other">Outro</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Data Inicial</FormLabel>
                <Input
                  type="date"
                  name="startDate"
                  value={localFilters.startDate?.toISOString().split('T')[0] || ''}
                  onChange={handleDateChange}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Data Final</FormLabel>
                <Input
                  type="date"
                  name="endDate"
                  value={localFilters.endDate?.toISOString().split('T')[0] || ''}
                  onChange={handleDateChange}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Valor Mínimo</FormLabel>
                <NumberInput
                  min={0}
                  precision={2}
                  value={localFilters.minAmount?.toString() || ''}
                  onChange={(value) => handleAmountChange('minAmount', value)}
                >
                  <NumberInputField placeholder="Valor mínimo" />
                </NumberInput>
              </FormControl>
              
              <FormControl>
                <FormLabel>Valor Máximo</FormLabel>
                <NumberInput
                  min={0}
                  precision={2}
                  value={localFilters.maxAmount?.toString() || ''}
                  onChange={(value) => handleAmountChange('maxAmount', value)}
                >
                  <NumberInputField placeholder="Valor máximo" />
                </NumberInput>
              </FormControl>
              
              <Box mt={4}>
                <Button
                  colorScheme="blue"
                  onClick={handleApplyFilters}
                  width="full"
                  mb={2}
                >
                  Aplicar Filtros
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  width="full"
                >
                  Limpar Filtros
                </Button>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}