const puppeteer = require("puppeteer");
const Printer = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const { trycatch } = require("../helpers/trycatch");
const { ErrorHandler } = require("../helpers/errrorHandling");

exports.htmltopdf = trycatch(async (req, res, next) => {
  try {
    const {
      conformationId,
      subTotal,
      orderBy,
      status,
      line1,
      line2,
      city,
      customer,
      country,
      metadata,
    } = await req.body;

    const timestamps = Date.now();
    const date = new Date(timestamps);
    const templatePath = path.join(__dirname, "../views/invoice.ejs");

    // Load the EJS template
    const templateContent = fs.readFileSync(templatePath, "utf-8");

    // Render the template with dynamic data
    const html = ejs.render(templateContent, {
      conformationId,
      date,
      subTotal,
      orderBy,
      status,
      line1,
      line2,
      city,
      customer,
      country,
      metadata,
      time: `(${
        date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
      }:${date.getMinutes().toString().padStart(2, "0")} ${
        date.getHours() >= 12 ? "PM" : "AM"
      })`,
    });

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    // Set a large initial viewport height
    await page.setViewport({ width: 800, height: 2000 });

    await page.setContent(html);

    // Measure content height
    let contentHeight = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;

      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );

      return height;
    });

    // Adjust viewport height and re-measure if needed (you may need to fine-tune this loop)
    while (contentHeight > 2000) {
      contentHeight = await page.evaluate(() => {
        window.scrollBy(0, 2000); // Scroll down by 2000 pixels
        return Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
      });
    }

    // Set the viewport height based on the calculated content height
    await page.setViewport({ width: 800, height: contentHeight });

    const pdfBuffer = await page.pdf({
      format: "A6", // Set A6 paper size
      printBackground: true,
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="invoice.pdf"');
    res.send(pdfBuffer);

    await browser.close();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating PDF");
  }
});

exports.htmltopdfKitchen = trycatch(async (req, res, next) => {
  try {
    const { orderBy, status, customer, metadata } = await req.body;
    const timestamps = Date.now();
    const date = new Date(timestamps);
    const template = path.join(__dirname, "../views/kitchen.ejs");
    const html = await ejs.renderFile(template, {
      orderBy,
      status,
      customer,
      metadata,
      time: `( ${
        date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
      }:${date.getMinutes().toString().padStart(2, "0")} ${
        date.getHours() >= 12 ? "PM" : "AM"
      } )`,
    });

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: "A6" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="invoice.pdf"');

    res.send(pdfBuffer);

    await browser.close();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating PDF");
  }
});

exports.thermalPrinting = trycatch(async (req, res, next) => {
  let printer = new Printer({
    type: PrinterTypes.EPSON,
    interface: "tcp://111.111.111.111",
  });
  printer.alignCenter();
  printer.println("Hello world");
  var data = "TESTing";
  var type = 7;
  var settings = {
    characters: 1,
    mode: 3,
    height: 150,
  };

  printer.printBarcode(data, type, settings);
  printer.cut();

  try {
    const isConnected = await printer.isPrinterConnected();
    if (isConnected) {
      await printer.execute();
      await printer.beep();
      return res.status(200).json({
        success: true,
        message: "Print Done!",
      });
    }
    return next(new ErrorHandler(500, "Printer is not connected!"));
  } catch (error) {
    console.error(`printing error! ${error}`);
    return next(new ErrorHandler(500));
  }
});
