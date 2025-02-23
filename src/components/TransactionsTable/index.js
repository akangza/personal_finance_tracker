import React, { useState } from "react";
import { Radio, Select, Table, Button, Popconfirm } from "antd";
import searchImg from "../../assets/search.svg";
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";
import { auth, db } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

function TransactionsTable({ transactions, addTransaction, fetchTransactions, showEditModal }) {
    const { Option } = Select;
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [sortKey, setSortKey] = useState("");
    const [user] = useAuthState(auth);
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => {
                return (
                    <>
                        <Button onClick={() => {
                            showEditModal(record);
                        }}>Edit</Button>
                        <Popconfirm
                            title="Are you sure you want to delete this transaction?"
                            onConfirm={() => deleteTransaction(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger>Delete</Button>
                        </Popconfirm>
                    </>
                );
            }
        }
    ];

    let filteredTransactions = transactions.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        item.type.includes(typeFilter)
    );

    let sortedTransactions = filteredTransactions.sort((a, b) => {
        if (sortKey == "date") {
            return new Date(a.date) - new Date(b.date);
        } else if (sortKey === "amount") {
            return a.amount - b.amount;
        } else {
            return 0;
        }
    });

    function exportCSV() {
        var csv = unparse({
            fields: ["name", "type", "tag", "date", "amount"],
            data: transactions,
        });
        const blob = new Blob([csv], { type: "text/csv; charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transactions.csv"
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function importFromCsv(event) {
        event.preventDefault();
        try {
            parse(event.target.files[0], {
                header: true,
                complete: async function (results) {
                    for (const transaction of results.data) {
                        console.log("Transactions", transaction);
                        const newTransaction = {
                            ...transaction,
                            amount: parseFloat(transaction.amount),
                        };
                        await addTransaction(newTransaction, true);
                    }
                },
            });
            toast.success("All Transactions Added");
            fetchTransactions();
            event.target.files = null;
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function deleteTransaction(transactionId) {
        if (!user) {
            toast.error("User not authenticated!");
            return;
        }
        if (!transactionId) {
            toast.error("Invalid transaction ID!");
            return;
        }

        try {
            const transactionRef = doc(db, `users/${user.uid}/transactions`, transactionId);

            await deleteDoc(doc(db, `users/${user.uid}/transactions`, transactionId));
            toast.success("Transaction deleted!");
            fetchTransactions();
        } catch (error) {
            toast.error("Error deleting transaction!");
        }
    }

    return (
        <div
            style={{
                width: "97%",
                padding: "0rem 2rem",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "center",
                    marginBottom: "1rem",
                }}
            >
                <div className="input-flex">
                    <img src={searchImg} width="16" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name"
                    />
                </div>

                <Select
                    className="select-input"
                    onChange={(value) => setTypeFilter(value)}
                    value={typeFilter}
                    placeholder="Filter"
                    allowClear
                >
                    <Option value="">All</Option>
                    <Option value="income">Income</Option>
                    <Option value="expense">Expense</Option>
                </Select>
            </div>

            <div className="my-table">
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: "1rem",
                }}
                >
                    <h2>My Transactions</h2>

                    <Radio.Group
                        className="input-radio"
                        onChange={(e) => setSortKey(e.target.value)}
                        value={sortKey}
                    >
                        <Radio.Button value="">No Sort</Radio.Button>
                        <Radio.Button value="date">Sort by Date</Radio.Button>
                        <Radio.Button value="amount">Sort by Amount</Radio.Button>
                    </Radio.Group  >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "1rem",
                            width: "400px",
                        }}
                    >
                        <button className="btn" onClick={exportCSV}>
                            Export to CSV
                        </button>
                        <label for="file-csv" className="btn btn-blue">
                            Import from CSV
                        </label>
                        <input

                            id="file-csv"
                            type="file"
                            accept=".csv"
                            required
                            onChange={importFromCsv}
                            style={{ display: "none" }}
                        />
                    </div>
                </div>
                <Table dataSource={sortedTransactions} columns={columns} />
            </div>
        </div>
    );
}

export default TransactionsTable;