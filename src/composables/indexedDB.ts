import { orderModel } from "../interface/productManageModel";

/**
 * 打开数据库
 * @param {object} dbName 数据库的名字
 * @param {string} storeName 仓库名称
 * @param {string} version 数据库的版本
 * @return {object} 该函数会返回一个数据库实例
 */
export function openDB(dbName: string, version = 1): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    //  兼容浏览器
    var indexedDB = window.indexedDB;
    //   window.indexedDB ||
    //   window.mozIndexedDB ||
    //   window.webkitIndexedDB ||
    //   window.msIndexedDB;
    let db;
    // 打开数据库，若没有则会创建
    const request = indexedDB.open(dbName, version);

    // 数据库打开成功回调
    request.onsuccess = function (event: Event) {
      db = (event.target as IDBRequest).result as IDBDatabase; // 数据库对象
      console.log("数据库打开成功");
      resolve(db);
    };
    // 数据库打开失败的回调
    request.onerror = function (event) {
      console.log("数据库打开报错");
    };
    // 数据库有更新时候的回调
    request.onupgradeneeded = function (event) {
      console.log("更新時");
      // 数据库创建或升级的时候会触发
      console.log("onupgradeneeded");
      db = (event.target as IDBRequest).result as IDBDatabase; // 数据库对象
      var objectStore;
      // 创建存储库
      objectStore = db.createObjectStore("orders", {
        keyPath: "id", // 这是主键
        autoIncrement: true, // 实现自增
      });
      // 创建索引，在后面查询数据的时候可以根据索引查
      objectStore.createIndex("id", "id", { unique: true });
      objectStore.createIndex("products", "products", { unique: false });
      objectStore.createIndex("user", "user", { unique: false });
      objectStore.createIndex("isPaid", "isPaid", { unique: false });
      objectStore.createIndex("finalTotal", "finalTotal", { unique: false });
    };
  });
}
/**
 * 新增数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} data 数据
 */
export function addData(
  db: IDBDatabase,
  storeName: string,
  data: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    //  兼容浏览器
    var request = db
      .transaction([storeName], "readwrite") // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
      .objectStore(storeName) // 仓库对象
      .add(data);

    request.onsuccess = function () {
      console.log("數據寫入成功");
      resolve(); // 🔥 確保 Promise 解析，才會繼續執行 router.push()
    };

    request.onerror = function (event: Event) {
      console.log("數據寫入失敗", event);
      reject(event); // 🔥 確保 Promise 失敗時能夠捕獲錯誤
    };
  });
}

/**
 * 通过主键读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} key 主键值
 */
export function getDataByKey(db: IDBDatabase, storeName: string, key: any) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction([storeName]); // 事务
    var objectStore = transaction.objectStore(storeName); // 仓库对象
    var request = objectStore.get(key); // 通过主键获取数据

    request.onerror = function (event: Event) {
      console.log("事务失败");
    };

    request.onsuccess = function (event: Event) {
      console.log("主键查询结果: ", request.result);
      resolve(request.result);
    };
  });
}

/**
 * 通过游标读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 */
export function cursorGetData(
  db: IDBDatabase,
  storeName: string
): Promise<orderModel[]> {
  return new Promise((resolve, reject) => {
    let list = [] as any[];
    var store = db
      .transaction(storeName, "readwrite") // 事务
      .objectStore(storeName); // 仓库对象
    var request = store.openCursor(); // 指针对象
    // 游标开启成功，逐行读数据
    request.onsuccess = function (e: Event) {
      var cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
      if (cursor) {
        // 必须要检查
        list.push(cursor.value);
        cursor.continue(); // 遍历了存储对象中的所有内
      } else {
        //   console.log("游标读取的数据：", list);
        console.log("游标读取的数据：");
        resolve(list);
      }
    };
    request.onerror = function (e: Event) {
      reject("读取数据失败：" + (e.target as IDBRequest).error);
    };
  });
}

/**
 * 通过索引读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
export function getDataByIndex(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: any
) {
  var store = db.transaction(storeName, "readwrite").objectStore(storeName);
  var request = store.index(indexName).get(indexValue);
  request.onerror = function () {
    console.log("事务失败");
  };
  request.onsuccess = function (e: Event) {
    var result = (e.target as IDBRequest).result as IDBDatabase; // 数据库对象
    // var result = e.target.result;
    console.log("索引查询结果：", result);
  };
}

/**
 * 通过索引和游标查询记录
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
export function cursorGetDataByIndex(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: any
) {
  let list = [];
  var store = db.transaction(storeName, "readwrite").objectStore(storeName); // 仓库对象
  var request = store
    .index(indexName) // 索引对象
    .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
  request.onsuccess = function (e: Event) {
    var cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
    if (cursor) {
      // 必须要检查
      list.push(cursor);
      cursor.continue(); // 遍历了存储对象中的所有内容
      return list;
    } else {
      // console.log("游标索引查询结果：", list);
      console.log("游标索引查询结果：");
    }
  };
  request.onerror = function (e: Event) {};
}

/**
 * 通过索引和游标分页查询记录
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 * @param {number} page 页码
 * @param {number} pageSize 查询条数
 */
export function cursorGetDataByIndexAndPage(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: any,
  page: any,
  pageSize: any
) {
  let list = [];
  let counter = 0; // 计数器
  let advanced = true; // 是否跳过多少条查询
  var store = db.transaction(storeName, "readwrite").objectStore(storeName); // 仓库对象
  var request = store
    .index(indexName) // 索引对象
    .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
  request.onsuccess = function (e: Event) {
    var cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
    if (page > 1 && advanced) {
      advanced = false;
      cursor.advance((page - 1) * pageSize); // 跳过多少条
      return;
    }
    if (cursor) {
      // 必须要检查
      list.push(cursor.value);
      counter++;
      if (counter < pageSize) {
        cursor.continue(); // 遍历了存储对象中的所有内容
      } else {
        // cursor = null;
        console.log("分页查询结果", list);
      }
    } else {
      console.log("分页查询结果");
      // console.log("分页查询结果", list);
    }
  };
  request.onerror = function (e: Event) {};
}

/**
 * 更新数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} data 数据
 */
export function updateDB(
  db: IDBDatabase,
  storeName: string,
  data: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    var request = db
      .transaction([storeName], "readwrite") // 事务对象
      .objectStore(storeName) // 仓库对象
      .put(data);

    request.onsuccess = function () {
      console.log("數據寫入成功");
      resolve(); // 🔥 確保 Promise 解析，才會繼續執行 router.push()
    };

    request.onerror = function (event: Event) {
      console.log("數據寫入失敗", event);
      reject(event); // 🔥 確保 Promise 失敗時能夠捕獲錯誤
    };
  });
}
// export function updateDBByIndex(db: IDBDatabase, storeName: string,indexName:string ,indexValue:any) {
//   var request = db
//     .transaction([storeName], "readwrite") // 事务对象
//     .objectStore(storeName) // 仓库对象
//     .index(indexName) // 索引对象
//     .put(indexValue);

//   request.onsuccess = function () {
//     console.log("数据更新成功");
//   };

//   request.onerror = function () {
//     console.log("数据更新失败");
//   };
// }

/**
 * 通过索引和游标删除指定的数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名
 * @param {object} indexValue 索引值
 */
export function cursorDelete(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: any
) {
  var store = db.transaction(storeName, "readwrite").objectStore(storeName);
  var request = store
    .index(indexName) // 索引对象
    .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
  request.onsuccess = function (e: Event) {
    var cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
    var deleteRequest;
    if (cursor) {
      deleteRequest = cursor.delete(); // 请求删除当前项
      deleteRequest.onerror = function () {
        console.log("游标删除该记录失败");
      };
      deleteRequest.onsuccess = function () {
        console.log("游标删除该记录成功");
      };
      cursor.continue();
    }
  };
  request.onerror = function (e: Event) {};
}
