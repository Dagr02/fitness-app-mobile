import { useCallback, useState, useMemo } from "react";
import { View, StyleSheet, ScrollView, Dimensions, FlatList } from "react-native";
import { Text, Button, ActivityIndicator, Menu } from "react-native-paper";
import { LineChart, BarChart } from "react-native-chart-kit";



import { useFocusEffect } from "expo-router";

// ...same as above
import api from "@/config/api";
import { useAuthSession } from "@/components/providers/AuthProvider";

type UserExerciseLog = {
  programExerciseId: number;
  exerciseName: string;
  setNumber: number;
  completedReps: number;
  weightUsed: number;
  workoutDate: string;
};

const screenWidth = Dimensions.get("window").width - 32;
const CHART_LIMIT = 10;

function skipLabels(labels: string[], step: number) {
  return labels.map((label, idx) => (idx % step === 0 ? label : ""));
}
export default function Index() {
  const { signOut } = useAuthSession();
  const [logs, setLogs] = useState<UserExerciseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const onSelectExercise = useCallback((name: string) => {
    setSelectedExercise(name);
    setMenuVisible(false);
  }, []);


  useFocusEffect(
    useCallback(() => {
      const fetchLogs = async () => {
        setLoading(true);
        try {
          const data = await api.fetchData("/api/exercise-logs/user");
          setLogs(data);
          if (data.length > 0) {
            setSelectedExercise(data[0].exerciseName);
          } else {
            setSelectedExercise(null);
          }
        } catch (err) {
          setLogs([]);
          setSelectedExercise(null);
        }
        setLoading(false);
      };
      fetchLogs();
    }, [])
  );

  const exerciseLogs = useMemo(() =>
    logs.filter(log => log.exerciseName === selectedExercise),
    [logs, selectedExercise]
  );

  // --- Chart Data Preparation ---

  // 1. Progress Over Time (weight used)
  const progressByDate = useMemo(() => {
    // Map: date -> max weight for that date
    const map: { [date: string]: number } = {};
    exerciseLogs.forEach(l => {
      if (!map[l.workoutDate] || l.weightUsed > map[l.workoutDate]) {
        map[l.workoutDate] = l.weightUsed;
      }
    });
    // Return sorted arrays
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, weight]) => ({ date, weight }));
  }, [exerciseLogs]);

  const progressLabels = useMemo(
    () => progressByDate.map(l => l.date.slice(5, 10)),
    [progressByDate]
  );
  const progressData = useMemo(
    () => progressByDate.map(l => l.weight),
    [progressByDate]
  );
  const limitedProgressLabels = useMemo(
    () => progressLabels.slice(-CHART_LIMIT),
    [progressLabels]
  );
  const limitedProgressData = useMemo(
    () => progressData.slice(-CHART_LIMIT),
    [progressData]
  );

  // 2. Projected Progress (simple: average last 5 weights, project next 5 sessions with diminishing returns)
  function getProjectedProgress(logs: UserExerciseLog[]) {
    if (logs.length < 2) return [];
    // Calculate the average increase per session
    const sorted = [...logs].sort((a, b) => a.workoutDate.localeCompare(b.workoutDate));
    const diffs = [];
    for (let i = 1; i < sorted.length; i++) {
      diffs.push(sorted[i].weightUsed - sorted[i - 1].weightUsed);
    }
    const avgIncrease = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    // Start from the last logged weight
    let last = sorted[sorted.length - 1].weightUsed;
    // Project next 5 sessions, reducing the increment by 10% each time
    const projections = [];
    let increment = avgIncrease;
    for (let i = 0; i < 5; i++) {
      last += increment;
      projections.push(Math.round(last * 100) / 100);
      increment *= 0.9; // reduce increment for diminishing returns
    }
    return projections;
  }
  const projectedData = getProjectedProgress(exerciseLogs);

  // 3. Rep Max Calculation (Epley formula)
  function estimateRepMax(weight: number, reps: number, maxReps: number) {
    const oneRM = weight * (1 + reps / 30);
    if (maxReps === 1) return oneRM;
    return oneRM / (1 + (maxReps - 1) / 30);
  }
  const repMaxes = useMemo(() =>
    [1, 3, 5].map(rm => ({
      rm,
      value: Math.max(
        ...exerciseLogs.map(l => estimateRepMax(l.weightUsed, l.completedReps, rm))
      ),
    })),
    [exerciseLogs]
  );

  // 4. Total Training Volume Over Time (all logs)
  function getVolumeData(logs: UserExerciseLog[]) {
    const volumeByDate: { [date: string]: number } = {};
    logs.forEach(l => {
      volumeByDate[l.workoutDate] = (volumeByDate[l.workoutDate] || 0) + l.weightUsed * l.completedReps;
    });
    return Object.entries(volumeByDate).map(([date, volume]) => ({ date, volume }));
  }

  const volumeData = useMemo(() => getVolumeData(logs), [logs]);
  const limitedVolumeData = useMemo(() => volumeData.slice(-CHART_LIMIT), [volumeData]);
  const limitedVolumeLabels = useMemo(() => limitedVolumeData.map(v => v.date.slice(5, 10)), [limitedVolumeData]);
  const limitedVolumeValues = useMemo(() => limitedVolumeData.map(v => v.volume), [limitedVolumeData]);


  const exerciseNames = useMemo(
    () => [...new Set(logs.map(l => l.exerciseName))],
    [logs]
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator />
      </View>
    )
  }

  if (!loading && logs.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "#fff", fontSize: 18, marginBottom: 16 }}>
          No exercise logs found yet.
        </Text>
        <Button mode="contained" onPress={signOut} style={{ backgroundColor: "#d32f2f", marginTop: 32 }}>
          Sign Out
        </Button>
      </View>
    );
  }

  const logData = exerciseLogs.slice(-10).reverse();

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <Text variant="headlineMedium" style={styles.header}>Your Exercise Progress</Text>
          {/* Exercise Selector */}
          <View style={{ marginBottom: 16, alignItems: "center" }}>
            <View style={{ width: 280, maxWidth: "90%" }}>
              <Text style={{ color: "#fff", marginBottom: 8 }}>Select Exercise:</Text>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button
                    mode="contained-tonal"
                    onPress={() => setMenuVisible(true)}
                    style={{
                      width: "100%",
                      backgroundColor: "#333",
                      borderRadius: 8,
                      justifyContent: "space-between",
                    }}
                    contentStyle={{ flexDirection: "row", justifyContent: "space-between" }}
                    labelStyle={{ color: "#fff", flex: 1, textAlign: "left" }}
                    icon="chevron-down"
                  >
                    {selectedExercise || "Choose exercise"}
                  </Button>
                }
                style={{
                  width: 280,
                  borderRadius: 8,
                  overflow: "hidden",
                  padding: 0,
                  marginTop: 42,
                  backgroundColor: "#222",
                }}
                contentStyle={{
                  paddingVertical: 0,
                  backgroundColor: "#222",
                }}
              >
                {exerciseNames.map(name => (
                  <Menu.Item
                    key={name}
                    onPress={() => {
                      onSelectExercise(name);
                    }}
                    title={name}
                    titleStyle={{
                      color: "#fff",
                      fontSize: 16,
                      paddingVertical: 8,
                      textAlign: "left",
                    }}
                    style={{
                      backgroundColor: selectedExercise === name ? "#444" : "transparent",
                      margin: 0,
                      borderRadius: 0,
                      paddingHorizontal: 16,
                      minWidth: "100%",
                      alignSelf: "stretch",
                    }}
                  />
                ))}
              </Menu>
            </View>
          </View>

          {/* Charts */}
          <Text style={styles.chartTitle}>Progress Over Time</Text>
          {progressData.length > 0 ? (
            <LineChart
              data={{
                labels: limitedProgressLabels.length > 6
                  ? skipLabels(limitedProgressLabels, 2)
                  : limitedProgressLabels,
                datasets: [{ data: limitedProgressData }]
              }}
              width={screenWidth}
              height={180}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          ) : (
            <Text style={styles.noData}>No data</Text>
          )}

          <Text style={styles.chartTitle}>Projected Progress</Text>
          {projectedData.length > 0 ? (
            <LineChart
              data={{
                labels: projectedData.map((_, i) => `+${i + 1}`),
                datasets: [{ data: projectedData }]
              }}
              width={screenWidth}
              height={180}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          ) : (
            <Text style={styles.noData}>No data</Text>
          )}

          <Text style={styles.chartTitle}>Estimated Rep Maxes</Text>
          {repMaxes.some(r => r.value > 0) ? (
            <BarChart
              data={{
                labels: repMaxes.map(r => `${r.rm}RM`),
                datasets: [{ data: repMaxes.map(r => Math.round(r.value * 100) / 100) }]
              }}
              width={screenWidth}
              height={180}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix="kg"
            />
          ) : (
            <Text style={styles.noData}>No data</Text>
          )}

          <Text style={styles.chartTitle}>Total Training Volume</Text>
          {volumeData.length > 0 ? (
            <LineChart
              data={{
                labels: limitedVolumeLabels.length > 6
                  ? skipLabels(limitedVolumeLabels, 2)
                  : limitedVolumeLabels,
                datasets: [{ data: limitedVolumeValues }]
              }}
              width={screenWidth}
              height={180}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          ) : (
            <Text style={styles.noData}>No data</Text>
          )}

          <Text variant="titleMedium" style={styles.subheader}>History for {selectedExercise}</Text>
        </View>
      }
      data={logData}
      keyExtractor={(log, idx) => log.workoutDate + idx}
      renderItem={({ item }) => (
        <View style={styles.logRow}>
          <Text>{item.workoutDate}: {item.completedReps} reps @ {item.weightUsed}kg</Text>
        </View>
      )}
      ListFooterComponent={
        <View style={{ marginTop: 32, alignItems: "center" }}>
          <Button mode="contained" onPress={signOut} style={{ backgroundColor: "#d32f2f" }}>
            Sign Out
          </Button>
        </View>
      }
      contentContainerStyle={{ paddingBottom: 32, paddingTop: 16 }}
      style={styles.container}
    />
  );
}


const chartConfig = {
  backgroundColor: "#25292e",
  backgroundGradientFrom: "#25292e",
  backgroundGradientTo: "#25292e",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(255, 215, 61, ${opacity})`,
  labelColor: () => "#fff",
  style: { borderRadius: 8 },
  propsForDots: { r: "4", strokeWidth: "2", stroke: "#ffd33d" }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      "#25292e",
    padding: 16
  },
  header: {
    color: "#fff",
    marginBottom: 16
  },
  subheader: {
    color: "#fff",
    marginTop: 24,
    marginBottom: 8
  },
  logRow: {
    backgroundColor: "#fff",
    padding: 8,
    marginBottom: 4,
    borderRadius: 4
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8
  },
  chartTitle: {
    color: "#fff",
    marginTop: 16,
    marginBottom: 4,
    fontWeight: "bold"
  },
  noData: {
    color: "#888",
    fontStyle: "italic",
    marginBottom: 8
  }
});