import {
  Avatar,
  Box,
  CloseIcon,
  FormControl,
  Heading,
  HStack,
  IconButton,
  Image,
  KeyboardAvoidingView,
  Text,
  useTheme,
  VStack,
} from "native-base";
import { Check, Pen } from "phosphor-react-native";
import { useContext, useState } from "react";
import { noProfilePicture } from "../assets/base64Images";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";
import { Loading } from "../components/Loading";

export function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  const { colors } = useTheme();

  function handleToggleEditName() {
    setIsEditingName((v) => !v);
  }

  function handleSetNewName() {
    if (!newName) {
      return Alert.alert(
        "Atualização de nome",
        "Informe um nome válido para continuar."
      );
    }

    if (newName == auth().currentUser.displayName) {
      return Alert.alert(
        "Atualização de nome",
        "O nome inserido é igual ao nome atual."
      );
    }

    setIsLoading(true);
    auth()
      .currentUser.updateProfile({
        displayName: newName,
      })
      .then(() => {
        setIsLoading(false);
        // auth().currentUser.reload();
        handleToggleEditName();
        console.log(auth().currentUser);
      })
      .catch(() => {
        setIsLoading(false);
        Alert.alert("Atualização de nome", "Erro ao atualizar nome.");
      });

    setNewName("");
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.500">
      <Box px={6} bg="gray.600">
        <Header title="Perfil" />
      </Box>

      <VStack flex={1} p={6} alignItems="center" pb={60}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          w="full"
          mt={6}
          mb={2}
        >
          {isEditingName ? (
            <Input
              placeholder="Digite seu nome..."
              w="full"
              textAlign="center"
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
          ) : (
            <Heading color="gray.100" textAlign="center" w="full">
              {auth().currentUser.displayName || "Usuário sem nome"}
            </Heading>
          )}
          <HStack position="absolute" right={0} top={0} bottom={0}>
            <IconButton
              icon={
                isEditingName ? <CloseIcon color={colors.red[600]} /> : null
              }
              onPress={handleToggleEditName}
            />
            <IconButton
              icon={
                isEditingName ? (
                  <Check color={colors.darkBlue[600]} size={24} />
                ) : (
                  <Pen color={colors.darkBlue[600]} size={24} />
                )
              }
              onPress={isEditingName ? handleSetNewName : handleToggleEditName}
            />
          </HStack>
        </HStack>

        <Text color="gray.300">{auth().currentUser.email}</Text>
      </VStack>
    </VStack>
  );
}
