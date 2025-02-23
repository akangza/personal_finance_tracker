import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Cards from '../components/Cards'
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from "../firebase";
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from "moment";
import TransactionsTable from '../components/TransactionsTable';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransaction';
import { updateDoc, doc } from 'firebase/firestore';
import EditTransactionModal from '../components/Modals/editTransaction';



function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);



  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const showEditModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setSelectedTransaction(null);
  };
  async function updateTransaction(updatedTransaction) {
    if (!user) return;

    try {
      const { id, ...data } = updatedTransaction;
      const transactionRef = doc(db, `users/${user.uid}/transactions`, id);

      await updateDoc(transactionRef, {
        ...data,
        date: moment(data.date, "YYYY-MM-DD").format("YYYY-MM-DD"),  // **Ensure Correct Date Format**
      });

      toast.success("Transaction Updated!");

      // Update transactions in state
      const updatedTransactions = transactions.map((txn) =>
        txn.id === id ? updatedTransaction : txn
      );
      setTransactions(updatedTransactions);
      calculateBalance();
      handleEditCancel();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error updating transaction!");
    }
  }







  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    console.log("New Transaction", newTransaction)
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with Id: ", docRef.id);
      if (!many) toast.success("Transaction Added!");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't Add the Transaction ");
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  // const calculateBalance = () => {
  //   let incomeTotal = 0;
  //   let expensesTotal = 0;

  //   transactions.forEach((transaction) => {
  //     const amount = parseFloat(transaction.amount);
  //     if (transaction.type === "income") {
  //       incomeTotal += transaction.amount;
  //     } else {
  //       expensesTotal += transaction.amount;
  //     }
  //   });
  //   setIncome(incomeTotal.toFixed(2));
  //   setExpense(expensesTotal.toFixed(2));
  //   setTotalBalance((incomeTotal - expensesTotal).toFixed(2));
  // };

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      // Parse the transaction.amount to a number
      const amount = parseFloat(transaction.amount) || 0;
      if (transaction.type === "income") {
        incomeTotal += amount;
      } else {
        expensesTotal += amount;
      }
    });

    setIncome(incomeTotal.toFixed(2));
    setExpense(expensesTotal.toFixed(2));
    setTotalBalance((incomeTotal - expensesTotal).toFixed(2));
  };



  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsArray);


      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (<>
        <Cards
          income={income}
          expense={expense}
          totalBalance={totalBalance}
          showExpenseModal={showExpenseModal}
          showIncomeModal={showIncomeModal}
        />
        {transactions && transactions.length != 0 ?
          <ChartComponent sortedTransactions={sortedTransactions} /> : <NoTransactions />}

        <AddExpenseModal
          isExpenseModalVisible={isExpenseModalVisible}
          handleExpenseCancel={handleExpenseCancel}
          onFinish={onFinish}
        />
        <AddIncomeModal
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFinish}
        />
        <TransactionsTable
          transactions={transactions}
          addTransaction={addTransaction}
          fetchTransactions={fetchTransactions}
          showEditModal={showEditModal}
        />
        <EditTransactionModal
          isVisible={isEditModalVisible}
          handleEditCancel={handleEditCancel}
          transaction={selectedTransaction}
          onSubmit={updateTransaction}
        />
      </>
      )}
    </div>
  );
}

export default Dashboard;