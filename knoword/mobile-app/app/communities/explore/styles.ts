import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  screen: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#fff",
  },
  section: {
    gap: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
    color: "#fff",
  },
  viewAll: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  carousel: {
    flexDirection: "row",
    gap: 16,
  },
  card: {
    width: 256,
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1F2937",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "#111827",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    padding: 16,
  },
  communityName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  emptyGlobal: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
  },
  emptyByTag: {
    color: "#9CA3AF",
    marginLeft: 8,
    marginBottom: 12,
    fontSize: 13,
  },
});