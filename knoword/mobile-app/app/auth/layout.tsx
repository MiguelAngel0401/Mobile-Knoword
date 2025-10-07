import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@shared/types/navigation";

const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();