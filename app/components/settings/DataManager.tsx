'use client'
import { useRef } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Trash2, DownloadCloud, UploadCloud } from 'lucide-react';
import { useExpense } from '@/contexts/ExpenseContext';
import { DEFAULT_DAILY_BUDGET } from '@/lib/utils';

export default function DataManager() {
  const toast = useToast();
  const { expenses, dailyBudget } = useExpense();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  const exportData = () => {
    try {
      const data = {
        expenses,
        dailyBudget,
        exportDate: new Date().toISOString(),
      };
      
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Dados exportados',
        description: 'Seus dados foram exportados com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast({
        title: 'Erro ao exportar',
        description: 'Não foi possível exportar seus dados.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const data = JSON.parse(result);
        
        if (!data.expenses || !data.dailyBudget) {
          throw new Error('Formato de arquivo inválido.');
        }
        
        
        localStorage.setItem('expenses', JSON.stringify(data.expenses));
        localStorage.setItem('dailyBudget', JSON.stringify(data.dailyBudget));
        
        toast({
          title: 'Dados importados',
          description: 'Seus dados foram importados com sucesso. A página será recarregada.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          onCloseComplete: () => {
           
            window.location.reload();
          }
        });
      } catch (error) {
        console.error('Erro ao importar dados:', error);
        toast({
          title: 'Erro ao importar',
          description: 'O arquivo selecionado não é válido.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    
    reader.readAsText(file);
    
    
    event.target.value = '';
  };
  
  const resetData = () => {
    
    localStorage.removeItem('expenses');
    localStorage.removeItem('dailyBudget');
    
    
    localStorage.setItem('dailyBudget', JSON.stringify(DEFAULT_DAILY_BUDGET));
    localStorage.setItem('expenses', JSON.stringify([]));
    
    onClose();
    
    toast({
      title: 'Dados resetados',
      description: 'Todos os seus dados foram apagados. A página será recarregada.',
      status: 'info',
      duration: 3000,
      isClosable: true,
      onCloseComplete: () => {
       
        window.location.reload();
      }
    });
  };
  
  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={2}>Gerenciamento de Dados</Text>
          <Text color="gray.600" mb={4}>
            Faça backup dos seus dados ou restaure a partir de um arquivo de backup.
          </Text>
        </Box>
        
        <HStack spacing={4}>
          <Button 
            leftIcon={<DownloadCloud size={18} />} 
            colorScheme="blue" 
            onClick={exportData}
            flex="1"
          >
            Exportar Dados
          </Button>
          
          <Box as="label" htmlFor="file-upload" flex="1">
            <Button
              leftIcon={<UploadCloud size={18} />}
              colorScheme="orange"
              width="100%"
              cursor="pointer"
            >
              Importar Dados
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: 'none' }}
            />
          </Box>

        </HStack>
        
        <Box pt={4}>
          <Button 
            leftIcon={<Trash2 size={18} />} 
            colorScheme="red" 
            variant="outline"
            onClick={onOpen}
            width="100%"
          >
            Resetar Todos os Dados
          </Button>
        </Box>
      </VStack>
      
      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Resetar Dados
            </AlertDialogHeader>

            <AlertDialogBody>
              Você tem certeza? Esta ação irá apagar todas as suas despesas e configurações de orçamento. Esta ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={resetData} ml={3}>
                Sim, Resetar Tudo
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}