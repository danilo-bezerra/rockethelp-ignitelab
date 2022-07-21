import { Link as NativeBaseLink, ILinkProps } from "native-base";

type Props = ILinkProps & {
  children: string;
};

export function Link({ children, ...rest }: Props) {
  return (
    <NativeBaseLink
      _text={{
        fontSize: "sm",
        _light: {
          color: "gray.100",
        },
        color: "gray.200",
      }}
      isUnderlined
      _hover={{
        _text: {
          _light: {
            color: "gray.200",
          },
          color: "gray.100",
        },
      }}
      {...rest}
    >
      {children}
    </NativeBaseLink>
  );
}
