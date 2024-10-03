import { INote, IUser, Member } from "../../global/indexedDB/interface";
import { ICash } from "../../pages/cash/interface";
import { ISubscription } from "../../pages/members/components/subscription/interface";


// indexedDB.ts
const DB_NAME = "NutriDB";

// Function to open the database
export function openDB(table: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    // First open the DB to get the current version (if any)
    const versionRequest = indexedDB.open(DB_NAME);

    versionRequest.onsuccess = (event: Event) => {
      let db = (event.target as IDBOpenDBRequest).result;
      const currentVersion = db.version;
      db.close(); // Close the current connection

      // Now open the DB with the correct version
      const request = indexedDB.open(DB_NAME, currentVersion);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        db = (event.target as IDBOpenDBRequest).result;
        console.log("Upgrading DB...");
        if (!db.objectStoreNames.contains(table)) {
          db.createObjectStore(table, {
            keyPath: "id",
            autoIncrement: true,
          });
          console.log(`Object store "${table}" created.`);
        }
      };

      request.onsuccess = (event: Event) => {
        db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(table)) {
          // Increment the version to create the missing store
          db.close();
          const newVersion = currentVersion + 1;
          const upgradeRequest = indexedDB.open(DB_NAME, newVersion);

          upgradeRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(table)) {
              db.createObjectStore(table, {
                keyPath: "id",
                autoIncrement: true,
              });
              console.log(
                `Object store "${table}" created in version upgrade.`
              );
            }
          };

          upgradeRequest.onsuccess = () => {
            resolve(upgradeRequest.result);
          };

          upgradeRequest.onerror = (event: Event) => {
            reject(
              `Upgrade error: ${(event.target as IDBRequest).error?.message}`
            );
          };
        } else {
          resolve(db);
        }
      };

      request.onerror = (event: Event) => {
        reject(
          `Database error: ${(event.target as IDBOpenDBRequest).error?.message}`
        );
      };
    };

    versionRequest.onerror = (event: Event) => {
      reject(
        `Failed to get database version: ${
          (event.target as IDBRequest).error?.message
        }`
      );
    };
  });
}

// Function to add a member
export function save(
  db: IDBDatabase,
  member: Member,
  table: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([table], "readwrite");
    const store = transaction.objectStore(table);
    const request = store.add(member);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event: Event) => {
      reject(`Add error: ${(event.target as IDBRequest).error?.message}`);
    };
  });
}

// Function to get all members
export function getMembers(db: IDBDatabase): Promise<Member[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["members"], "readonly");
    const store = transaction.objectStore("members");
    const request = store.getAll();

    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBRequest).result as Member[]);
    };

    request.onerror = (event: Event) => {
      reject(`Get error: ${(event.target as IDBRequest).error?.message}`);
    };
  });
}

// Function to update a member's status to 'isDeleted: true'
export function softDeleteMember(
  db: IDBDatabase,
  memberId: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["members"], "readwrite");
    const store = transaction.objectStore("members");
    const request = store.get(memberId);

    request.onsuccess = (event: Event) => {
      const member = (event.target as IDBRequest).result as Member;

      if (member) {
        // Set isDeleted to true
        member.isDeleted = !member?.isDeleted;

        // Save the updated member back to the store
        const updateRequest = store.put(member);

        updateRequest.onsuccess = () => {
          resolve();
        };

        updateRequest.onerror = (updateEvent: Event) => {
          reject(
            `Update error: ${(updateEvent.target as IDBRequest).error?.message}`
          );
        };
      } else {
        reject(`Member with ID ${memberId} not found.`);
      }
    };

    request.onerror = (event: Event) => {
      reject(`Get error: ${(event.target as IDBRequest).error?.message}`);
    };
  });
}

// indexedDB.ts
export function getMemberById(db: IDBDatabase, id: number): Promise<Member> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["members"], "readonly");
    const store = transaction.objectStore("members");
    const request = store.get(id);

    request.onsuccess = () => {
      const member = request.result;
      if (member) {
        resolve(member);
      } else {
        reject(`Member with ID ${id} not found.`);
      }
    };

    request.onerror = () => {
      reject("Failed to retrieve member.");
    };
  });
}

export function updateMember(
  db: IDBDatabase,
  updatedMember: Member
): Promise<string> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["members"], "readwrite");
    const store = transaction.objectStore("members");
    const request = store.put(updatedMember);

    request.onsuccess = () => {
      resolve("Member updated successfully.");
    };

    request.onerror = () => {
      reject("Failed to update member.");
    };
  });
}

//cash
// Function to get all members
export function getCash(db: IDBDatabase): Promise<ICash[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["cash"], "readonly");
    const store = transaction.objectStore("cash");
    const request = store.getAll();

    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBRequest).result as ICash[]);
    };

    request.onerror = (event: Event) => {
      reject(`Get error: ${(event.target as IDBRequest).error?.message}`);
    };
  });
}

export function saveCash(db: IDBDatabase, cash: ICash): Promise<void> {
  return new Promise((resolve, reject) => {
    const table = "cash";
    const transaction = db.transaction([table], "readwrite");
    const store = transaction.objectStore(table);
    const request = store.add(cash);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event: Event) => {
      reject(`Add error: ${(event.target as IDBRequest).error?.message}`);
    };
  });
}

//subscription

export function saveSubscription(
  db: IDBDatabase,
  cash: ISubscription
): Promise<void> {
  return new Promise((resolve, reject) => {
    const table = "subscriptions";
    const transaction = db.transaction([table], "readwrite");
    const store = transaction.objectStore(table);
    const request = store.add(cash);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event: Event) => {
      reject(`Add error: ${(event.target as IDBRequest).error?.message}`);
    };
  });
}
// Function to get all subscription
export function getSubscriptions(
  db: IDBDatabase,
  memberId: string
): Promise<ISubscription[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["subscriptions"], "readonly");
    const store = transaction.objectStore("subscriptions");

    // Use index if available, otherwise use getAll
    const request = store.getAll();

    request.onsuccess = (event: Event) => {
      const allSubscriptions = (event.target as IDBRequest)
        .result as ISubscription[];

      // Filter subscriptions based on memberId
      const filteredSubscriptions = allSubscriptions.filter(
        (sub) => sub.memberId === parseInt(memberId)
      );

      resolve(filteredSubscriptions);
    };

    request.onerror = (event: Event) => {
      reject(`Get error: ${(event.target as IDBRequest).error?.message}`);
    };
  });
}

export function deleteSubscription(db: IDBDatabase, id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["subscriptions"], "readwrite");
    const store = transaction.objectStore("subscriptions");
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event: Event) => {
      reject(`Delete error: ${(event.target as IDBRequest).error?.message}`);
    };
  });
}

export function updateSubscriptionStatus(
  db: IDBDatabase,
  id: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["subscriptions"], "readwrite");
    const store = transaction.objectStore("subscriptions");

    // Get the subscription by ID first
    const getRequest = store.get(id);

    getRequest.onsuccess = (event: Event) => {
      const subscription = (event.target as IDBRequest).result as ISubscription;

      if (subscription) {
        // Update the status and price
        subscription.status = "Due Paid";

        // Put the updated subscription back into the store
        const putRequest = store.put(subscription);

        putRequest.onsuccess = () => {
          resolve();
        };

        putRequest.onerror = (event: Event) => {
          reject(
            `Update error: ${(event.target as IDBRequest).error?.message}`
          );
        };
      } else {
        reject(`Subscription with ID ${id} not found.`);
      }
    };

    getRequest.onerror = (event: Event) => {
      reject(`Get error: ${(event.target as IDBRequest).error?.message}`);
    };
  });
}
export function updateSubscriptionState(
  db: IDBDatabase,
  subs: ISubscription[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["subscriptions"], "readwrite");
    const store = transaction.objectStore("subscriptions");

    // Iterate over each subscription in the array
    subs.forEach((sub) => {
      // Get the subscription by ID first
      const getRequest = store.get(sub.id);

      getRequest.onsuccess = (event: Event) => {
        const subscription = (event.target as IDBRequest)
          .result as ISubscription;

        if (subscription) {
          // Update the state and any other fields
          subscription.state = sub.state;

          // Put the updated subscription back into the store
          const putRequest = store.put(subscription);

          putRequest.onsuccess = () => {
            console.log(`Subscription with ID ${sub.id} updated successfully.`);
          };

          putRequest.onerror = (event: Event) => {
            console.error(
              `Update error for ID ${sub.id}: ${
                (event.target as IDBRequest).error?.message
              }`
            );
          };
        } else {
          console.error(`Subscription with ID ${sub.id} not found.`);
        }
      };

      getRequest.onerror = (event: Event) => {
        console.error(
          `Get error for ID ${sub.id}: ${
            (event.target as IDBRequest).error?.message
          }`
        );
      };
    });

    // Once the transaction completes, resolve the Promise
    transaction.oncomplete = () => {
      resolve();
    };

    // If the transaction fails, reject the Promise
    transaction.onerror = (event: Event) => {
      reject(
        `Transaction error: ${(event.target as IDBRequest).error?.message}`
      );
    };
  });
}
// Function to add a member
export async function saveUser(): Promise<void> {
  try {
    const db = await openDB("user"); // Use await here since openDB returns a Promise
    const transaction = db.transaction(["user"], "readwrite");
    const store = transaction.objectStore("user");
    const data: IUser = {
      id: 1,
      name: "nutri",
      password: "nutri",
    };
    const request = store.add(data);

    request.onsuccess = () => {
      console.log("User added successfully");
    };

    request.onerror = (event: Event) => {
      console.error(
        `Add error: ${(event.target as IDBRequest).error?.message}`
      );
    };
  } catch (error) {
    console.error(`Failed to open database: ${error}`);
    throw error;
  }
}

// Function to get all members
export async function getUser(): Promise<IUser[]> {
  const db = await openDB("user");
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["user"], "readonly");
    const store = transaction.objectStore("user");
    const request = store.getAll();

    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBRequest).result as IUser[]);
    };

    request.onerror = (event: Event) => {
      reject(`Get error: ${(event.target as IDBRequest).error?.message}`);
    };
  });
}

//Note
// Function to get all members
export function getNotes(db: IDBDatabase, memberId: string): Promise<INote[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["notes"], "readonly");
    const store = transaction.objectStore("notes");
     

    // Use index if available, otherwise use getAll
    const request = store.getAll();

    request.onsuccess = (event: Event) => {
      const allNote = (event.target as IDBRequest)
        .result as INote[];

      // Filter subscriptions based on memberId
      const filteredNotes = allNote.filter(
        (note) => note.memberId === parseInt(memberId)
      );

      resolve(filteredNotes);
    };

    request.onerror = (event: Event) => {
      reject(`Get error: ${(event.target as IDBRequest).error?.message}`);
    };
  });
}



 







export function saveNotes(db: IDBDatabase, note: INote): Promise<void> {
  return new Promise((resolve, reject) => {
    const table = "notes";
    const transaction = db.transaction([table], "readwrite");
    const store = transaction.objectStore(table);
    const request = store.add(note);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event: Event) => {
      reject(`Add error: ${(event.target as IDBRequest).error?.message}`);
    };
  });
}
