import {
  Modal,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deactivateKeepAwake, activateKeepAwakeAsync } from "expo-keep-awake";

interface SettingsProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function Settings({ isVisible, onClose }: SettingsProps) {
  const [isPreventScreenLockEnabled, setIsPreventScreenLockEnabled] =
    useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const setting = await AsyncStorage.getItem("preventSleep");
      setIsPreventScreenLockEnabled(setting !== "false");
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem(
        "preventSleep",
        isPreventScreenLockEnabled.toString(),
      );
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const toggleSwitch = () => {
    setIsPreventScreenLockEnabled((previousState) => !previousState);
    if (isPreventScreenLockEnabled) {
      deactivateKeepAwake();
    } else {
      activateKeepAwakeAsync();
    }
  };

  useEffect(() => {
    saveSettings();
  }, [isPreventScreenLockEnabled]);

  const handleLinkPress = async (url: string) => {
    // Check if the URL is valid
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Open the URL in the device's default browser
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open URL: ", url);
    }
  };

  const divider = <View className="border-t-[1px] border-neutral-600" />;

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <SafeAreaView className="flex-1 justify-between bg-black/90 p-5">
        <View>
          <TouchableOpacity className="w-full items-end" onPress={onClose}>
            <Ionicons name="close" color="white" size={32} />
          </TouchableOpacity>
          <Text className="p-6 text-center text-3xl text-white">Settings</Text>
          <View className="gap-2">
            {divider}
            <View className="flex flex-row justify-between px-2">
              <Text className="pt-2 text-center text-lg text-white">
                Prevent Display Sleep
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#0d9488" }}
                thumbColor={isPreventScreenLockEnabled ? "#5eead4" : "#f4f3f4"}
                //   ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isPreventScreenLockEnabled}
              />
            </View>
            {divider}
          </View>
        </View>
        <Text className="text-center text-white">
          More features coming soon!
        </Text>
        <View className="gap-5 text-center">
          <View className="h-14 flex-row justify-between rounded-md border-[1px] border-neutral-500 p-2">
            <View className="flex-row gap-1 pr-1">
              <Ionicons name="star-outline" size={36} color="white" />
              <Ionicons name="star-outline" size={36} color="white" />
              <Ionicons name="star-outline" size={36} color="white" />
              <Ionicons name="star-outline" size={36} color="white" />
              <Ionicons name="star-outline" size={36} color="white" />
            </View>
            <Text className="flex-1 text-center font-bold text-white">
              Please leave a review {"\n"} for SWU Counter!
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              handleLinkPress(
                "https://paypal.me/danielbohon?country.x=US&locale.x=en_US",
              )
            }
            className="h-15 flex-row justify-between rounded-md border-[1px] border-neutral-500 p-2"
          >
            <View className="flex-row gap-1 pr-2">
              <Ionicons name="logo-paypal" size={47} color="white" />
            </View>
            <Text className="flex-1 pr-2 text-center text-xs font-bold text-white">
              SWU Counter is a free app developed in my spare time. If you would
              like to support the development of this app, please consider
              donating.
            </Text>
          </TouchableOpacity>
          <View className="mb-4 gap-4">
            <Text className="text-center text-neutral-500">
              SWU Counter v.1.0 by Dan Bohon
            </Text>
            <Text className="text-center text-neutral-500">
              Unofficial HP counter for Star Wars Unlimited.
            </Text>
            <Text className="text-center leading-5 text-neutral-500">
              SWU Counter is not affiliated with or endorsed by Lucasfilm Ltd or
              Fantasy Flight Games.
            </Text>
            <Text className="text-center text-neutral-500">
              Card info powered by SWUDB
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="h-14 rounded-md border-[1px] border-neutral-500 p-2"
          >
            <Text className="self-center pt-1 text-xl text-white">Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
