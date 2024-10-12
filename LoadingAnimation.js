import React from "react";
import { Text, View, StatusBar } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { MotiView } from "moti";

function CustomCircle({
  radius = 40,
  strokeWidth = 4,
  color = "#000",
  delay = 0
}) {
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  const wantedAngle = 60;
  const angleInRadians = (wantedAngle * Math.PI) / 180;
  const arcLength = radius * angleInRadians;
  const strokeDashoffset = circumference - arcLength;
  const initialAngle = (180 - wantedAngle) / 2 + wantedAngle;

  return (
    <MotiView
      style={{ width: radius * 2, height: radius * 2, position: "absolute" }}
      from={{ rotate: `-${initialAngle}deg` }}
      animate={{ rotate: `-${360 + initialAngle}deg` }}
      key={Math.random()}
      transition={{
        repeatReverse: false,
        damping: 120,
        mass: 2,
        loop: true,
        duration: 2000,
        delay
      }}
    >
      <Svg
        width={halfCircle * 2}
        height={halfCircle * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <Circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDashoffset={strokeDashoffset}
          strokeDasharray={circumference}
        ></Circle>
      </Svg>
    </MotiView>
  );
}

function LoadingCircles({
  size = 30,
  count = 3,
  frontColor = "#504774",
  backColor = "#EF7519",
  stagger = 100
}) {
  return (
    <View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {[...Array(count).keys()].map((i) => {
          const strokeWidth = Math.floor(size / 3);
          const radius = i * strokeWidth * 2 + size;
          return (
            <CustomCircle
              key={`back-${i}`}
              radius={radius}
              delay={stagger + i * stagger}
              color={backColor}
              strokeWidth={strokeWidth}
            />
          );
        })}
      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {[...Array(count).keys()].map((i) => {
          const strokeWidth = Math.floor(size / 3);
          const radius = i * strokeWidth * 2 + size;
          return (
            <CustomCircle
              key={`front-${i}`}
              radius={radius}
              delay={i * stagger}
              color={frontColor}
              strokeWidth={strokeWidth}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FAEED6"
      }}
    >
      <StatusBar hidden />
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <LoadingCircles size={30} count={3} stagger={100} />
      </View>
  
      <Text
        style={{
          position: "absolute",
          bottom: 100,
          fontFamily: "Menlo",
          opacity: 0.6,
          color: "#333"
        }}
      >
      
        <Text style={{ fontWeight: "900" }}>FatihArslan</Text>
      </Text>
    </View>
  );
}
