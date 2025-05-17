import {
  Box,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Card,
  CardBody,
} from '@chakra-ui/react';
import BudgetForm from '@/app/components/settings/BudgetForm';
import DataManager from '@/app/components/settings/DataManager';

export default function SettingsPage() {
  return (
    <Box>
      <Heading size="lg" mb={6}>Configurações</Heading>
      
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Orçamento</Tab>
          <Tab>Dados</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel p={0} pt={6}>
            <Card>
              <CardBody>
                <BudgetForm />
              </CardBody>
            </Card>
          </TabPanel>
          
          <TabPanel p={0} pt={6}>
            <DataManager />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}