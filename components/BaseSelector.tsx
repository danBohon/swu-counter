import React from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Base } from "../types/base";
import { getBaseColor } from "../utils/getBaseColor";

interface BaseSelectorProps {
  bases: Base[];
  onBaseSelect: (base: Base) => void;
}

export default function BaseSelector({
  bases,
  onBaseSelect,
}: BaseSelectorProps) {
  return (
    <View className="h-full w-full">
      <Text className="flex p-2 pb-5 text-center text-xl font-bold text-white">
        Select Base:
      </Text>
      <ScrollView className="flex gap-[6px]">
        {bases
          .sort((a: Base, b: Base) => Number(a.Number) - Number(b.Number))
          .map((base: Base, index: number) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  onBaseSelect(base);
                }}
              >
                <View
                  // source={{ uri: base.FrontArt }}
                  className={`overflow-hidden rounded-lg border-2 p-2`}
                  style={{
                    borderColor: getBaseColor(base),
                    backgroundColor: getBaseColor(base) + "30",
                  }}
                >
                  <Text
                    className={`self-center rounded-lg bg-white/60 px-3 py-1 text-center text-2xl font-bold text-black`}
                  >
                    {base.Name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}
