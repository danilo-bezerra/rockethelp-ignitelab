import {
  VStack,
  Heading,
  Icon,
  useTheme,
  KeyboardAvoidingView,
} from "native-base";
import { Envelope, Key } from "phosphor-react-native";
import { useState } from "react";

import auth from "@react-native-firebase/auth";

import { Button } from "../components/Button";
import { Input } from "../components/Input";

import Logo from "../assets/logo_primary.svg";
import { Alert } from "react-native";

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { colors } = useTheme();

  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert("Entrar", "E-mail e senha devem ser informados");
    }
    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.code);
        setIsLoading(false);

        if (error.code == "auth/invalid-email") {
          return Alert.alert("Entrar", "E-mail inválido.");
        }

        if (error.code == "auth/user-not-found") {
          return Alert.alert("Entrar", "E-mail e/ou senha inválidos.");
        }

        if (error.code == "auth/wrong-password") {
          return Alert.alert("Entrar", "E-mail e/ou senha inválidos.");
        }

        return Alert.alert("Entrar", "Não foi possível acessar.");
      });
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
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
        mb={8}
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title="Entrar"
        w="full"
        onPress={handleSignIn}
        isLoading={isLoading}
      />
    </VStack>
  );
}
