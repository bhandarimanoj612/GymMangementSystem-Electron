import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { PosPrintOptions } from "@alvarosacari/electron-pos-printer";
import { autoUpdater } from "electron-updater";
process.env.DIST = path.join(__dirname, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");


//Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let win: BrowserWindow | null;
let printWindow: BrowserWindow | null; // Declare the printWindow variable here
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, "nutrilogo.jpg"),
    height: 750,
    title: "NutriHub",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });
  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
  win.setMinimumSize(500, 750);
  // Menu.setApplicationMenu(null);
  // win.maximize();
}

app.on("window-all-closed", () => {
  win = null;
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  createWindow();
  printWindow = new BrowserWindow({ show: false }); // Create the printWindow when the app is ready


  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  autoUpdater.checkForUpdates();
});





autoUpdater.on("update-available", (info) => {
  info.version;
  autoUpdater.downloadUpdate();
});
// handles prints recipt

ipcMain.handle("print", (event, args) => {
  event.frameId; // used here to prevent build error -> no any specific use
  const printTable = args.printTable;
  const printPrice = args.printPrice;
  const printBillNo = args.printBillNo;
  const nepaliDate = args.nepaliDate;
  const printmemberName = args.printmemberName;

  const printableHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bill</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      .container {
        width: 300px;
        font-family: Arial, sans-serif;
      }
      .inner-container {
        max-width: 100%;
        height: 100%;
        background-color: #f1f1f1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-block: 1em;
      }
      .organizational-details {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 1em;
      }
      .name {
        font-size: 1.2em;
        font-weight: 500;
        text-transform: uppercase;
      }
      .address,
      .phone,
      .pan {
        font-size: 0.9em;
        font-weight: 300;
        margin-top: 0.15rem;
      }
      .title {
        font-size: 1.05em;
        font-weight: 500;
        text-transform: uppercase;
        margin-top: 0.75rem;
      }
      .bill-head {
        width: 100%;
        
        margin-bottom: 0.5em;
        font-size: 0.95rem;
      }
      .bill-head-content {
        display: flex;
        width: fit-content;
        column-gap: .5em;
      }
      .bill {
        width: 100%;
        height: 100%;
     
      }
      table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        font-size: 0.9em;
        line-height: 1.25rem;
      }
      thead tr {
        border-block: 1px dotted #585858;
      }
      thead tr th {
        padding-block: 0.5em;
      }
      .total {
        display: flex;
        flex-direction: column;
        align-items: end;
        margin-top: 0.5em;
      }
      .amount {
        display: flex;
        justify-content: space-between;
        column-gap: 2em;
        padding-inline: 2em;
        font-size: 0.9em;
      }
      .amount-text {
        text-align: right;
      }
      .total > :nth-child(2) {
        margin-top: 0.5rem;
      }
      .user-name {
        margin-bottom: 0.5rem;
        text-transform: uppercase;
      }
      .amount-in-words {
        margin-block: 0.5rem;
        text-transform:capitalize;
      }
      .date,
      .visiting,
      .powered {
        display: flex;
        justify-content: center;
      }
      .visiting,
      .powered {
        margin-top: 0.25rem;
      }
      .image {
        width: 150px;
        height: 150px;
        display: flex;
        justify-content: center;
        margin-top: 0.5rem;
      }
      .image img {
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="inner-container">
        <div class="organizational-details">
          <p class="name">Super Market</p>
          <p class="address">Address : Itahari-5, Nepal</p>
          <p class="phone">Phone :025-2903891</p>
          <p class="pan">PAN : 776566291</p>
          <p class="pan">Date : ${nepaliDate}</p>
          <p class="title">Abbreviated tax invoice</p>
        </div>
        <div class="bill-head">
          <p class="bill-head-content">
            <span>Dear</span>
            <span>: ${printmemberName}</span>
            
          </p>
          <p class="bill-head-content">
            <span>Invoice No.</span>
            <span>: ${printBillNo}</span>
            
          </p>
        
        </div>
        <div class="bill">
          <table>
            <thead>
              <tr>
                <th>SN</th>
                <th>Particulars</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            ${printTable}
            </table>
            ${printPrice}
          <div class="visiting">
            <p class="">Thanks for visiting!</p>
          </div>
          <div class="powered">
            <p>Powered by <strong>NutriHub Softwares</strong></p>
          </div>
        </div>
        
      </div>
    </div>
  </body>
</html>`;
  // const printWindow = new BrowserWindow({ show: false });
  printWindow?.webContents.getPrintersAsync().then((printers) => {
    let printer: Electron.PrinterInfo = {} as Electron.PrinterInfo;
    printers.forEach((p) => {
    
      if (p.isDefault) {
        printer = p;
      }
      
    });
    if (Object.keys(printer).length >= 0) {
    
      const options: PosPrintOptions = {
        preview: false,
        width: "100%",
        margin: "0 0 0 0",
        copies: 1,
        printerName: printer.name,
        timeOutPerLine: 400,
        silent: true,
      };
      printWindow?.loadURL(
        `data:text/html,${encodeURIComponent(printableHTML)}`
      );
      printWindow?.webContents.on("did-finish-load", () => {
        printWindow?.webContents.print(options);
      });
    }
  });
});
// handles prints payments
ipcMain.handle("printPayments", (event, args) => {
  event.frameId; // used here to prevent build error -> no any specific use
  const printPayments = args.printPayments;
  const printPrice = args.printPrice;
  const month = args.month;

  const printableHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bill</title>
    <style>
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: center;
      font-size: 0.9em;
      line-height: 1.25rem;
    }
    thead tr {
      border-block: 1px dotted #585858;
    }
    thead tr th {
      padding-block: 0.5em;
    }
    .end{
      display:flex;
      justify-content: flex-end;
      padding-top:1em
    }
    .title {
      font-size: 1.05em;
      font-weight: 700;
      text-transform: uppercase;
      margin-top: 0.3em;
      margin-bottom: 1rem;
      margin-left:15em
    }
    .amount-in-words {
      margin-block: 0.5rem;
      text-transform:capitalize;
    }

  </style>
  </head>
  <body>
    <div class="container">
  <div class="title">
  Payments Details of ${month}
  </div>
    <table>
      <thead>
        <tr>
          <th>SN</th>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Unit</th>
          <th>Rate</th>
          <th>Net Amount</th>
        </tr>
      </thead>
      ${printPayments}
      </table>



    
    </div>
    <div class="end">
    <div >
    ${printPrice}
    </div>
    </div>
  </body>
</html>`;
  // const printWindow = new BrowserWindow({ show: false });
  // printWindow?.webContents.getPrintersAsync().then((printers) => {
  //   let printer: Electron.PrinterInfo = {} as Electron.PrinterInfo;
  //   printers.forEach((p) => {
  //     if(!p.isDefault){
  //       printer = p;
  //     }
  //   });
  //   if (Object.keys(printer).length >= 0) {
    
  //        const options: PosPrintOptions = {
  //       preview: false,
  //       width: "100%",
  //       margin: "0 0 0 0",
  //       copies: 1,
  //       printerName: printer.name,
  //       timeOutPerLine: 400,
  //       silent: false,
  //     };
      
     
  //     printWindow?.loadURL(
  //       `data:text/html,${encodeURIComponent(printableHTML)}`
  //     );
  //     printWindow?.webContents.on("did-finish-load", () => {
  //       printWindow?.webContents.print(options);
  //     });
  //   }
    
  // });
  printToPDF(printableHTML);





  
 



});
function printToPDF(htmlContent: string) {
  printWindow?.webContents.loadURL(`data:text/html,${encodeURIComponent(htmlContent)}`);
  printWindow?.webContents.on("did-finish-load", () => {
    printWindow?.webContents.print({
      silent: false,
      printBackground: false,
    });
  });
}