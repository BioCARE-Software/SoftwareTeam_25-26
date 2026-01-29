// app/create-gesture.tsx
import { Link } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

//CREATE GESTURE PAGE

//UTILITY Gesture Set Screen
export default function GestureSet() {
  return (
    //add buttons into this container
    <View style={styles.container}>

      <View style={styles.header}>
        //links the back arrow to the previous page CREATE GESTURE
        <Link href=".." asChild>
          <TouchableOpacity>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </Link>
        //GESTURE PAGE title
        <Text style={styles.title}>Gesture Set</Text>
      </View>

      //PRECISION GRIP BUTTON

      //links to the precision grip page
      <Link href="/precision-grip" asChild>
        <TouchableOpacity style={styles.gestureItem}>
          <Text style={styles.gestureLabel}>Precision Grip</Text>
          <Text style={styles.gestureArrow}>›</Text>
        </TouchableOpacity>
      </Link>

      //POWER GRIP BUTTON

      //links to the power grip page
      <Link href="/power-grip" asChild>
        <TouchableOpacity style={styles.gestureItem}>
          <Text style={styles.gestureLabel}>Power Grip</Text>
          <Text style={styles.gestureArrow}>›</Text>
        </TouchableOpacity>
      </Link>

      //POINTER GRIP BUTTON

      //links to the pointer grip page
      <Link href="/pointer-grip" asChild>
        <TouchableOpacity style={styles.gestureItem}>
          <Text style={styles.gestureLabel}>Pointer Grip</Text>
          <Text style={styles.gestureArrow}>›</Text>
        </TouchableOpacity>
      </Link>

      //TEMPORARY BUTTON
      //links to the temporary page
      <Link href="/temporary-gesture-page-1" asChild>
        <TouchableOpacity style={styles.gestureItem}>
          <Text style={styles.gestureLabel}>Temporary Gesture Page 1</Text>
          <Text style={styles.gestureArrow}>›</Text>
        </TouchableOpacity>
      </Link>

       //TEMPORARY BUTTON
      //links to the temporary page
      <Link href="/temporary-gesture-page-2" asChild>
        <TouchableOpacity style={styles.gestureItem}>
          <Text style={styles.gestureLabel}>Temporary Gesture Page 2</Text>
          <Text style={styles.gestureArrow}>›</Text>
        </TouchableOpacity>
      </Link>


      //EDIT SET BUTTON
      <TouchableOpacity style={styles.editSetBtn}>
        <Text style={styles.editSetText}>EDIT SET</Text>
      </TouchableOpacity>
    </View>
  );
}

//PLEASE KEEP THE HEADER AND FOOTER STYLES CONSISTENT ACROSS ALL PAGES

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", paddingHorizontal: 20, paddingTop: 68 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backArrow: { color: "#fff", fontSize: 38, marginRight: 38, fontWeight: "bold" },
  title: { color: "#ffffff", fontSize: 34, fontWeight: "bold" },

  gestureItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 21, borderBottomWidth: 2, borderBottomColor: "#969292" },
  gestureLabel: { color: "#fff", fontSize: 28, fontWeight: "500" },
  gestureArrow: { color: "#fff", fontSize: 36 },
  editSetBtn: { backgroundColor: "#d33c32", borderRadius: 380, padding: 15, alignItems: "center", marginTop: 34 },
  editSetText: { color: "#000000", fontWeight: "bold", fontSize: 33 },
});