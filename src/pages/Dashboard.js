import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import Cards from '../components/Cards';
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth,db} from "../Firebase";
import {toast} from "react-toastify";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import TransactionsTable from '../components/TransactionsTable';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransactions';

function Dashboard() {
  
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible,setIsExpenseModalVisible] = useState(false);
  const[isIncomeModalVisible,setIsIncomeModalVisible] = useState(false);
  const [transactions,setTransactions] = useState([]);
  const [loading,setLoading] = useState(false);
  const [income,setIncome] = useState(0);
  const [expense,setExpanse] = useState(0);
  const [totalBalance,setTotalBalance] = useState(0);

  const showExpanseModal = () =>{
    setIsExpenseModalVisible(true);
  }
  const showIncomeModal = () =>{
    setIsIncomeModalVisible(true);
  }
  const handleExpanseCancel = ()=>{
    setIsExpenseModalVisible(false);
  }
  const handleIncomeCancel = ()=>{
    setIsIncomeModalVisible(false);
  }

  const onFinish =(values,type) =>{
   
    const newTransactions = {
      type:type,
      date: values.date.format("YYYY-MM-DD"),
      amount:parseFloat(values.amount),
      tag:values.tag,
      name:values.name,
    };
    addTransaction(newTransactions);

  }

  async function addTransaction(transaction,many) {
    // add the doc to firebase
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if(!many) toast.success("Transaction Added!");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr); 
      CalculateBalance(); 
    } catch (e) {
      console.error("Error adding document: ", e);
      if(!many) toast.error("Couldn't add transaction");
      
    }
  }

  useEffect(() =>{
    fetchTransactions();
  },[user]);

  useEffect(() =>{
    CalculateBalance();
  },[transactions]);

  function CalculateBalance(){
    let incomeTotal = 0;
    let expenseTotal = 0;
    transactions.forEach((transaction) =>{
      if(transaction.type === "income"){
        incomeTotal += transaction.amount;
      }
      else{
        expenseTotal += transaction.amount;
      }
    })
    setIncome(incomeTotal);
    setExpanse(expenseTotal);
    setTotalBalance(incomeTotal-expenseTotal);
  }

  async function fetchTransactions() {
    // get all doc from collection

    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log("Transactions Array>>",transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  let sortedTransactions = transactions.sort((a,b) => {
    return new Date(a.date)-new Date(b.date);
  })

  return (
    <div>
      <Header/>
      {
        loading ? (
          <p>Loading...</p>
        ):( 
          <>
        <Cards
          income={income}
          expense={expense}
          totalBalance={totalBalance}
          showExpanseModal={showExpanseModal}
          showIncomeModal={showIncomeModal}
          />
          {transactions.length != 0 ? <ChartComponent sortedTransactions={sortedTransactions}/> : <NoTransactions/>}
          <AddExpenseModal
               visible={isExpenseModalVisible}
               onCancel={handleExpanseCancel}
               onFinish={onFinish}
          />
          <AddIncomeModal
           visible={isIncomeModalVisible}
           onCancel={handleIncomeCancel}
           onFinish={onFinish}
          />
          <TransactionsTable transactions={transactions}
          addTransaction={addTransaction}
          fetchTransactions = {fetchTransactions}
          />
          </>
          )
          
      }
     
      
    </div>

  )
}

export default Dashboard;