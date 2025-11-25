import React, { useState, useCallback, useEffect, useLayoutEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, BackHandler, Modal, Text } from "react-native";
import { Menu, LogOut, X, ArrowLeft } from "lucide-react-native";
import { useFocusEffect, useRouter, useNavigation } from "expo-router";
import { ProfileMenu } from "../../components/ui/navbar/ProfileMenu";
import { Banner } from "../../../mobile-app/src/components/profile/Banner";
import Posts from "../../../mobile-app/src/components/profile/Posts";
import Followers from "../../../mobile-app/src/components/profile/Followers";
import Communities from "../../../mobile-app/src/components/profile/Communities";
import LateralMenu from "../../../mobile-app/components/shared/LateraMenu";
import BottomTabs from "../../../mobile-app/src/components/profile/BottomTabs";
import { logout } from "../../../shared-core/src/services/auth/logout";
import privateApiClient from "../../../shared-core/src/services/client/privateApiClient";

export default function ProfileIndex() {
  const [showMenu, setShowMenu] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Bienvenido a tu perfil',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => setShowLogoutModal(true)}
          style={{ paddingLeft: 16 }}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  useEffect(() => {
    const backAction = () => {
      setShowLogoutModal(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout(privateApiClient);
    router.replace("/auth/login/LoginScreen");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <View style={styles.screen}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setShowMenu(!showMenu)}
            style={styles.menuIcon}
          >
            <Menu size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.profileWrapper}>
            <ProfileMenu />
          </View>
        </View>

        {showMenu && (
          <View style={styles.lateralMenuWrapper}>
            <LateralMenu />
          </View>
        )}

        <View style={styles.card}>
          <Banner key={refreshKey} />
          <Posts />
          <Followers />
          <Communities />
        </View>
      </ScrollView>

      <View style={styles.tabsWrapper}>
        <BottomTabs />
      </View>

      {/* Modal de cerrar sesión */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <View style={styles.iconWrapper}>
                <LogOut size={32} color="#EF4444" />
              </View>
              <TouchableOpacity
                onPress={handleCancelLogout}
                style={styles.closeButton}
              >
                <X size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Contenido */}
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>¿Cerrar sesión?</Text>
              <Text style={styles.modalText}>
                ¿Estás seguro de que quieres cerrar sesión? Tendrás que iniciar sesión nuevamente para acceder a tu cuenta.
              </Text>
            </View>

            {/* Botones */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleCancelLogout}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutButton}
              >
                <Text style={styles.logoutText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  menuIcon: {
    padding: 8,
  },
  profileWrapper: {
    alignItems: "flex-end",
  },
  lateralMenuWrapper: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 0,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tabsWrapper: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: "#1F2937",
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    paddingTop: 24,
    paddingHorizontal: 24,
    alignItems: "center",
    position: "relative",
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#374151",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});