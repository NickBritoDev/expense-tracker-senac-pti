'use client'
import { useState } from 'react';
import { Box, Flex, Button, useDisclosure, Container, HStack, IconButton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();
  const [activeLink, setActiveLink] = useState(router.pathname);

  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  };

  const isActive = (path: string) => activeLink === path;

  const NavLink = ({ path, children }: { path: string; children: React.ReactNode }) => (
    <Link href={path} passHref>
      <Button
        as="a"
        variant="ghost"
        colorScheme={isActive(path) ? 'blue' : 'gray'}
        borderBottom={isActive(path) ? '2px solid' : 'none'}
        borderRadius="0"
        onClick={() => handleLinkClick(path)}
        _hover={{ bg: 'gray.100' }}
        _active={{ bg: 'gray.200' }}
        transition="all 0.2s"
      >
        {children}
      </Button>
    </Link>
  );

  return (
    <Box as="nav" bg="white" boxShadow="sm" position="sticky" top={0} zIndex={10}>
      <Container maxW="container.xl" py={2}>
        <Flex justify="space-between" align="center">
          <Box 
            fontSize="xl" 
            fontWeight="bold" 
            color="blue.500"
            display="flex"
            alignItems="center"
          >
            Expense Tracker
          </Box>

          {/* Desktop Navigation */}
          <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
            <NavLink path="/">Despesas Diárias</NavLink>
            <NavLink path="/reports">Relatórios</NavLink>
            <NavLink path="/settings">Configurações</NavLink>
          </HStack>

          {/* Mobile Menu Button */}
          <IconButton
            aria-label="Open Menu"
            display={{ base: 'flex', md: 'none' }}
            icon={isOpen ? <X size={24} /> : <Menu size={24} />}
            onClick={onToggle}
            variant="ghost"
          />
        </Flex>

        {/* Mobile Navigation */}
        {isOpen && (
          <Box 
            pb={4} 
            display={{ base: 'block', md: 'none' }}
            w="full"
            transition="height 0.2s ease"
          >
            <Flex direction="column" align="start" gap={2}>
              <NavLink path="/">Despesas Diárias</NavLink>
              <NavLink path="/reports">Relatórios</NavLink>
              <NavLink path="/settings">Configurações</NavLink>
            </Flex>
          </Box>
        )}
      </Container>
    </Box>
  );
}