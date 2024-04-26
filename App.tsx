import { StatusBar } from "expo-status-bar";
import { View, SafeAreaView, TouchableOpacity } from "react-native";
import Player from "./components/Player";
import { useEffect, useState } from "react";
import { fetchBases } from "./services/api";
import { deactivateKeepAwake, activateKeepAwakeAsync } from "expo-keep-awake";
import { Ionicons } from "@expo/vector-icons";
import Settings from "./components/Settings";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [bases, setBases] = useState([]);
  const [resetBases, setResetBases] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onOpenSettings = () => {
    setIsModalVisible(true);
  };

  const onCloseSettings = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    async function checkAndSetDefaultSetting() {
      try {
        // Check if the setting exists in AsyncStorage
        const preventSleepSetting = await AsyncStorage.getItem("preventSleep");
        // If the setting doesn't exist, set it to true
        if (preventSleepSetting === null) {
          await AsyncStorage.setItem("preventSleep", "true");
        }
        // Use the value stored in AsyncStorage to set the initial screen lock option
        const isEnabled = preventSleepSetting === "true";
        if (isEnabled) {
          activateKeepAwakeAsync();
        } else {
          deactivateKeepAwake();
        }
      } catch (error) {
        console.error("Error checking and setting default setting:", error);
      }
    }
    checkAndSetDefaultSetting();
  }, []);

  useEffect(() => {
    async function fetchAndSetBases() {
      try {
        const basesData = await fetchBases();
        setBases(basesData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAndSetBases();
  }, []);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-slate-400 px-2 pb-2 pt-14">
      <Settings isVisible={isModalVisible} onClose={onCloseSettings} />
      <StatusBar style="auto" />
      <View className="h-full w-full">
        <Player
          bases={bases}
          upsideDown={true}
          resetBases={resetBases}
          setResetBases={setResetBases}
        />
        <View className="flex flex-row justify-between p-1">
          <TouchableOpacity onPress={() => setResetBases(true)}>
            <Ionicons className="" name="reload" size={32} color="white" />
          </TouchableOpacity>
          <View className="m-3 flex-1 rounded-lg bg-black"></View>
          <TouchableOpacity onPress={onOpenSettings}>
            <Ionicons name="settings-outline" size={32} color="white" />
          </TouchableOpacity>
        </View>
        <Player
          bases={bases}
          resetBases={resetBases}
          setResetBases={setResetBases}
        />
      </View>
    </SafeAreaView>
  );
}
