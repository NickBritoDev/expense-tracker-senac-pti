import { ReactNode } from 'react';
import { Box, Flex, Container } from '@chakra-ui/react';
import Navigation from './Navigation';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Flex direction="column" minH="100vh" px={20}>
      <Navigation />
      <Container maxW="container.xl" py={4} px={4} flex="1">
        <Box w="full">{children}</Box>
      </Container>
      <Box as="footer" py={4} textAlign="center" bg="gray.100">
        <Container maxW="container.xl">
          <Box fontSize="sm" color="gray.600">
            © {new Date().getFullYear()} Expense Tracker - Armazenamento Local
          </Box>
        </Container>
      </Box>
    </Flex>
  );
}