import Transaction from "../models/Transaction.js";
import PDFDocument from "pdfkit";

// ─────────────────────────────────────────────
// @desc    Get filtered report data (summary + transactions)
// @route   GET /api/reports
// @access  Private
// ─────────────────────────────────────────────
export const getReportData = async (req, res) => {
  try {
    const { startDate, endDate, category, type } = req.query;
    const userId = req.user._id;

    // Build the query object
    const query = { userId };

    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) query.transactionDate.$gte = new Date(startDate);
      if (endDate) query.transactionDate.$lte = new Date(endDate);
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (type && type !== "All") {
      query.type = type;
    }

    // Execute aggregation for summary stats
    const summary = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
    ]);

    const stats = summary[0] || { totalIncome: 0, totalExpense: 0 };
    const netSavings = stats.totalIncome - stats.totalExpense;

    // Fetch the actual transactions matching the query
    const transactions = await Transaction.find(query).sort({ transactionDate: -1 });

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome: stats.totalIncome,
          totalExpense: stats.totalExpense,
          netSavings,
        },
        transactions,
      },
    });
  } catch (err) {
    console.error("Report generation error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ─────────────────────────────────────────────
// @desc    Download report (PDF or CSV)
// @route   GET /api/reports/download
// @access  Private
// ─────────────────────────────────────────────
export const downloadReport = async (req, res) => {
  try {
    const { startDate, endDate, category, type, format } = req.query;
    const userId = req.user._id;

    const query = { userId };
    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) query.transactionDate.$gte = new Date(startDate);
      if (endDate) query.transactionDate.$lte = new Date(endDate);
    }
    if (category && category !== "All") query.category = category;
    if (type && type !== "All") query.type = type;

    const transactions = await Transaction.find(query).sort({ transactionDate: -1 });

    if (format === "csv") {
      const csvHeader = "Date,Title,Category,Type,Amount,Payment Method\n";
      
      const escapeCSV = (value) => {
        if (value == null) return '""';
        let str = String(value);
        // Prevent CSV Injection (formula injection)
        if (/^[=+\-@]/.test(str)) {
          str = "'" + str;
        }
        // Escape double quotes by doubling them
        str = str.replace(/"/g, '""');
        return `"${str}"`;
      };

      const csvRows = transactions.map(t => {
        const date = new Date(t.transactionDate).toLocaleDateString();
        return `${escapeCSV(date)},${escapeCSV(t.title)},${escapeCSV(t.category)},${escapeCSV(t.type)},${t.amount},${escapeCSV(t.paymentMethod)}`;
      }).join("\n");
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=report.csv");
      return res.status(200).send(csvHeader + csvRows);
    }
    else if (format === "pdf") {
      const doc = new PDFDocument({ margin: 50 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
      doc.pipe(res);

      doc.fontSize(20).text("Financial Report", { align: "center" });
      doc.moveDown();
      
      let totalIncome = 0;
      let totalExpense = 0;
      transactions.forEach(t => {
        if (t.type === "income") totalIncome += t.amount;
        else totalExpense += t.amount;
      });

      doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`);
      doc.text(`Total Income: Rs ${totalIncome}`);
      doc.text(`Total Expense: Rs ${totalExpense}`);
      doc.text(`Net Savings: Rs ${totalIncome - totalExpense}`);
      doc.moveDown();

      doc.fontSize(14).text("Transactions List", { underline: true });
      doc.moveDown();

      transactions.forEach(t => {
        const date = new Date(t.transactionDate).toLocaleDateString();
        doc.fontSize(10).text(`${date} - ${t.title} [${t.category}] : Rs ${t.amount} (${t.type})`);
      });

      doc.end();
    } else {
      return res.status(400).json({ success: false, message: "Invalid format. Use 'csv' or 'pdf'." });
    }
  } catch (err) {
    console.error("Report download error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
