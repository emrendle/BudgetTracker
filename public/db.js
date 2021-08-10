let db;
// create a new db request for a "BudgetDB" database.
const request = window.indexedDB.open("BudgetDB", 1);

request.onupgradeneeded = function (event) {
  // create object store called "BudgetStore" and set autoIncrement to true
  const db = event.target.result;

  db.createObjectStore("BudgetStore", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  // log error here
  console.log(`Woops! ${event.target.errorCode}.`);
};

function saveRecord(record) {
  // create a transaction on the pending db with readwrite access
  // access your pending object store
  // add record to your store with add method.

  const transaction = db.transaction(["BudgetStore"], "readwrite");
  const store = transaction.objectStore("BudgetStore");
  store.add(record);
}

// basically checks the indexeddb database and pulls whatever is in there out and puts it in mongodb - if you add something offline and then go back online, it will put it in mongo once you're online
function checkDatabase() {
  // open a transaction on your pending db
  // access your pending object store
  // get all records from store and set to a variable

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          // if successful, open a transaction on your pending db
          // access your pending object store
          // clear all items in your store
        });
    }
  };
}

// listen for app coming back online - this fires the checkdatabase function which pulls info out of the indexeddb offline and puts it into mongo online
window.addEventListener("online", checkDatabase);