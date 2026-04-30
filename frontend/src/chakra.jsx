/* eslint-disable react-refresh/only-export-components */
import * as Chakra from "@chakra-ui/react";

export * from "@chakra-ui/react";

export const toaster = Chakra.createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
});

export const Toaster = () => <Chakra.Toaster toaster={toaster} />;

export const useToast = () => (options) => {
  toaster.create({
    title: options.title,
    description: options.description,
    type: options.status || "info",
    duration: options.duration,
    closable: options.isClosable,
  });
};

export const useDisclosure = (options) => {
  const disclosure = Chakra.useDisclosure(options);

  return {
    ...disclosure,
    isOpen: disclosure.open,
  };
};

export const Button = ({ isLoading, isDisabled, children, ...props }) => (
  <Chakra.Button loading={isLoading} disabled={isDisabled} {...props}>
    {children}
  </Chakra.Button>
);

export const FormControl = ({ isInvalid, children, ...props }) => (
  <Chakra.Field.Root invalid={isInvalid} {...props}>
    {children}
  </Chakra.Field.Root>
);

export const FormLabel = (props) => <Chakra.Field.Label {...props} />;
export const FormErrorMessage = (props) => (
  <Chakra.Field.ErrorText {...props} />
);

export const Alert = ({ status = "info", children, ...props }) => (
  <Chakra.Alert.Root status={status} {...props}>
    {children}
  </Chakra.Alert.Root>
);

export const AlertIcon = () => <Chakra.Alert.Indicator />;

export const Select = ({ children, isDisabled, ...props }) => (
  <Chakra.NativeSelect.Root maxW={props.maxW}>
    <Chakra.NativeSelect.Field disabled={isDisabled} {...props}>
      {children}
    </Chakra.NativeSelect.Field>
    <Chakra.NativeSelect.Indicator />
  </Chakra.NativeSelect.Root>
);

export const Modal = ({ isOpen, onClose, children, ...props }) => (
  <Chakra.Dialog.Root
    open={isOpen}
    onOpenChange={(event) => {
      if (!event.open) {
        onClose?.();
      }
    }}
    {...props}
  >
    {children}
  </Chakra.Dialog.Root>
);

export const ModalOverlay = (props) => <Chakra.Dialog.Backdrop {...props} />;

export const ModalContent = ({ children, ...props }) => (
  <Chakra.Dialog.Positioner>
    <Chakra.Dialog.Content {...props}>{children}</Chakra.Dialog.Content>
  </Chakra.Dialog.Positioner>
);

export const ModalHeader = (props) => <Chakra.Dialog.Header {...props} />;
export const ModalBody = (props) => <Chakra.Dialog.Body {...props} />;
export const ModalFooter = (props) => <Chakra.Dialog.Footer {...props} />;
export const ModalCloseButton = (props) => (
  <Chakra.Dialog.CloseTrigger asChild>
    <Chakra.CloseButton {...props} />
  </Chakra.Dialog.CloseTrigger>
);

export const AlertDialog = Modal;
export const AlertDialogOverlay = ModalOverlay;
export const AlertDialogContent = ModalContent;
export const AlertDialogHeader = ModalHeader;
export const AlertDialogBody = ModalBody;
export const AlertDialogFooter = ModalFooter;
