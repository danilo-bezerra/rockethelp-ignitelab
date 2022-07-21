import { useNavigation } from "@react-navigation/native";
import {
  Center,
  FlatList,
  Heading,
  HStack,
  IconButton,
  Text,
  useTheme,
  VStack,
} from "native-base";
import { ChatTeardropText, SignOut } from "phosphor-react-native";
import { useContext, useEffect, useState } from "react";
import Logo from "../assets/logo_secondary.svg";
import { Button } from "../components/Button";
import { Filter } from "../components/Filter";
import { Order, OrderProps } from "../components/Order";
import { Alert } from "react-native";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { dateFormat } from "../utils/firestoreDateFormat";
import { Loading } from "../components/Loading";
import { UserContext } from "../contexts/UserContext";

export function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [statusSelected, setStatusSelected] = useState<"open" | "closed">(
    "open"
  );
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const navigation = useNavigation();
  const { colors } = useTheme();
  const { user } = useContext(UserContext);

  function handleNewOrder() {
    navigation.navigate("new");
  }

  function handleOpenDetails(orderId) {
    navigation.navigate("details", { orderId });
  }

  function handleLogout() {
    auth()
      .signOut()
      .catch((error) => {
        console.log(error);
        Alert.alert("Sair", "Erro ao sair.");
      });
  }

  useEffect(() => {
    setIsLoading(true);

    const subscriber = firestore()
      .collection("orders")
      .where("status", "==", statusSelected)
      .where("user_id", "==", user?.uid)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { patrimony, description, status, created_at } = doc.data();

          return {
            id: doc.id,
            user_id: user?.uid,
            patrimony,
            description,
            status,
            created_at,
            when: dateFormat(created_at),
          };
        });

        setOrders(data);
        setIsLoading(false);
      });

    return subscriber;
  }, [statusSelected]);

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />

        <IconButton
          onPress={handleLogout}
          icon={<SignOut size={26} color={colors.gray[300]} />}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading color="gray.100">Meus Chamados</Heading>

          <Text color="gray.200">{orders.length}</Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            title="Em andamento"
            type="open"
            isActive={statusSelected === "open"}
            onPress={() => setStatusSelected("open")}
          />
          <Filter
            title="Finalizados"
            type="closed"
            isActive={statusSelected === "closed"}
            onPress={() => setStatusSelected("closed")}
          />
        </HStack>

        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(order) => order.id}
            renderItem={({ item }) => (
              <Order data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                  Você ainda não possui {"\n"}solicitações{" "}
                  {statusSelected == "open" ? "em andamento" : "finalizadas"}
                </Text>
              </Center>
            )}
          />
        )}
        <Button title="Nova Solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
