import { Input as NativeBaseInput, IInputProps } from "native-base";

export function Input({ ...rest }: IInputProps) {
  return (
    <NativeBaseInput
      bg="gray.700"
      h={14}
      size="md"
      borderWidth={0}
      color="white"
      fontFamily="body"
      fontSize="md"
      _focus={{
        borderWidth: 1,
        borderColor: "darkBlue.600",
        bg: "darkBlue.900",
      }}
      placeholderTextColor="darkBlue.300"
      {...rest}
    />
  );
}
