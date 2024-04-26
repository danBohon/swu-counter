import React, { useEffect } from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import BaseSelector from "./BaseSelector";
import { Base } from "../types/base";
import clsx from "clsx";
import { getBaseColor } from "../utils/getBaseColor";

interface PlayerProps {
  bases: Base[];
  upsideDown?: boolean;
  resetBases: boolean;
  setResetBases: (resetBases: boolean) => void;
}

export default function Player({
  bases,
  upsideDown,
  resetBases,
  setResetBases,
}: PlayerProps) {
  const [selectedBase, setSelectedBase] = React.useState<Base | undefined>(
    undefined,
  );
  const [baseHP, setBaseHP] = React.useState<number | undefined>(undefined);
  const [consecutivePressCount, setConsecutivePressCount] = React.useState(0);
  const [epicActionBase, setEpicActionBase] = React.useState<boolean>(false);
  const [epicActionLeader, setEpicActionLeader] =
    React.useState<boolean>(false);

  useEffect(() => {
    if (selectedBase) {
      setBaseHP(Number(selectedBase.HP));
    }
  }, [selectedBase]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const resetConsecutivePressCount = () => {
      setConsecutivePressCount(0);
    };
    timeoutId = setTimeout(resetConsecutivePressCount, 4000);
    return () => clearTimeout(timeoutId);
  }, [consecutivePressCount]);

  useEffect(() => {
    if (resetBases) {
      setBaseHP(selectedBase ? Number(selectedBase.HP) : undefined);
      setConsecutivePressCount(0);
      setEpicActionBase(false);
      setEpicActionLeader(false);
      setResetBases(false);
    }
  }, [resetBases]);

  const onDamagePress = () => {
    if (baseHP && baseHP > 0) {
      setBaseHP(() => {
        return baseHP - 1;
      });
      setConsecutivePressCount(consecutivePressCount - 1);
    }
  };

  const onHealPress = () => {
    if (typeof baseHP === "number" && baseHP < Number(selectedBase?.HP)) {
      setBaseHP(baseHP + 1);
      setConsecutivePressCount(consecutivePressCount + 1);
    }
  };

  return (
    <View
      className={clsx(
        "w-full flex-1 items-center justify-center rounded-lg bg-black p-2",
        upsideDown && "rotate-180 transform",
      )}
    >
      {selectedBase ? (
        <View className="flex h-full w-full justify-between">
          <View className="flex-1">
            <TouchableOpacity
              onPress={() => {
                setSelectedBase(undefined);
                setEpicActionBase(false);
                setEpicActionLeader(false);
              }}
              className="overflow-hidden rounded-lg border-2 p-2"
              style={{
                borderColor: getBaseColor(selectedBase),
                backgroundColor: getBaseColor(selectedBase) + "30",
              }}
            >
              <Text className="self-center rounded-lg bg-white/50 px-3 py-1 text-center text-2xl font-bold text-black">
                {selectedBase.Name}
              </Text>
            </TouchableOpacity>
            <Text className="py-2 text-center text-white">
              {selectedBase.FrontText}
            </Text>
            <View className="flex-grow items-center justify-center">
              <View className="flex h-24 w-full flex-grow flex-row items-center justify-between self-center rounded-lg">
                <TouchableOpacity
                  onPress={onDamagePress}
                  className="h-full w-[27%] items-center justify-center rounded-l-lg"
                >
                  <Text className="p-4 text-7xl text-white">-</Text>
                </TouchableOpacity>
                <View className="h-full flex-grow justify-center">
                  <View className="h-9 text-center">
                    <Text className="text-center text-3xl text-white">
                      {consecutivePressCount !== 0 &&
                        (consecutivePressCount < 0 ? "" : "+") +
                          consecutivePressCount}
                    </Text>
                  </View>
                  <Text className=" text-center text-8xl text-white">
                    {baseHP}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onHealPress}
                  className="h-full w-[27%] items-center justify-center rounded-r-lg"
                >
                  <Text className="p-4 text-6xl text-white">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="flex flex-row justify-between pt-3">
            {selectedBase.FrontText && (
              <TouchableOpacity
                onPress={() => setEpicActionBase(!epicActionBase)}
              >
                <View
                  className={`rounded-lg border-[1px] border-white p-3 text-center ${epicActionBase ? "bg-red-600" : ""}`}
                >
                  <Text
                    className={`text-center text-xs text-white ${epicActionBase ? "text-slate-800" : ""}`}
                  >
                    Epic Action
                  </Text>
                  <Text
                    className={`text-center text-xl font-bold text-white ${epicActionBase ? "text-slate-800" : ""}`}
                  >
                    Base
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            {/* <TouchableOpacity
              onPress={() => setEpicActionLeader(!epicActionLeader)}
            >
              <View
                className={`rounded-full border-[1px] border-white p-3 text-center ${epicActionLeader ? "bg-red-600" : ""}`}
              >
                <Text
                  className={`text-center text-xl font-bold text-white ${epicActionLeader ? "text-slate-800" : ""}`}
                >
                  SWU
                </Text>
                <Text
                  className={`text-center text-sm text-white ${epicActionLeader ? "text-slate-800" : ""}`}
                >
                  Initiative
                </Text>
              </View>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => setEpicActionLeader(!epicActionLeader)}
            >
              <View
                className={`rounded-lg border-[1px] border-white p-3 text-center ${epicActionLeader ? "bg-red-600" : ""}`}
              >
                <Text
                  className={`text-center text-xs text-white ${epicActionLeader ? "text-slate-800" : ""}`}
                >
                  Epic Action
                </Text>
                <Text
                  className={`text-center text-xl font-bold text-white ${epicActionLeader ? "text-slate-800" : ""}`}
                >
                  Leader
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <BaseSelector bases={bases} onBaseSelect={setSelectedBase} />
      )}
    </View>
  );
}
