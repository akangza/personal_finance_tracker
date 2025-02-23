// import React from 'react';
// import { Line, Pie } from "@ant-design/charts";
// import { Row, Card } from 'antd';

// function ChartComponent({ sortedTransactions }) {
//     const data = sortedTransactions.map((item) => {
//         return { date: item.date, amount: item.amount };
//     });


//                                 // let spendingData = sortedTransactions.filter((transaction) => {
//                                 //     if (transaction.type == "expense") {
//                                 //         return { tag: transaction.tag, amount: transaction.amount };
//                                 //     }
//                                 // });

//                                 // let spendingData = sortedTransactions.filter((transaction) => {
//                                 //     return transaction.type === "expense";
//                                 // });

//     let spendingData = sortedTransactions.filter((transaction) => transaction.type === "expense");



//     let finalSpendings = spendingData.reduce((acc, obj) => {
//         let key = obj.tag;
//         if (!acc[key]) {
//             acc[key] = { tag: obj.tag, amount: obj.amount };
//         } else {
//             acc[key].amount += obj.amount;
//         }
//         return acc;
//     }, {});

//     let newSpendings = [
//         { tag: "Housing", amount: 0 },
//         { tag: "Food", amount: 0 },
//         { tag: "Transportation", amount: 0 },
//         { tag: "Education", amount: 0 },
//         { tag: "Healthcare", amount: 0 },
//         { tag: "Debt Payment", amount: 0 },
//         { tag: "Savings & Investment", amount: 0 },
//         { tag: "Entertainment", amount: 0 },
//     ];



//     spendingData.forEach((item) => {
//         let tag = item.tag.toLowerCase();  // Convert tag to lowercase
//         if (tag === "housing") {
//             newSpendings[0].amount += item.amount;
//         } else if (tag === "food") {
//             newSpendings[1].amount += item.amount;
//         } else if (tag === "transportation") {
//             newSpendings[2].amount += item.amount;
//         } else if (tag === "education") {
//             newSpendings[3].amount += item.amount;
//         } else if (tag === "healthcare") {
//             newSpendings[4].amount += item.amount;
//         } else if (tag === "debt payment") {
//             newSpendings[5].amount += item.amount;
//         } else if (tag === "savings & investment") {
//             newSpendings[6].amount += item.amount;
//         } else {
//             newSpendings[7].amount += item.amount;
//         }
//     });


//     const config = {
//         data: data, autoFit: true,
//         xField: "date",
//         yField: "amount",
//     };
//     const spendingConfig = {
//         data: newSpendings,
//         angleField: "amount",
//         colorField: "tag",
//     };
//     const cardStyle = {
//         boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
//         margin: "2rem",
//         borderRadius: "0.5rem",
//         minWidth: "400px",
//         flex: 1,
//     };

//     let chart;
//     let pieChart;
//     return (
//         <Row gutter={16}>
//             <Card bordered={true} style={cardStyle}>
//                 <h2>Your Financial Trend Chart</h2>
//                 <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
//             </Card>
//             <Card bordered={true} style={{ ...cardStyle, flex: 0.6 }}>
//                 <h2>Total Spendings</h2>
//                 {newSpendings.length == 0 ? (
//                     <p>Seems like you haven't spent anything till now...</p>
//                 ) : (
//                     <Pie {...spendingConfig} onReady={(chartInstance) => (pieChart = chartInstance)} />)}
//             </Card>
//                                     {/* <div>
//                                         <h2 style={{ marginTop: 0 }}>Your Financial Trend Chart</h2>
//                                         <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
//                                     </div>
//                                     <div>
//                                         <h2>Your Spendings</h2>
//                                         <Pie {...spendingConfig} onReady={(chartInstance) => (pieChart = chartInstance)} />
//                                     </div> */}
//         </Row>
//     );
// };

// export default ChartComponent;


import React from "react";
import { Line, Pie } from "@ant-design/charts";
import { Row, Card } from "antd";
import moment from 'moment';

function ChartComponent({ sortedTransactions }) {
    if (!sortedTransactions || sortedTransactions.length === 0) return null;

    const getMonthKey = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    };

    const aggregateByPeriod = (transactions) => {
        const grouped = transactions.reduce((acc, transaction) => {
            const timePeriod = getMonthKey(transaction.date);
            if (!acc[timePeriod]) {
                acc[timePeriod] = { income: 0, expense: 0 };
            }
            if (transaction.type === "income") {
                acc[timePeriod].income += transaction.amount;
            } else if (transaction.type === "expense") {
                acc[timePeriod].expense += transaction.amount;
            }
            return acc;
        }, {});

        return Object.entries(grouped).map(([date, { income, expense }]) => ({
            date,
            netBalance: income - expense,
            income,
            expense,
        }));
    };

    const aggregatedData = aggregateByPeriod(sortedTransactions);

    const spendingData = sortedTransactions.filter(
        (transaction) => transaction.type === "expense"
    );

    const tagTotals = spendingData.reduce((acc, item) => {
        const tag = item.tag.toLowerCase();
        acc[tag] = (acc[tag] || 0) + item.amount;
        return acc;
    }, {});

    const newSpendings = Object.entries(tagTotals).map(([tag, amount]) => ({
        tag: tag,
        amount: amount,
        label: `${tag}: ${amount}`,
    }));

    const lineChartConfig = {
        data: aggregatedData, // Change data to aggregatedData
        xField: "date", // Add xField
        yField: "netBalance", // Add yField
        // point: { size: 5, shape: 'diamond' },
        label: {
            style: {
                fill: '#aaa',
            },
        },
    };


    const categoryList = [
        "Housing",
        "Food",
        "Transportation",
        "Education",
        "Healthcare",
        "Debt Payment",
        "Savings & Investment",
        "Entertainment",
    ];

    const categoryMap = Object.fromEntries(categoryList.map(tag => [tag.toLowerCase(), { tag, amount: 0 }]));

    sortedTransactions
        .filter(transaction => transaction.type === "expense")
        .forEach(({ tag, amount }) => {
            const lowerTag = tag.toLowerCase();
            if (categoryMap[lowerTag]) {
                categoryMap[lowerTag].amount += amount;
            } else {
                categoryMap["entertainment"].amount += amount;
            }
        });

    const pieChartData = Object.values(categoryMap);

    const pieChartConfig = {
        data: pieChartData,
        angleField: "amount",
        colorField: "tag",
    }

    const cardStyle = {
        boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
        margin: "2rem",
        borderRadius: "0.5rem",
        minWidth: "400px",
        flex: 1,
    };

    return (
        <Row gutter={16}>
            <Card bordered={true} style={cardStyle}>
                <h2>Your Financial Trend Chart</h2>
                <Line {...lineChartConfig} />
            </Card>
            <Card bordered={true} style={{ ...cardStyle, flex: 0.6 }}>
                <h2>Total Spendings</h2>
                {spendingData.length === 0 ? (
                    <p>Seems like you haven't spent anything till now...</p>
                ) : (
                    <Pie {...pieChartConfig} />
                )}
            </Card>
        </Row>
    );
}

export default ChartComponent;


