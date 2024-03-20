"use client"

import React, { useEffect, useState } from "react"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  useDisclosure,
} from "@nextui-org/react"

import { SelectForm } from "@/app/(routes)/generate/_components/select"
import { trpc } from "@/app/_trpc/client"

export default function VechicleFormModal({
  GenerateId,
  Icon,
}: {
  GenerateId?: string
  Icon: any
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const utils = trpc.useUtils()

  return (
    <div className="-mt-1">
      <Icon
        className="cursor-pointer  rounded-full px-3"
        size={40}
        onClick={() => {
          onOpen()
        }}
      />
      <Modal
        size="3xl"
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="text-center">
                  <div className="text-center">
                    {GenerateId ? "Edit" : "Create"} Details
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <SelectForm onClose={onClose} generateId={GenerateId} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
