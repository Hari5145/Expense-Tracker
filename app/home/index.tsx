import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { BarChart } from "react-native-chart-kit";

interface MonthlyData {
  month: string; 
  credited: number;
  debited: number;
  categories: { category: string; amount: number }[];
}

const sampleCategories = [
  { category: "Food", amount: 1500 },
  { category: "Transport", amount: 800 },
  { category: "Shopping", amount: 2000 },
  { category: "Bills", amount: 1500 },
];

const generateMonthlyData = (): MonthlyData[] => {
  const monthlyData: MonthlyData[] = [];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); 
  const currentYear = currentDate.getFullYear();

  for (let i = 0; i < 6; i++) {
    const monthIndex = currentMonth - i; 
    const year = currentYear - Math.floor(monthIndex / 12); 
    const month = ((monthIndex % 12) + 12) % 12; 
    const monthName = new Date(year, month).toLocaleString("default", {
      month: "short",
    });

    const credited = Math.floor(Math.random() * 5000) + 1000; 
    const debited = Math.floor(Math.random() * 3000) + 500; 

    monthlyData.push({
      month: `${monthName} ${year}`, 
      credited: credited,
      debited: debited,
      categories: sampleCategories, 
    });
  }

  return monthlyData; 
};

const ExpenseTracker: React.FC = () => {
  const [monthlyData] = useState(generateMonthlyData()); 
  const [selectedMonth, setSelectedMonth] = useState(monthlyData[0]); 

  const barChartData = {
    labels: ["Credited", "Debited"],
    datasets: [
      {
        data: [selectedMonth.credited, selectedMonth.debited],
        color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`, 
      },
    ],
  };

  const handleLogout = () => {
    router.replace("/");
  };

  const renderMonthItem = ({ item }: { item: MonthlyData }) => (
    <TouchableOpacity
      style={styles.monthItem}
      onPress={() => setSelectedMonth(item)}
    >
      <Text style={styles.monthText}>{item.month}</Text>
      <Text style={styles.amountText}>Credited: ₹{item.credited}</Text>
      <Text style={styles.amountText}>Debited: ₹{item.debited}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expense Tracker</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chartContainer}>
        <BarChart
          data={barChartData}
          width={300}
          height={250}
          yAxisLabel="₹"
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          fromZero={true}
          style={{
            marginVertical: 8,
            borderRadius: 16,
            alignSelf: "center",
          }}
          verticalLabelRotation={30}
          
        />
      </View>
      <FlatList
        data={monthlyData}
        renderItem={renderMonthItem}
        keyExtractor={(item, index) => `${item.month}-${index}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20, 
    justifyContent: "space-between"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    marginLeft:110
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  monthItem: {
    padding: 15,
    backgroundColor: "#e0f7fa",
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  amountText: {
    fontSize: 16,
    color: "#00796b",
  },
  logoutButton: {
    padding: 10,
  },
  logoutText: {
    color: "#f44336", 
    fontSize: 16,
    fontWeight: "bold",}
});

export default ExpenseTracker;
