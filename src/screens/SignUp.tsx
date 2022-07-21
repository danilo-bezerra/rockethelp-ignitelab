import {
  VStack,
  Heading,
  Icon,
  useTheme,
  KeyboardAvoidingView,
  IconButton,
} from "native-base";
import { Envelope, Eye, EyeClosed, Key } from "phosphor-react-native";
import { useState } from "react";

import auth from "@react-native-firebase/auth";

import { Button } from "../components/Button";
import { Input } from "../components/Input";

import Logo from "../assets/logo_primary.svg";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Link } from "../components/Link";

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const { colors } = useTheme();

  const navigation = useNavigation();

  function handleSignUp() {
    if (!email || !password) {
      return Alert.alert("Cadastro", "E-mail e senha devem ser informados");
    } else if (password != passwordConfirmation) {
      return Alert.alert("Cadastro", "As senhas informadas sãp diferentes");
    }
    setIsLoading(true);

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.code);
        setIsLoading(false);

        if (error.code == "auth/invalid-email") {
          return Alert.alert("Cadastro", "E-mail inválido.");
        }

        //auth/email-already-in-use

        if (error.code == "auth/email-already-in-use") {
          return Alert.alert("Cadastro", "E-mail já cadastrado.");
        }

        return Alert.alert("Cadastro", "Não foi possível registrar.");
      });
  }

  return (
    <VStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      bg="gray.600"
      px={8}
    >
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Cadastre sua conta
      </Heading>

      <Input
        placeholder="E-mail"
        mb={4}
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Input
        placeholder="Senha"
        mb={4}
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        value={password}
        onChangeText={setPassword}
        InputRightElement={
          <IconButton
            size={26}
            icon={
              showPassword ? (
                <EyeClosed color={colors.gray[300]} />
              ) : (
                <Eye color={colors.gray[300]} />
              )
            }
            mr={4}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        secureTextEntry={!showPassword}
      />

      <Input
        placeholder="Confirme a senha"
        mb={8}
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        InputRightElement={
          <IconButton
            size={26}
            icon={
              showPasswordConfirmation ? (
                <EyeClosed color={colors.gray[300]} />
              ) : (
                <Eye color={colors.gray[300]} />
              )
            }
            mr={4}
            onPress={() =>
              setShowPasswordConfirmation(!showPasswordConfirmation)
            }
          />
        }
        secureTextEntry={!showPasswordConfirmation}
      />

      <Button
        title="Cadastrar"
        w="full"
        onPress={handleSignUp}
        isLoading={isLoading}
      />

      <Link onPress={() => navigation.navigate("signin")} mt={4}>
        Já tem uma conta? Entre
      </Link>
    </VStack>
  );
}
