import React from "react";
import "./style.css";
import { Card, Row } from "antd";
import Button from "../Button";

function Cards({ income, expense, totalBalance, showExpenseModal, showIncomeModal }) {
    return (
        <div>
            <Row className="my-row">
                <Card bordered={true} className="my-card">
                    <h2>Current Balance</h2>
                    <p className="balance-text">₹{totalBalance}</p>
                    {/* <Button text="Reset Balance" blue={true}> </Button> */}
                </Card>
                <Card bordered={true} className="my-card">
                    <h2>Total Income</h2>
                    <p>₹{income}</p>
                    <Button text="Add Income" blue={true} onClick={showIncomeModal}></Button>
                </Card>
                <Card bordered={true} className="my-card">
                    <h2>Total Expenses</h2>
                    <p>₹{expense}</p>
                    <Button text="Add Expense" blue={true} onClick={showExpenseModal}></Button>
                </Card>
            </Row>
        </div>
    );
}

export default Cards;