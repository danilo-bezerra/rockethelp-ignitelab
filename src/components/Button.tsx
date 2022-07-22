import { Button as NativeBaseButton, IButtonProps, Heading } from "native-base";

type Props = IButtonProps & {
  title: string;
};

export function Button({ title, ...rest }: Props) {
  return (
    <NativeBaseButton
      bg="darkBlue.600"
      h={14}
      fontSize="sm"
      rounded="sm"
      w="full"
      _pressed={{
        bg: "darkBlue.500",
      }}
      {...rest}
    >
      <Heading color="white" fontSize="sm">
        {title}
      </Heading>
    </NativeBaseButton>
  );
}
