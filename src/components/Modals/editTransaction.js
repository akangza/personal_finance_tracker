import React, { useState, useEffect } from "react";
import { Form, Modal, Input, DatePicker, Select, Button } from "antd";
import moment from "moment";
import { toast } from "react-toastify";

const { Option } = Select;

function EditTransactionModal({ isVisible, handleEditCancel, transaction, onSubmit }) {
    const [form] = Form.useForm();
    const [selectedType, setSelectedType] = useState(transaction?.type || "expense");

    useEffect(() => {
        if (transaction) {
            form.setFieldsValue({
                name: transaction.name,
                amount: transaction.amount,
                date: transaction.date ? moment(transaction.date, "YYYY-MM-DD") : null,
                type: transaction.type,
                tag: transaction.tag,
            });
            setSelectedType(transaction.type);
        }
    }, [transaction, form]);

    if (!transaction) return null;

    const incomeTags = ["Salary", "Freelance", "Investment", "Bonus Incentive"];
    const expenseTags = ["Housing", "Food", "Transportation", "Education", "Healthcare", "Debt Payment", "Savings & Investment", "Entertainment"];

    const handleSubmit = (values) => {
        if (!values.date || !moment(values.date).isValid()) {
            toast.error("Please select a valid date.");
            return;
        }

        const updatedTransaction = {
            ...transaction,
            name: values.name.trim() || transaction.name,
            // amount: isNaN(parseFloat(values.amount)) ? transaction.amount : parseFloat(values.amount),
            amount: parseFloat(values.amount) || transaction.amount,
            date: values.date.format("YYYY-MM-DD"),  // **Ensure Date is in Correct Format**
            type: values.type.trim() || transaction.type,
            // tag: values.tag || transaction.tag,
            tag: values.tag,
        };

        onSubmit(updatedTransaction);

    };

    return (
        <Modal
            title="Edit Transaction"
            visible={isVisible}
            onCancel={handleEditCancel}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    name: transaction.name,
                    amount: transaction.amount,
                    date: transaction.date ? moment(transaction.date, "YYYY-MM-DD") : null,
                    type: transaction.type,
                    tag: transaction.tag,
                }}
                onFinish={handleSubmit}
            >
                <Form.Item label="Name" name="name">
                    <Input />
                </Form.Item>

                <Form.Item label="Amount" name="amount">
                    <Input type="number" />
                </Form.Item>

                <Form.Item label="Date" name="date">
                    <DatePicker format="YYYY-MM-DD" allowClear />
                </Form.Item>

                <Form.Item label="Type" name="type">
                    <Select
                        onChange={(value) => {
                            setSelectedType(value);
                            form.setFieldsValue({ tag: undefined });
                        }}
                    >
                        <Option value="income">Income</Option>
                        <Option value="expense">Expense</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Tag" name="tag">
                    <Select>
                        {(selectedType === "income" ? incomeTags : expenseTags).map((tag) => (
                            <Option key={tag} value={tag}>{tag}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button onClick={handleEditCancel}>Cancel</Button>
                    <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>Update</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default EditTransactionModal;
