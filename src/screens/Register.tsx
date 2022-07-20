import { VStack } from "native-base";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState("");
  const [description, setDescription] = useState("");

  const navigation = useNavigation();

  function handleNewOrderRegister() {
    if (!patrimony || !description) {
      return Alert.alert("Registrar", "Preencha todos os campos!");
    }
    setIsLoading(true);
    firestore()
      .collection("orders")
      .add({
        patrimony,
        description,
        status: "open",
        created_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação registrada con sucesso.");
        navigation.goBack();
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        return Alert.alert(
          "Solicitação",
          "Não foi possível cadastrar o pedido."
        );
      });
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Nova Solicitação" />

      <Input
        placeholder="Número do património"
        my={4}
        value={patrimony}
        onChangeText={setPatrimony}
      />

      <Input
        placeholder="Descrição do problema"
        my={4}
        flex={1}
        multiline
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />

      <Button
        title="Cadastrar"
        mt={5}
        onPress={handleNewOrderRegister}
        isLoading={isLoading}
      />
    </VStack>
  );
}
