// import React, { useState, useEffect } from "react";
// import { Form, Modal, Input, DatePicker, Select, Button } from "antd";
// import moment from "moment";
// import { toast } from "react-toastify";

// const { Option } = Select;

// // function EditTransactionModal({ isVisible, handleEditCancel, transaction, onSubmit }) {
// //     const [form] = Form.useForm();  // This defines the form instance
// //     const [formValues, setFormValues] = useState(transaction || {});

// //     useEffect(() => {
// //         if (transaction) {
// //             form.setFieldsValue({
// //                 name: transaction.name,
// //                 amount: transaction.amount,
// //                 date: transaction.date ? moment(transaction.date, "YYYY-MM-DD") : null,
// //                 type: transaction.type,
// //                 tag: transaction.tag,
// //             });
// //         }
// //     }, [transaction, form]);

// //     if (!transaction) return null;

// //     const handleChange = (e) => {
// //         setFormValues({ ...formValues, [e.target.name]: e.target.value });
// //     };

// //     const handleDateChange = (date, dateString) => {
// //         // If the user clears the date, date will be null.
// //         if (date && date.isValid()) {
// //             setFormValues({ ...formValues, date: date.format("YYYY-MM-DD") });
// //         } else {
// //             // If date is cleared or invalid, update the state accordingly.
// //             setFormValues({ ...formValues, date: "" });
// //         }
// //     };

// //     const handleTypeChange = (value) => {
// //         setFormValues({ ...formValues, type: value });
// //     };

// //     const handleSubmit = () => {
// //         if (!formValues.date || !moment(formValues.date, "YYYY-MM-DD", true).isValid()) {
// //             toast.error("Please enter a valid date in the format YYYY-MM-DD.");
// //             return;
// //         }
// //         // Ensure the amount is stored as a number
// //         const updatedTransaction = {
// //             ...transaction,
// //             ...formValues,
// //             amount: parseFloat(formValues.amount) || 0
// //         };
// //         onSubmit(updatedTransaction);
// //     };


// //     const incomeTags = [
// //         "Salary",
// //         "Freelance",
// //         "Investment",
// //         "Bonus Incentive",
// //     ];

// //     const expenseTags = [
// //         "Housing",
// //         "Food",
// //         "Transportation",
// //         "Education",
// //         "Healthcare",
// //         "Debt Payment",
// //         "Savings Investments",
// //         "Entertainment",
// //     ];

// //     return (
// //         <Modal
// //             style={{ fontWeight: 600 }}
// //             title="Edit Transaction"
// //             visible={isVisible}
// //             onCancel={handleEditCancel}
// //             footer={[
// //                 <Button key="cancel" onClick={handleEditCancel}>
// //                     Cancel
// //                 </Button>,
// //                 <Button key="submit" type="primary" onClick={handleSubmit}>
// //                     Update
// //                 </Button>,
// //             ]}
// //         >
// //             <Input
// //                 name="name"
// //                 placeholder="Name"
// //                 value={formValues.name || ""}
// //                 onChange={handleChange}
// //             />
// //             <Input
// //                 name="amount"
// //                 type="number"
// //                 placeholder="Amount"
// //                 value={formValues.amount !== undefined ? formValues.amount : ""}
// //                 onChange={handleChange}
// //             />

// //             <DatePicker
// //                 format="YYYY-MM-DD"
// //                 placeholder="YYYY-MM-DD"
// //                 allowClear
// //                 value={formValues.date ? moment(formValues.date, "YYYY-MM-DD") : null}
// //                 onChange={handleDateChange}
// //             />

// //             <Select value={formValues.type || ""} onChange={handleTypeChange} style={{ width: "100%", marginTop: "1rem" }}>
// //                 <Option value="income">Income</Option>
// //                 <Option value="expense">Expense</Option>
// //             </Select>
// //         </Modal>
// //     );
// // }

// function EditTransactionModal({ isVisible, handleEditCancel, transaction, onSubmit }) {
//     const [form] = Form.useForm();

//     const initialType = transaction ? transaction.type : "expense";
//     const [selectedType, setSelectedType] = useState(initialType);

//     useEffect(() => {
//         if (transaction) {
//             form.setFieldsValue({
//                 name: transaction.name,
//                 amount: transaction.amount,
//                 date: transaction.date ? moment(transaction.date, "YYYY-MM-DD") : null,
//                 type: transaction.type,
//                 tag: transaction.tag,
//             });
//             setSelectedType(transaction.type);
//         }
//     }, [transaction, form]);

//     if (!transaction) { return null; }

//     const incomeTags = [
//         "Salary",
//         "Freelance",
//         "Investment",
//         "Bonus Incentive",
//     ];

//     const expenseTags = [
//         "Housing",
//         "Food",
//         "Transportation",
//         "Education",
//         "Healthcare",
//         "Debt Payment",
//         "Savings Investments",
//         "Entertainment",
//     ];

//     // (3) When the transaction changes or the modal opens, set the form fields.
//     // useEffect(() => {
//     //     if (transaction) {
//     //         form.setFieldsValue({
//     //             name: transaction.name,
//     //             amount: transaction.amount,
//     //             date: transaction.date ? moment(transaction.date, "YYYY-MM-DD") : moment(),
//     //             type: transaction.type,
//     //             tag: transaction.tag,
//     //         });
//     //     }
//     // }, [transaction, form]);

//     // (4) Use Form.useWatch to monitor the current value of the "type" field.
//     // This will allow the tag options to update when the user changes the type.
//     // const currentType = Form.useWatch("type", form) || safeTransaction.type;

//     return (
//         <Modal
//             style={{ fontWeight: 600 }}
//             title="Edit Transaction"
//             visible={isVisible}
//             onCancel={handleEditCancel}
//             footer={null}
//             destroyOnClose
//         >
//             <Form
//                 form={form}
//                 layout="vertical"
//                 initialValues={{
//                     name: transaction.name,
//                     amount: transaction.amount,
//                     date: transaction.date ? moment(transaction.date, "YYYY-MM-DD") : null,
//                     type: transaction.type,
//                     tag: transaction.tag,
//                 }}
//                 onFinish={(values) => {
//                     const updatedTransaction = {
//                         ...transaction,
//                         name:
//                             values.name && values.name.trim() !== ""
//                                 ? values.name
//                                 : transaction.name,
//                         amount:
//                             values.amount && values.amount.toString().trim() !== ""
//                                 ? values.amount
//                                 : transaction.amount,
//                         date: values.date
//                             ? moment(values.date).format("YYYY-MM-DD")
//                             : transaction.date,
//                         type:
//                             values.type && values.type.trim() !== ""
//                                 ? values.type
//                                 : transaction.type,
//                         tag:
//                             values.tag && values.tag.trim() !== ""
//                                 ? values.tag
//                                 : transaction.tag,
//                     };
//                     onSubmit(updatedTransaction);
//                 }}
//             >
//                 <Form.Item
//                     style={{ fontWeight: 600 }}
//                     label="Name"
//                     name="name"
//                 >
//                     <Input type="text" className="custom-input" />
//                 </Form.Item>

//                 <Form.Item
//                     style={{ fontWeight: 600 }}
//                     label="Amount"
//                     name="amount"
//                 >
//                     <Input type="number" className="custom-input" />
//                 </Form.Item>

//                 <Form.Item label="Date" name="date">
//                     <DatePicker
//                         className="custom-input"
//                         format="YYYY-MM-DD"
//                         allowClear
//                     />
//                 </Form.Item>

//                 <Form.Item
//                     label="Type"
//                     name="type"
//                     style={{ fontWeight: 600 }}
//                 >
//                     <Select className="select-input-2"
//                         onChange={(value) => {
//                             // If the user changes the type (different from the original), clear the Tag field.
//                             if (value !== transaction.type) {
//                                 setSelectedType(value);
//                                 form.setFieldsValue({ tag: undefined });
//                             } else {
//                                 setSelectedType(value);
//                             }
//                         }}
//                     >
//                         <Option value="income">Income</Option>
//                         <Option value="expense">Expense</Option>
//                     </Select>
//                 </Form.Item>

//                 <Form.Item label="Tag" name="tag" style={{ fontWeight: 600 }}
//                     rules={[
//                         ({ getFieldValue }) => ({
//                             validator(_, value) {
//                                 // Use optional chaining to safely read transaction.type
//                                 if (getFieldValue("type") !== transaction?.type) {
//                                     if (!value || value.trim() === "") {
//                                         return Promise.reject(
//                                             new Error("Please select a tag for the new type.")
//                                         );
//                                     }
//                                 }
//                                 return Promise.resolve();
//                             },
//                         }),
//                     ]}
//                 >
//                     <Select className="select-input-2">
//                         {(selectedType === "income" ? incomeTags : expenseTags).map((tag) => (
//                             <Option key={tag} value={tag}>
//                                 {tag}
//                             </Option>
//                         ))}
//                     </Select>
//                 </Form.Item>

//                 <Form.Item>
//                     <Button onClick={handleEditCancel}>
//                         Cancel
//                     </Button>
//                     <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
//                         Update
//                     </Button>
//                 </Form.Item>
//             </Form>
//         </Modal>
//     );
// }

// export default EditTransactionModal;


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
