"use client"

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react"
import { ArrowLeft } from "lucide-react"

import { usegenerateForm } from "@/hooks/use-generate-form"
import { SelectForm } from "@/app/(routes)/generate/_components/select"
import { trpc } from "@/app/_trpc/client"

export default function GenerateDialogModal({
  GenerateId,
  Icon,
}: {
  GenerateId?: string
  Icon: any
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const utils = trpc.useUtils()
  const setStep = usegenerateForm((s) => s.setStep)
  const step = usegenerateForm((s) => s.step)

  function handleOnclick() {
    setStep(step - 1)
  }

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
                {step !== 1 && (
                  <ArrowLeft
                    className="cursor-pointer"
                    onClick={handleOnclick}
                  />
                )}
                <div className="text-center">
                  <div className="text-center">
                    {GenerateId ? "Edit" : "Create"} Hall
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
