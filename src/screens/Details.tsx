import { useNavigation, useRoute } from "@react-navigation/native";
import { HStack, Text, VStack, useTheme, ScrollView, Box } from "native-base";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import {
  CircleWavyCheck,
  DesktopTower,
  Hourglass,
  Clipboard,
  ClipboardText,
} from "phosphor-react-native";

import firestore from "@react-native-firebase/firestore";

import { OrderProps } from "../components/Order";
import { OrderFirestoreDTO } from "../DTOs/OrderDTO";
import { dateFormat } from "../utils/firestoreDateFormat";
import { Loading } from "../components/Loading";
import { CardDetails } from "../components/CardDetails";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Alert } from "react-native";

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
};

export function Details() {
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  const navigation = useNavigation();

  const { colors } = useTheme();

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert(
        "Solicitação",
        "Informe a solução para encerrar a solicitação."
      );
    }

    firestore()
      .collection("orders")
      .doc(orderId)
      .update({
        status: "closed",
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => navigation.goBack())
      .catch((error) => {
        console.log(error);
        Alert.alert("Solicitação", "Não foi possível encerrar a solicitação");
      });
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          status,
          solution,
          created_at,
          closed_at,
        } = doc.data();

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed,
        });

        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status == "closed" ? (
          <CircleWavyCheck color={colors.green[300]} />
        ) : (
          <Hourglass color={colors.secondary[700]} />
        )}
        <Text
          fontSize="sm"
          color={
            order.status == "closed" ? colors.green[300] : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status == "closed" ? "Finalizado" : "Em andamento"}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="equipamento"
          description={`Património ${order.patrimony}`}
          icon={DesktopTower}
        />

        <CardDetails
          title="descrição do problema"
          description={`${order.description}`}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />

        <CardDetails
          title="solução"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === "open" && (
            <Input
              placeholder="Descrição da solução"
              onChangeText={setSolution}
              value={solution}
              h={24}
              textAlignVertical="top"
              multiline
            />
          )}
        </CardDetails>
      </ScrollView>

      {order.status === "open" && (
        <Button
          title="Encerrar solicitação"
          mt={5}
          onPress={handleOrderClose}
        />
      )}
    </VStack>
  );
}
