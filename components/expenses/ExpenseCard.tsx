import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import { Pencil, Trash2 } from 'lucide-react';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import ExpenseForm from './ExpenseForm';
import { useExpense } from '@/contexts/ExpenseContext';

interface ExpenseCardProps {
  expense: Expense;
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const { deleteExpense } = useExpense();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'Cash': return 'green';
      case 'Credit Card': return 'red';
      case 'Debit Card': return 'blue';
      case 'Pix': return 'purple';
      default: return 'gray';
    }
  };
  
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'Cash': return 'Dinheiro';
      case 'Credit Card': return 'Cartão de Crédito';
      case 'Debit Card': return 'Cartão de Débito';
      case 'Pix': return 'Pix';
      default: return method;
    }
  };

  const handleDelete = () => {
    deleteExpense(expense.id);
    onDeleteClose();
  };

  return (
    <>
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="sm"
        bg="white"
        transition="all 0.2s"
        _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
      >
        <Flex justify="space-between" align="center" mb={2}>
          <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
            {expense.item}
          </Text>
          <Flex>
            <Badge colorScheme={getPaymentMethodColor(expense.paymentMethod)} mr={2}>
              {getPaymentMethodLabel(expense.paymentMethod)}
            </Badge>
            <Text fontSize="sm" color="gray.500">
              {formatDate(expense.date)}
            </Text>
          </Flex>
        </Flex>
        
        <Flex justify="space-between" align="center" mt={3}>
          <Text color="gray.600">
            {formatCurrency(expense.value)} x {expense.quantity}
          </Text>
          <Text fontWeight="semibold" fontSize="lg" color="blue.600">
            {formatCurrency(expense.total)}
          </Text>
        </Flex>
        
        <Flex justify="flex-end" mt={3}>
          <IconButton
            icon={<Pencil size={16} />}
            aria-label="Edit expense"
            size="sm"
            colorScheme="blue"
            variant="ghost"
            mr={2}
            onClick={onEditOpen}
          />
          <IconButton
            icon={<Trash2 size={16} />}
            aria-label="Delete expense"
            size="sm"
            colorScheme="red"
            variant="ghost"
            onClick={onDeleteOpen}
          />
        </Flex>
      </Box>
      
      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Despesa</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ExpenseForm 
              initialData={{
                date: expense.date,
                item: expense.item,
                value: expense.value,
                quantity: expense.quantity,
                paymentMethod: expense.paymentMethod,
                total: expense.total
              }}
              isEditing={true}
              expenseId={expense.id}
              onSuccess={onEditClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Exclusão</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>Tem certeza que deseja excluir esta despesa?</Text>
            <Text fontWeight="bold" mt={2}>{expense.item} - {formatCurrency(expense.total)}</Text>
            
            <ButtonGroup spacing={4} mt={6} w="100%">
              <Button onClick={onDeleteClose} flex={1}>Cancelar</Button>
              <Button colorScheme="red" onClick={handleDelete} flex={1}>Excluir</Button>
            </ButtonGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}