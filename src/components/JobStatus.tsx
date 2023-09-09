import React, { useState } from 'react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Spinner,
  Text,
  Center
} from '@chakra-ui/react'

export default function () {
  const [isOpen, setIsOpen] = useState(false)

  const onClose = () => setIsOpen(false)
  const onOpen  = () => setIsOpen(true)

  return (
    <>
      <Button onClick={onOpen}>Check Job Status</Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Job Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center flexDirection="column">
              <Spinner size="xl" thickness="4px" color="blue.500" />
              <Text mt={4}>Processing your job...</Text>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
