import {FirebaseFirestoreTypes} from "@react-native-firebase/firestore";

export type OrderFirestoreDTO = {
    user_id?: string;
    patrimony: string;
    description: string;
    status: 'open' | 'closed';
    solution?: 'string';
    created_at: FirebaseFirestoreTypes.Timestamp;
    closed_at?: FirebaseFirestoreTypes.Timestamp
}